'use client';

import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, Status, COLUMNS, TEAM_MEMBERS } from '@/types/task';

interface ListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onArchiveTask?: (taskId: string) => void;
  onAddTask?: (status: Status) => void;
  onReorderTasks?: (tasks: Task[]) => void;
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

interface SortableSectionProps {
  column: { id: Status; title: string };
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  taskCount: number;
  onAddTask: () => void;
}

function SortableSection({ column, children, isExpanded, onToggle, taskCount, onAddTask }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg overflow-hidden">
      {/* Section Header Bar */}
      <div className={`px-4 py-2.5 flex items-center justify-between ${STATUS_BG_COLORS[column.id]}`}>
        <button
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
        >
          <span>{STATUS_ICONS[column.id]}</span>
          <span className="font-medium text-gray-200">{column.title}</span>
          <span className="text-sm text-gray-500">({taskCount})</span>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddTask}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Add Task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          {/* Drag Handle for Section */}
          <button
            {...attributes}
            {...listeners}
            className="p-1.5 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing"
            title="Drag to reorder section"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

interface SortableTaskProps {
  task: Task;
  onEdit: () => void;
  onToggleSubtask?: () => void;
  onArchive?: () => void;
  formatDate: (date: string) => string;
  getAssignee: (id?: string) => typeof TEAM_MEMBERS[0] | null | undefined;
}

function SortableTask({ task, onEdit, onToggleSubtask, onArchive, formatDate, getAssignee }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const assignee = getAssignee(task.assignee);
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 
    ? Math.round((completedSubtasks / totalSubtasks) * 100)
    : task.progress || 0;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="px-4 py-3 flex items-center gap-4 hover:bg-gray-800/50 transition-colors group bg-gray-900/30"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing p-1"
        title="Drag to reorder"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
        </svg>
      </button>

      {/* Checkbox */}
      {task.subtasks && task.subtasks.length > 0 ? (
        <button
          onClick={onToggleSubtask}
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
          onClick={onEdit}
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
          onClick={onEdit}
          className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onArchive}
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
}

export function ListView({ tasks, onEditTask, onToggleSubtask, onDeleteTask, onArchiveTask, onAddTask, onReorderTasks }: ListViewProps) {
  const [expandedSections, setExpandedSections] = useState<Record<Status, boolean>>({
    'inbox': true,
    'assigned': true,
    'in-progress': true,
    'review': true,
    'done': false,
  });
  
  const [columnOrder, setColumnOrder] = useState(COLUMNS);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dragging a column (section)
    const isColumn = columnOrder.some(c => c.id === activeId);
    if (isColumn && activeId !== overId) {
      const oldIndex = columnOrder.findIndex(c => c.id === activeId);
      const newIndex = columnOrder.findIndex(c => c.id === overId);
      setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
      return;
    }

    // Check if dragging a task
    const isTask = tasks.some(t => t.id === activeId);
    if (isTask && activeId !== overId && onReorderTasks) {
      const activeTask = tasks.find(t => t.id === activeId);
      const overTask = tasks.find(t => t.id === overId);
      
      if (activeTask && overTask && activeTask.status === overTask.status) {
        // Reorder within same status
        const columnTasks = tasks.filter(t => t.status === activeTask.status);
        const oldIndex = columnTasks.findIndex(t => t.id === activeId);
        const newIndex = columnTasks.findIndex(t => t.id === overId);
        
        const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
        const otherTasks = tasks.filter(t => t.status !== activeTask.status);
        onReorderTasks([...otherTasks, ...reorderedColumnTasks]);
      }
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No tasks found
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={columnOrder.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 pb-8">
          {columnOrder.map((column) => {
            const sectionTasks = getTasksByStatus(column.id);
            const isExpanded = expandedSections[column.id];
            
            return (
              <SortableSection
                key={column.id}
                column={column}
                isExpanded={isExpanded}
                onToggle={() => toggleSection(column.id)}
                taskCount={sectionTasks.length}
                onAddTask={() => onAddTask?.(column.id)}
              >
                {isExpanded && sectionTasks.length > 0 && (
                  <SortableContext items={sectionTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="divide-y divide-gray-800/50">
                      {sectionTasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onEdit={() => onEditTask(task)}
                          onToggleSubtask={() => onToggleSubtask?.(task.id, task.subtasks?.[0]?.id || '')}
                          onArchive={() => onArchiveTask?.(task.id)}
                          formatDate={formatDate}
                          getAssignee={getAssignee}
                        />
                      ))}
                    </div>
                  </SortableContext>
                )}
                
                {isExpanded && sectionTasks.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-600 italic bg-gray-900/30">
                    No tasks
                  </div>
                )}
              </SortableSection>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
