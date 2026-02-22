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

const STATUS_BG_COLORS: Record<Status, string> = {
  'inbox': 'bg-gray-800/50',
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

    const isColumn = columnOrder.some(c => c.id === activeId);
    if (isColumn && activeId !== overId) {
      const oldIndex = columnOrder.findIndex(c => c.id === activeId);
      const newIndex = columnOrder.findIndex(c => c.id === overId);
      setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
      return;
    }

    const isTask = tasks.some(t => t.id === activeId);
    if (isTask && activeId !== overId && onReorderTasks) {
      const activeTask = tasks.find(t => t.id === activeId);
      const overTask = tasks.find(t => t.id === overId);
      
      if (activeTask && overTask && activeTask.status === overTask.status) {
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
        <div className="space-y-4 pb-8">
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
                    <div className="p-3 space-y-3">
                      {sectionTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={() => onEditTask(task)}
                          onToggleSubtask={(subtaskId) => onToggleSubtask?.(task.id, subtaskId)}
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
    <div ref={setNodeRef} style={style} className="rounded-xl overflow-hidden">
      {/* Section Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${STATUS_BG_COLORS[column.id]}`}>
        <button
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl">{STATUS_ICONS[column.id]}</span>
          <span className="font-semibold text-gray-200">{column.title}</span>
          <span className="text-sm text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">{taskCount}</span>
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
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Add Task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            {...attributes}
            {...listeners}
            className="p-2 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onArchive: () => void;
  formatDate: (date: string) => string;
  getAssignee: (id?: string) => typeof TEAM_MEMBERS[0] | null | undefined;
}

function TaskCard({ task, onEdit, onToggleSubtask, onArchive, formatDate, getAssignee }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const assignee = getAssignee(task.assignee);
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      onClick={onEdit}
      className="bg-gray-800 rounded-xl p-4 border border-gray-700/50 cursor-pointer hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
    >
      {/* Header with priority badge and title */}
      <div className="flex items-start gap-3 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
          task.priority === 'High' ? 'bg-red-600/20 text-red-400' :
          task.priority === 'Med' ? 'bg-yellow-600/20 text-yellow-400' :
          'bg-gray-600/20 text-gray-400'
        }`}>
          {task.priority}
        </span>
        <h3 className="flex-1 font-semibold text-gray-100 text-sm leading-snug group-hover:text-white transition-colors">
          {task.title}
        </h3>
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="space-y-2 mb-3">
          {task.subtasks.map((subtask) => (
            <div 
              key={subtask.id} 
              className="flex items-start gap-3"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSubtask(subtask.id);
              }}
            >
              <span className={subtask.completed ? 'text-green-400' : 'text-gray-600'}>
                {subtask.completed ? '✅' : '☐'}
              </span>
              <span className={`text-sm flex-1 ${subtask.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                {subtask.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
        <div className="flex items-center gap-3">
          {/* Assignee */}
          {assignee ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs">
                {assignee.avatar}
              </div>
              <span className="text-xs text-gray-400">{assignee.name}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-600">Unassigned</span>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
