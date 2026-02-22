const tasks = [
  {
    title: 'Customer Onboarding Flow Redesign',
    description: 'Redesign the customer onboarding experience for MintBird to reduce drop-off',
    priority: 'High',
    status: 'inbox',
    project: 'mintbird',
    tags: ['UX', 'Design'],
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: 'Security Vulnerability Scan',
    description: 'Run comprehensive security audit on PopLinks infrastructure',
    priority: 'High',
    status: 'in-progress',
    project: 'poplinks',
    assignee: 'gaurav',
    tags: ['Security', 'Infrastructure'],
    progress: 48,
    statusLabel: 'DELAYED',
    daysSince: 64,
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 64 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: 'OpenClaw Dashboard Redesign',
    description: 'Create modern dashboard with real-time analytics',
    priority: 'Med',
    status: 'review',
    project: 'openclaw',
    assignee: 'pacino',
    tags: ['Frontend', 'Design'],
    progress: 100,
    statusLabel: 'ON TRACK',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: 'Q4 Financial Report',
    description: 'Comprehensive financial report for all products',
    priority: 'High',
    status: 'done',
    project: 'entourage',
    assignee: 'chad',
    tags: ['Finance', 'Reporting'],
    progress: 100,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Newsletter Automation System',
    description: 'Build automated newsletter generation and distribution',
    priority: 'Med',
    status: 'in-progress',
    project: 'letterman',
    assignee: 'pacino',
    tags: ['Automation', 'Content'],
    progress: 35,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: 'Course Platform Mobile App',
    description: 'Native mobile app for Course Sprout students',
    priority: 'High',
    status: 'assigned',
    project: 'coursesprout',
    assignee: 'pranay',
    tags: ['Mobile', 'Development'],
    progress: 0,
    statusLabel: 'CRITICAL',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: 'Market Research Report',
    description: 'Comprehensive market analysis for expansion',
    priority: 'High',
    status: 'inbox',
    project: 'entourage',
    tags: ['Research', 'Strategy'],
    statusLabel: 'CRITICAL',
    daysSince: 54,
    createdAt: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const fs = require('fs');
const path = require('path');

const tasksFile = path.join(__dirname, 'data', 'tasks.json');
const data = JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));

// Add IDs to new tasks
const tasksWithIds = tasks.map((task, i) => ({
  id: `sample-${Date.now()}-${i}`,
  ...task
}));

// Merge with existing
data.tasks = [...data.tasks, ...tasksWithIds];

// Save
fs.writeFileSync(tasksFile, JSON.stringify(data, null, 2));

console.log(`✅ Added ${tasksWithIds.length} sample tasks!`);
console.log(`Total tasks: ${data.tasks.length}`);
