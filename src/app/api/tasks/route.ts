import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Task } from '@/types/task';

const DATA_FILE = path.join(process.cwd(), 'data', 'tasks.json');

async function readTasks(): Promise<Task[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data).tasks;
  } catch {
    return [];
  }
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify({ tasks }, null, 2));
}

export async function GET() {
  const tasks = await readTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const tasks = await readTasks();
  const newTask: Task = await request.json();
  
  newTask.id = `task-${Date.now()}`;
  newTask.createdAt = new Date().toISOString();
  newTask.updatedAt = new Date().toISOString();
  
  tasks.push(newTask);
  await writeTasks(tasks);
  
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const tasks = await readTasks();
  const updatedTask: Task = await request.json();
  
  const index = tasks.findIndex(t => t.id === updatedTask.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  
  updatedTask.updatedAt = new Date().toISOString();
  tasks[index] = updatedTask;
  await writeTasks(tasks);
  
  return NextResponse.json(updatedTask);
}

export async function PATCH(request: NextRequest) {
  const tasks = await readTasks();
  const { id, ...updates } = await request.json();
  
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  
  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  await writeTasks(tasks);
  
  return NextResponse.json(tasks[index]);
}
