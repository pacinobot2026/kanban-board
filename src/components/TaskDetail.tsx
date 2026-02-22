'use client';

import { useState } from 'react';
import { Task, Priority, Status, COLUMNS, PROJECTS, TEAM_MEMBERS } from '@/types/task';

type Tab = 'details' | 'files' | 'comments';

interface TaskDetailProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  onArchive?: (taskId: string) => void;
}

export function TaskDetail({ task, isOpen, onClose, onSave, onDelete, onArchive }: TaskDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Med');
  const [status, setStatus] = useState<Status>('inbox');
  const [project, setProject] = useState('');
  const [assignee, setAssignee] = useState('');
  const [progress, setProgress] = useState(0);
  const [dueDate, setDueDate] = useState('');

  // Load task data when opened
  if (task && isOpen && title !== task.title) {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setProject(task.project);
    setAssignee(task.assignee || '');
    setProgress(task.progress || 0);
    setDueDate(task.dueDate || '');
  }

  if (!isOpen || !task) return null;

  const handleSave = () => {
    onSave({
      ...task,
      title,
      description,
      priority,
      status,
      project,
      assignee: assignee || undefined,
      progress,
      dueDate: dueDate || undefined,
    });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'details', label: 'Task Details' },
    { id: 'files', label: 'Files' },
    { id: 'comments', label: 'Comments' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      {/* Slide-out Panel from LEFT */}
      <div className="fixed inset-y-0 left-0 w-96 z-50 transform transition-transform bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Header with Tabs */}
        <div className="border-b border-gray-800">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Task</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          {/* Tabs */}
          <div className="flex px-4 pb-2 gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-purple-400'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Med">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Project & Assignee */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Project</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Project</option>
                    {PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Assignee</label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Unassigned</option>
                    {TEAM_MEMBERS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Progress */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Progress ({progress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📎</div>
              <p>No files attached yet</p>
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Upload File
              </button>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p>No comments yet</p>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <textarea
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Post Comment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {activeTab === 'details' && (
          <div className="p-4 border-t border-gray-800 space-y-2">
            <button
              onClick={handleSave}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onArchive?.(task.id);
                  onClose();
                }}
                className="flex-1 py-2 bg-gray-800 text-yellow-400 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => {
                  onDelete?.(task.id);
                  onClose();
                }}
                className="flex-1 py-2 bg-gray-800 text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
