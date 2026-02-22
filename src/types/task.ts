export type Priority = 'Low' | 'Med' | 'High';

export type Status = 'inbox' | 'assigned' | 'in-progress' | 'review' | 'done';

export type StatusLabel = 'DELAYED' | 'CRITICAL' | 'ON TRACK' | null;

export type TaskType = 'team' | 'openclaw';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  status: Status;
  project: string;
  type: TaskType;
  assignee?: string;
  progress?: number; // 0-100
  dueDate?: string;
  statusLabel?: StatusLabel;
  daysSince?: number; // for delayed tasks
  subtasks?: Subtask[]; // NEW: checkable bullets
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: Status;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'inbox', title: 'Inbox' },
  { id: 'assigned', title: 'Assigned' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: 'bg-gray-700 text-gray-300',
  Med: 'bg-yellow-600 text-yellow-100',
  High: 'bg-red-600 text-red-100',
};

export const STATUS_LABEL_COLORS: Record<NonNullable<StatusLabel>, string> = {
  'DELAYED': 'bg-purple-600 text-purple-100',
  'CRITICAL': 'bg-red-600 text-red-100',
  'ON TRACK': 'bg-green-600 text-green-100',
};

// Chad's projects
export const PROJECTS = [
  { id: 'mintbird', name: 'MintBird', icon: '🦅' },
  { id: 'poplinks', name: 'PopLinks', icon: '🔗' },
  { id: 'coursesprout', name: 'Course Sprout', icon: '🌱' },
  { id: 'letterman', name: 'Letterman', icon: '📰' },
  { id: 'globalcontrol', name: 'Global Control', icon: '🎯' },
  { id: 'openclaw', name: 'OpenClaw', icon: '🤖' },
  { id: 'entourage', name: 'Entourage Mastermind', icon: '👥' },
  { id: 'lnh', name: 'Local Newsletter Hustle', icon: '📍' },
];

// Team members
export const TEAM_MEMBERS = [
  { id: 'chad', name: 'Chad', avatar: '👨‍💼' },
  { id: 'pacino', name: 'Pacino', avatar: '🎬' },
  { id: 'gaurav', name: 'Gaurav', avatar: '👨‍💻' },
  { id: 'pranay', name: 'Pranay', avatar: '👨‍💻' },
];
