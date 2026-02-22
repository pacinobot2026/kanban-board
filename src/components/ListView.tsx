'use client';

import { useState } from 'react';
import { Task, Status, COLUMNS, STATUS_LABEL_COLORS, TEAM_MEMBERS } from '@/types/task';

interface ListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onArchiveTask?: (taskId: string) => void;
}

const PRIORITY_COLORS = {
  'Low': 'bg-gray-700 text-gray-300',
  'Med': 'bg-yellow-600 text-yellow-100',
  'High': 'bg-red-600 text-red-100',
};

const STATUS_COLORS: Record<Status, string> = {
  'inbox': 'border-l-4 border-gray-500',
  'assigned': 'border-l-4 border-blue-500',
  'in-progress': 'border-l-4 border-purple-500',
  'review': 'border-l-4 border-teal-500',
  'done': 'border-l-4 border-green-500',
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
    <div className="space-y-4 pb-8">
      {COLUMNS.map((column) => {
        const sectionTasks = getTasksByStatus(column.id);
        const isExpanded = expandedSections[column.id];
        
        return (
          <div key={column.id} className="bg-gray-800/50 rounded-xl overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(column.id)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{STATUS_ICONS[column.id]}</span>
                <h3 className="font-semibold text-gray-100">{column.title}</h3>
                <span className="text-sm text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">
                  {sectionTasks.length}
                </span>
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
            {isExpanded && (
              <div className="divide-y divide-gray-700/50">
                {sectionTasks.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">
                    No tasks in {column.title.toLowerCase()}
                  </div>
                ) : (
                  sectionTasks.map((task) => {
                    const assignee = getAssignee(task.assignee);
                    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
                    const totalSubtasks = task.subtasks?.length || 0;
                    const progress = totalSubtasks > 0 
                      ? Math.round((completedSubtasks / totalSubtasks) * 100)
                      : task.progress || 0;

                    return (
                      <div 
                        key={task.id}
                        className={`px-4 py-3 hover:bg-gray-700/30 transition-colors group ${STATUS_COLORS[task.status]}`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Checkbox */}
                          {task.subtasks && task.subtasks.length > 0 ? (
                            <button
                              onClick={() => onToggleSubtask?.(task.id, task.subtasks![0].id)}
                              className="text-gray-500 hover:text-purple-400 transition-colors"
                            >
                              {task.subtasks[0].completed ? '✅' : '☐'}
                            </button>
                          ) : (
                            <div className="w-6" />
                          )}

                          {/* Title & Priority */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p 
                                className="font-medium text-gray-200 cursor-pointer hover:text-purple-400 truncate"
                                onClick={() => onEditTask(task)}
                              >
                                {task.title}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`}>
                                {task.priority}
                              </span>
                            </div>
                            {task.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                            )}
                          </div>

                          {/* Assignee */}
                          <div className="hidden sm:flex items-center gap-2 w-32">
                            {assignee ? (
                              <>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs flex-shrink-0">
                                  {assignee.avatar}
                                </div>
                                <span className="text-sm text-gray-300 truncate">{assignee.name}</span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">Unassigned</span>
                            )}
                          </div>

                          {/* Due Date */}
                          <div className="hidden md:block w-24 text-sm text-gray-400">
                            {task.dueDate ? formatDate(task.dueDate) : '—'}
                          </div>

                          {/* Progress */}
                          <div className="hidden lg:flex items-center gap-2 w-32">
                            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-8">{progress}%</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditTask(task)}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => onArchiveTask?.(task.id)}
                              className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded"
                              title="Archive"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
