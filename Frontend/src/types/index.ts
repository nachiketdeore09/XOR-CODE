export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  initials: string;
  color: string;
  online: boolean;
  timezone: string;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  children?: FileNode[];
  content?: string;
  modified?: boolean;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  body: string;
  status: 'open' | 'closed' | 'merged' | 'draft';
  author: User;
  reviewers: User[];
  branch: string;
  targetBranch: string;
  createdAt: string;
  updatedAt: string;
  comments: number;
  changes: { additions: number; deletions: number; files: number };
  labels: string[];
  ciStatus: 'passing' | 'failing' | 'pending' | 'none';
}

export interface PRComment {
  id: string;
  author: User;
  body: string;
  timestamp: string;
  line?: number;
  file?: string;
  type: 'review' | 'inline';
}

export interface Issue {
  id: string;
  number: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: User;
  labels: string[];
  createdAt: string;
  dueDate?: string;
  estimate?: number;
}

export interface Message {
  id: string;
  content: string;
  author: User;
  timestamp: string;
  reactions: { emoji: string; users: string[]; count: number }[];
  edited?: boolean;
  attachments?: { name: string; type: string; size: string }[];
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  members: User[];
  messages: Message[];
  unreadCount: number;
  lastActivity: string;
}

export interface Commit {
  id: string;
  sha: string;
  message: string;
  author: User;
  timestamp: string;
  branch: string;
  stats: { additions: number; deletions: number };
}

export interface Deployment {
  id: string;
  version: string;
  environment: 'production' | 'staging' | 'development';
  status: 'running' | 'success' | 'failed' | 'pending' | 'cancelled';
  author: User;
  timestamp: string;
  branch: string;
  duration: string;
  commit: string;
  url?: string;
}

export interface Notification {
  id: string;
  type: 'pr_approved' | 'pr_comment' | 'mention' | 'ci_passed' | 'ci_failed' | 'issue_assigned' | 'deploy_success' | 'deploy_failed';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  user?: User;
  link?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'commit' | 'pr_opened' | 'pr_merged' | 'issue_created' | 'issue_closed' | 'comment' | 'deploy' | 'review';
  user: User;
  description: string;
  timestamp: string;
  meta?: Record<string, string>;
}

export interface ChartData {
  label: string;
  commits: number;
  prs: number;
  issues: number;
}

export interface TeamMember extends User {
  activeFile?: string;
  status: 'coding' | 'reviewing' | 'meeting' | 'idle' | 'offline';
  lastSeen?: string;
  linesWritten?: number;
}
