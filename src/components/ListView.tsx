'use client';

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
  'inbox': 'bg-gray-700 text-gray-300',
  'assigned': 'bg-blue-600 text-blue-100',
  'in-progress': 'bg-purple-600 text-purple-100',
  'review': 'bg-teal-600 text-teal-100',
  'done': 'bg-green-600 text-green-100',
};

export function ListView({ tasks, onEditTask, onToggleSubtask, onDeleteTask, onArchiveTask }: ListViewProps) {
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

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No tasks found
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead className="bg-gray-800 sticky top-0">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Task</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Priority</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Assignee</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Due Date</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Progress</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {tasks.map((task) => {
            const assignee = getAssignee(task.assignee);
            const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
            const totalSubtasks = task.subtasks?.length || 0;
            const progress = totalSubtasks > 0 
              ? Math.round((completedSubtasks / totalSubtasks) * 100)
              : task.progress || 0;

            return (
              <tr 
                key={task.id} 
                className="hover:bg-gray-800/50 transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    {task.subtasks && task.subtasks.length > 0 && (
                      <button
                        onClick={() => onToggleSubtask?.(task.id, task.subtasks![0].id)}
                        className="mt-0.5 text-gray-500 hover:text-purple-400"
                      >
                        {task.subtasks[0].completed ? '✅' : '☐'}
                      </button>
                    )}
                    <div>
                      <p 
                        className="text-sm font-medium text-gray-200 cursor-pointer hover:text-purple-400"
                        onClick={() => onEditTask(task)}
                      >
                        {task.title}
                      </p>
                      {task.subtasks && task.subtasks.length > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{task.subtasks.length - 1} more subtasks
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[task.status]}`}>
                    {COLUMNS.find(c => c.id === task.status)?.title}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs">
                        {assignee.avatar}
                      </div>
                      <span className="text-sm text-gray-300">{assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {task.dueDate ? (
                    <span className="text-sm text-gray-400">{formatDate(task.dueDate)}</span>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    <button
                      onClick={() => onDeleteTask?.(task.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
