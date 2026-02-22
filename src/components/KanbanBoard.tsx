'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Task, Status, COLUMNS, PROJECTS, TaskType, TEAM_MEMBERS } from '@/types/task';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { ProjectSidebar } from './ProjectSidebar';
import { ActivityFeed } from './ActivityFeed';
import { NavigationSidebar } from './NavigationSidebar';

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all');
  const [showProjectSidebar, setShowProjectSidebar] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [showMobileActivity, setShowMobileActivity] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/login');
    router.refresh();
  };

  const sensors = useSensors(
    useSensor(PointerSensor,{
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    
    // Check if dropping on a column
    const isColumn = COLUMNS.some(col => col.id === overId);
    if (isColumn) {
      const newStatus = overId as Status;
      if (activeTask.status !== newStatus) {
        setTasks(prev =>
          prev.map(t =>
            t.id === activeTask.id ? { ...t, status: newStatus } : t
          )
        );
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Save the updated status to database
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeTask.id, status: activeTask.status }),
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      fetchTasks(); // Revert on error
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (taskData.id) {
        // Update existing task
        const existingTask = tasks.find(t => t.id === taskData.id);
        const fullTask = { ...existingTask, ...taskData };
        await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullTask),
        });
      } else {
        // Create new task
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
      }
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleSelectProject = (projectId: string | null) => {
    setSelectedProject(projectId);
    setShowProjectSidebar(false); // Close on mobile after selection
  };

  const filteredTasks = tasks.filter(t => {
    const projectMatch = selectedProject ? t.project === selectedProject : true;
    const typeMatch = typeFilter === 'all' ? true : t.type === typeFilter;
    return projectMatch && typeMatch;
  });

  const getTasksByStatus = (status: Status) => {
    return filteredTasks.filter(t => t.status === status);
  };

  const projectCounts = PROJECTS.map(project => ({
    ...project,
    count: tasks.filter(t => t.project === project.id).length,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Far Left - Navigation Sidebar */}
      <NavigationSidebar />

      {/* Left Sidebar - Projects (Desktop always visible, Mobile slide-in) */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-30 transform transition-transform duration-300
        ${showProjectSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <ProjectSidebar
          projects={projectCounts}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
        />
      </div>

      {/* Overlay for mobile */}
      {showProjectSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setShowProjectSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900/50 px-4 lg:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title & Project */}
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowProjectSidebar(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-white">Team Board</h1>
                <p className="text-gray-400 text-sm">
                  {selectedProject ? PROJECTS.find(p => p.id === selectedProject)?.name : 'All Projects'} • {filteredTasks.length} tasks
                </p>
              </div>
            </div>

            {/* Center: Team Member Avatars */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-gray-500 text-sm mr-2">Team:</span>
              {TEAM_MEMBERS.map((member) => (
                <button
                  key={member.id}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium text-sm hover:ring-2 hover:ring-purple-400 transition-all"
                  title={member.name}
                >
                  {member.name.charAt(0)}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Bell button (mobile only) */}
              <button
                onClick={() => setShowMobileActivity(true)}
                className="xl:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors relative"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {tasks.filter(t => t.status === 'in-progress').length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                )}
              </button>
              
              <button
                onClick={handleNewTask}
                className="px-3 lg:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg text-sm lg:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="hidden sm:flex px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors items-center gap-2 text-sm lg:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="h-full overflow-x-auto overflow-y-hidden">
              <div className="flex gap-3 lg:gap-4 p-4 lg:p-6 min-w-max h-full">
                {COLUMNS.map(column => (
                  <Column
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    tasks={getTasksByStatus(column.id)}
                    onEditTask={handleEditTask}
                  />
                ))}
              </div>
            </div>

            <DragOverlay>
              {activeTask && (
                <TaskCard task={activeTask} onEdit={() => {}} />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Right Sidebar - Activity (Desktop always visible) */}
      <div className="hidden xl:block">
        <ActivityFeed tasks={tasks} />
      </div>

      {/* Mobile Activity Feed Overlay */}
      {showMobileActivity && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
            onClick={() => setShowMobileActivity(false)}
          />
          <div className="fixed inset-y-0 right-0 w-80 z-50 xl:hidden transform transition-transform">
            <div className="h-full bg-gray-900 border-l border-gray-800 flex flex-col">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-white font-bold text-lg">🔔 Activity</h2>
                <button
                  onClick={() => setShowMobileActivity(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ActivityFeed tasks={tasks} />
              </div>
            </div>
          </div>
        </>
      )}

      <TaskModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}
