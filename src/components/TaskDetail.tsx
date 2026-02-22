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
  const [newComment, setNewComment] = useState('');
  const [newSubtaskText, setNewSubtaskText] = useState('');

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

  const assigneeInfo = assignee ? TEAM_MEMBERS.find(m => m.id === assignee) : null;
  
  // Handle subtasks
  const parsedSubtasks = (() => {
    if (!task.subtasks) return [];
    if (Array.isArray(task.subtasks)) return task.subtasks;
    if (typeof task.subtasks === 'string') {
      try {
        const parsed = JSON.parse(task.subtasks);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  })();
  
  const completedSubtasks = parsedSubtasks.filter(s => s.completed).length;
  const totalSubtasks = parsedSubtasks.length;

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = parsedSubtasks.map(s => 
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    onSave({ ...task, subtasks: updatedSubtasks });
  };

  const addSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const newSubtask = {
      id: Date.now().toString(),
      text: newSubtaskText,
      completed: false
    };
    onSave({ ...task, subtasks: [...parsedSubtasks, newSubtask] });
    setNewSubtaskText('');
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
      <div className="fixed inset-y-0 left-0 w-[420px] z-50 bg-gray-900 border-r border-gray-800 flex flex-col shadow-2xl">
        {/* Header with Tabs */}
        <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur">
          <div className="px-4 py-3 flex items-center justify-between">
            <h2 className="text-white font-semibold">Task Details</h2>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          {/* Tabs */}
          <div className="flex px-4 gap-6 border-b border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-purple-500 font-medium'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
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
              {/* Title with Priority Badge */}
              <div className="flex items-start gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                  task.priority === 'High' ? 'bg-red-600/20 text-red-400' :
                  task.priority === 'Med' ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {task.priority}
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 text-lg font-semibold bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-gray-500"
                  placeholder="Task title..."
                />
              </div>

              {/* Checklist / Subtasks */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Checklist</h3>
                  <span className="text-xs text-gray-500">{completedSubtasks}/{totalSubtasks}</span>
                </div>
                
                {totalSubtasks > 0 && (
                  <div className="space-y-2 mb-3">
                    {parsedSubtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-start gap-3 group">
                        <button 
                          className="text-gray-500 hover:text-purple-400 transition-colors mt-0.5"
                          onClick={() => toggleSubtask(subtask.id)}
                        >
                          {subtask.completed ? '✅' : '☐'}
                        </button>
                        <span className={`text-sm flex-1 ${subtask.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                          {subtask.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Subtask Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                    placeholder="Add an item..."
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={addSubtask}
                    disabled={!newSubtaskText.trim()}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Add a description..."
                />
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Status */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="w-full bg-gray-800 text-sm text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>

                {/* Project */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <label className="text-xs text-gray-500 mb-1.5 block">Project</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full bg-gray-800 text-sm text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select...</option>
                    {PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Assignee */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <label className="text-xs text-gray-500 mb-1.5 block">Assignee</label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full bg-gray-800 text-sm text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Unassigned</option>
                    {TEAM_MEMBERS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <label className="text-xs text-gray-500 mb-1.5 block">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-gray-800 text-sm text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-gray-500">Progress</label>
                  <span className="text-sm text-white font-medium">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full mt-3 opacity-50 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    onArchive?.(task.id);
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-gray-800 text-yellow-400 rounded-lg hover:bg-gray-700 transition-colors"
                  title="Archive"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    onDelete?.(task.id);
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-gray-800 text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <p className="text-gray-400 mb-4">No files attached</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                Upload File
              </button>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4">
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p>No comments yet</p>
                </div>
              </div>
              {/* Comment Input */}
              <div className="border-t border-gray-800 p-4 bg-gray-900">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs flex-shrink-0">
                    🎬
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
