'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Status } from '@/types/task';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  id: Status;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const COLUMN_COLORS: Record<Status, string> = {
  'backlog': 'border-t-gray-500',
  'planned': 'border-t-blue-500',
  'in-progress': 'border-t-yellow-500',
  'blocked': 'border-t-red-500',
  'review': 'border-t-purple-500',
  'done': 'border-t-green-500',
};

export function Column({ id, title, tasks, onEditTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] max-w-[320px] bg-gray-900 rounded-xl border border-gray-800 border-t-4 ${COLUMN_COLORS[id]} ${
        isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-200">{title}</h2>
          <span className="bg-gray-800 text-gray-400 text-xs font-medium px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-250px)] overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-600 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
