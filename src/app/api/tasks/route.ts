import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Task } from '@/types/task';

const TASKS_KEY = 'kanban:tasks';

async function readTasks(): Promise<Task[]> {
  try {
    const tasks = await kv.get<Task[]>(TASKS_KEY);
    return tasks || [];
  } catch (error) {
    console.error('KV read error:', error);
    return [];
  }
}

async function writeTasks(tasks: Task[]): Promise<void> {
  try {
    await kv.set(TASKS_KEY, tasks);
  } catch (error) {
    console.error('KV write error:', error);
    throw error;
  }
}

export async function GET() {
  const tasks = await readTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle updateAll action
    if (body.action === 'updateAll' && body.tasks) {
      console.log('API: Saving tasks:', body.tasks.length);
      console.log('API: First task has images:', body.tasks[0]?.images?.length || 0);
      await writeTasks(body.tasks);
      console.log('API: Save complete');
      return NextResponse.json({ success: true, savedTasks: body.tasks.length });
    }
    
    // Handle regular task creation
    const tasks = await readTasks();
    const newTask: Task = body;
    
    newTask.id = `task-${Date.now()}`;
    newTask.createdAt = new Date().toISOString();
    newTask.updatedAt = new Date().toISOString();
    
    tasks.push(newTask);
    await writeTasks(tasks);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const tasks = await readTasks();
    const { id, ...updates } = await request.json();
    
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
    await writeTasks(tasks);
    
    return NextResponse.json(tasks[index]);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tasks = await readTasks();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const filtered = tasks.filter(t => t.id !== id);
    await writeTasks(filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
