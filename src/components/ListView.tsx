'use client';

import { useState } from 'react';
import { Task, Status, COLUMNS, TEAM_MEMBERS } from '@/types/task';

interface ListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onArchiveTask?: (taskId: string) => void;
}

const PRIORITY_COLORS = {
  'Low': 'bg-gray-600',
  'Med': 'bg-yellow-600',
  'High': 'bg-red-600',
};

const STATUS_BG_COLORS: Record<Status, string> = {
  'inbox': 'bg-gray-700/50',
  'assigned': 'bg-blue-900/20',
  'in-progress': 'bg-purple-900/20',
  'review': 'bg-teal-900/20',
  'done': 'bg-green-900/20',
};

const STATUS_ICONS: Record<Status, string> = {
  'inbox': '📥',
  'assigned': '👤',
  'in-progress': '🚧',
  'review': '👁️',
  'done': '✅',
};

export function ListView({ tasks, onEditTask, onToggleSubtask, onDeleteTask, onArchiveTask }: ListViewProps) {
  const [expandedSections, setExpandedSections] = useState<Record<Status, boolean>>({
    'inbox': true,
    'assigned': true,
    'in-progress': true,
    'review': true,
    'done': false,
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getAssignee = (assigneeId?: string) => {
    if (!assigneeId) return null;
    return TEAM_MEMBERS.find(m => m.id === assigneeId);
  };

  const toggleSection = (status: Status) => {
    setExpandedSections(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const getTasksByStatus = (status: Status) => tasks.filter(t => t.status === status);

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-8">
      {COLUMNS.map((column) => {
        const sectionTasks = getTasksByStatus(column.id);
        const isExpanded = expandedSections[column.id];
        
        return (
          <div key={column.id} className="rounded-lg overflow-hidden">
            {/* Section Header Bar */}
            <button
              onClick={() => toggleSection(column.id)}
              className={`w-full px-4 py-2.5 flex items-center justify-between ${STATUS_BG_COLORS[column.id]} hover:opacity-80 transition-opacity`}
            >
              <div className="flex items-center gap-3">
                <span>{STATUS_ICONS[column.id]}</span>
                <span className="font-medium text-gray-200">{column.title}</span>
                <span className="text-sm text-gray-500">({sectionTasks.length})</span>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Task Rows */}
            {isExpanded && sectionTasks.length > 0 && (
              <div className="bg-gray-900/30">
                {sectionTasks.map((task, index) => {
                  const assignee = getAssignee(task.assignee);
                  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
                  const totalSubtasks = task.subtasks?.length || 0;
                  const progress = totalSubtasks > 0 
                    ? Math.round((completedSubtasks / totalSubtasks) * 100)
                    : task.progress || 0;

                  return (
                    <div 
                      key={task.id}
                      className={`px-4 py-3 flex items-center gap-4 hover:bg-gray-800/50 transition-colors group ${
                        index !== sectionTasks.length - 1 ? 'border-b border-gray-800/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      {task.subtasks && task.subtasks.length > 0 ? (
                        <button
                          onClick={() => onToggleSubtask?.(task.id, task.subtasks![0].id)}
                          className="text-gray-500 hover:text-purple-400 w-5"
                        >
                          {task.subtasks[0].completed ? '✅' : '☐'}
                        </button>
                      ) : (
                        <div className="w-5" />
                      )}

                      {/* Priority Dot */}
                      <div className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.priority]}`} />

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <p 
                          className="text-sm text-gray-200 cursor-pointer hover:text-purple-400 truncate"
                          onClick={() => onEditTask(task)}
                        >
                          {task.title}
                        </p>
                      </div>

                      {/* Assignee */}
                      <div className="hidden sm:flex items-center gap-2 w-28">
                        {assignee ? (
                          <>
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs flex-shrink-0">
                              {assignee.avatar}
                            </div>
                            <span className="text-xs text-gray-400 truncate">{assignee.name}</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </div>

                      {/* Due Date */}
                      <div className="hidden md:block w-20 text-xs text-gray-500">
                        {task.dueDate ? formatDate(task.dueDate) : '—'}
                      </div>

                      {/* Progress */}
                      <div className="hidden lg:flex items-center gap-2 w-24">
                        <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-7">{progress}%</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onArchiveTask?.(task.id)}
                          className="p-1.5 text-gray-500 hover:text-yellow-400 hover:bg-gray-700 rounded"
                          title="Archive"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {isExpanded && sectionTasks.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-600 italic bg-gray-900/30">
                No tasks
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
