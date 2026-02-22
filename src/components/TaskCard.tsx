'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, STATUS_LABEL_COLORS, TEAM_MEMBERS } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

const PRIORITY_COLORS = {
  'Low': 'bg-gray-700 text-gray-300',
  'Med': 'bg-yellow-600 text-yellow-100',
  'High': 'bg-red-600 text-red-100',
};

export function TaskCard({ task, onEdit, onToggleSubtask }: TaskCardProps) {
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

  const assignee = task.assignee ? TEAM_MEMBERS.find(m => m.id === task.assignee) : null;

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  
  // Auto-calculate progress from subtasks if they exist and no manual progress set
  const displayProgress = task.subtasks && task.subtasks.length > 0
    ? Math.round((completedSubtasks / totalSubtasks) * 100)
    : task.progress;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 cursor-grab active:cursor-grabbing hover:bg-gray-800 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
      onClick={() => onEdit(task)}
    >
      {/* Header with badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          {task.statusLabel && (
            <span className={`text-xs px-2 py-1 rounded-md font-medium ${STATUS_LABEL_COLORS[task.statusLabel]}`}>
              {task.statusLabel}
            </span>
          )}
          {/* Priority Badge */}
          <span className={`text-xs px-2 py-1 rounded-md font-medium ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        {task.daysSince && (
          <span className="text-xs text-gray-500 shrink-0">
            📅 {task.daysSince}d ago
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-100 text-sm leading-snug mb-2 group-hover:text-white transition-colors">
        {task.title}
      </h3>
      
      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Subtasks with clickable checkboxes */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {task.subtasks.slice(0, 3).map((subtask) => (
            <div 
              key={subtask.id} 
              className="flex items-start gap-2 text-xs cursor-pointer hover:bg-gray-700/50 rounded px-1 py-0.5 -mx-1"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSubtask?.(task.id, subtask.id);
              }}
            >
              <span className={subtask.completed ? 'text-green-400' : 'text-gray-600'}>
                {subtask.completed ? '✅' : '☐'}
              </span>
              <span className={`flex-1 ${subtask.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                {subtask.text}
              </span>
            </div>
          ))}
          {totalSubtasks > 3 && (
            <div className="text-xs text-gray-500 pl-5">
              +{totalSubtasks - 3} more
            </div>
          )}
          <div className="text-xs text-gray-400 font-medium pl-5 mt-2">
            {completedSubtasks}/{totalSubtasks} completed
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {(displayProgress !== undefined && displayProgress !== null) && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span className={displayProgress === 100 ? 'text-green-400' : ''}>{displayProgress}%</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                displayProgress === 100 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map(tag => (
            <span key={tag} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
        {/* Assignee */}
        {assignee && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs">
              {assignee.avatar}
            </div>
            <span className="text-xs text-gray-400">{assignee.name}</span>
          </div>
        )}
        {!assignee && <div />}

        {/* Dates */}
        <div className="flex items-center gap-3">
          {/* Date Created */}
          {task.createdAt && (
            <span className="text-xs text-gray-500" title="Created">
              📝 {formatDate(task.createdAt)}
            </span>
          )}
          {/* Due Date */}
          {task.dueDate && (
            <span className="text-xs text-gray-500" title="Due">
              📅 {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
