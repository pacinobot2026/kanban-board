'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, PRIORITY_COLORS } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const DARK_PRIORITY_COLORS = {
  'Low': 'bg-green-500/20 text-green-400',
  'Med': 'bg-yellow-500/20 text-yellow-400',
  'High': 'bg-red-500/20 text-red-400',
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800/50 rounded-lg border border-gray-700 p-3 cursor-grab active:cursor-grabbing hover:bg-gray-800 hover:border-gray-600 transition-all"
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-100 text-sm leading-tight">{task.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${DARK_PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.description}</p>
      )}
      
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map(tag => (
            <span key={tag} className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="text-xs text-gray-500 flex justify-between">
        <span>Created {formatDate(task.createdAt)}</span>
        <span>Updated {formatDate(task.updatedAt)}</span>
      </div>
    </div>
  );
}
