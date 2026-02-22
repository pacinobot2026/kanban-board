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
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

const COLUMN_STYLES: Record<Status, { border: string; badge: string; icon: string }> = {
  'inbox': { border: 'border-gray-700', badge: 'bg-gray-700', icon: '📥' },
  'assigned': { border: 'border-blue-600/30', badge: 'bg-blue-600/20 text-blue-400', icon: '👤' },
  'in-progress': { border: 'border-purple-600/30', badge: 'bg-purple-600/20 text-purple-400', icon: '🚧' },
  'review': { border: 'border-teal-600/30', badge: 'bg-teal-600/20 text-teal-400', icon: '👁️' },
  'done': { border: 'border-green-600/30', badge: 'bg-green-600/20 text-green-400', icon: '✅' },
};

export function Column({ id, title, tasks, onEditTask, onToggleSubtask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const style = COLUMN_STYLES[id];

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 sm:w-80 lg:w-[340px] bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 ${style.border} ${
        isOver ? 'ring-2 ring-purple-500 ring-opacity-50 shadow-lg shadow-purple-500/20' : ''
      } transition-all flex flex-col`}
    >
      <div className="p-3 lg:p-4 border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-100 flex items-center gap-2 text-sm lg:text-base">
            <span className="text-base lg:text-lg">{style.icon}</span>
            {title}
          </h2>
          <span className={`text-xs font-medium px-2 lg:px-2.5 py-1 rounded-full ${style.badge}`}>
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="p-2 lg:p-3 space-y-2 lg:space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onToggleSubtask={onToggleSubtask} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="text-center py-8 lg:py-12 text-gray-600 text-sm">
            <div className="text-3xl lg:text-4xl mb-2 opacity-20">{style.icon}</div>
            <div>Drop tasks here</div>
          </div>
        )}
      </div>
    </div>
  );
}
