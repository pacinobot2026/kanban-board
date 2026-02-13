export type Priority = 'Low' | 'Med' | 'High';

export type Status = 'backlog' | 'planned' | 'in-progress' | 'blocked' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: Status;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'planned', title: 'Planned' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'blocked', title: 'Blocked' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: 'bg-gray-200 text-gray-700',
  Med: 'bg-yellow-200 text-yellow-800',
  High: 'bg-red-200 text-red-800',
};
