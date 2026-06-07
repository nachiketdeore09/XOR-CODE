import type { User, FileNode, PullRequest, PRComment, Issue, Message, Channel, Commit, Deployment, Notification, ActivityEvent, ChartData, TeamMember } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Chen', username: 'alexchen', role: 'Senior Engineer', initials: 'AC', color: '#3B82F6', online: true, timezone: 'PST' },
  { id: 'u2', name: 'Sarah Kim', username: 'sarahkim', role: 'Product Engineer', initials: 'SK', color: '#7C3AED', online: true, timezone: 'EST' },
  { id: 'u3', name: 'Marcus Johnson', username: 'marcusj', role: 'Tech Lead', initials: 'MJ', color: '#10B981', online: false, timezone: 'GMT' },
  { id: 'u4', name: 'Priya Patel', username: 'priyap', role: 'Full Stack Dev', initials: 'PP', color: '#F59E0B', online: true, timezone: 'IST' },
  { id: 'u5', name: 'James Wu', username: 'jameswu', role: 'DevOps Engineer', initials: 'JW', color: '#EF4444', online: true, timezone: 'PST' },
  { id: 'u6', name: 'Elena Vasquez', username: 'elenav', role: 'Frontend Dev', initials: 'EV', color: '#06B6D4', online: false, timezone: 'CST' },
];

export const CURRENT_USER = USERS[0];

export const TEAM_MEMBERS: TeamMember[] = [
  { ...USERS[0], status: 'coding', activeFile: 'src/components/Auth.tsx', linesWritten: 234 },
  { ...USERS[1], status: 'reviewing', activeFile: 'src/api/users.ts', linesWritten: 87 },
  { ...USERS[2], status: 'offline', lastSeen: '2h ago', linesWritten: 0 },
  { ...USERS[3], status: 'coding', activeFile: 'src/hooks/useWebSocket.ts', linesWritten: 156 },
  { ...USERS[4], status: 'meeting', linesWritten: 12 },
  { ...USERS[5], status: 'idle', lastSeen: '45m ago', linesWritten: 43 },
];

export const FILE_TREE: FileNode[] = [
  {
    id: 'src', name: 'src', type: 'folder',
    children: [
      {
        id: 'components', name: 'components', type: 'folder',
        children: [
          { id: 'auth-file', name: 'Auth.tsx', type: 'file', language: 'typescript', modified: true, content: `import React, { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';\nimport { useAuth } from '../hooks/useAuth';\n\ninterface AuthProps {\n  mode: 'login' | 'register';\n}\n\nexport const Auth: React.FC<AuthProps> = ({ mode }) => {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const { login, register, loading, error } = useAuth();\n  const navigate = useNavigate();\n\n  const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();\n    try {\n      if (mode === 'login') {\n        await login(email, password);\n      } else {\n        await register(email, password);\n      }\n      navigate('/dashboard');\n    } catch (err) {\n      console.error('Auth error:', err);\n    }\n  };\n\n  return (\n    <div className="auth-container">\n      <form onSubmit={handleSubmit}>\n        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />\n        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />\n        <button type="submit" disabled={loading}>\n          {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}\n        </button>\n        {error && <p className="error">{error}</p>}\n      </form>\n    </div>\n  );\n};` },
          { id: 'button-file', name: 'Button.tsx', type: 'file', language: 'typescript', content: `import React from 'react';\n\ninterface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';\n  size?: 'sm' | 'md' | 'lg';\n  loading?: boolean;\n}\n\nexport const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', loading, children, ...props }) => {\n  return <button {...props}>{loading ? 'Loading...' : children}</button>;\n};` },
          { id: 'navbar-file', name: 'Navbar.tsx', type: 'file', language: 'typescript', content: '' },
          { id: 'modal-file', name: 'Modal.tsx', type: 'file', language: 'typescript', content: '' },
        ]
      },
      {
        id: 'hooks', name: 'hooks', type: 'folder',
        children: [
          { id: 'useauth-file', name: 'useAuth.ts', type: 'file', language: 'typescript', content: `import { useState, useCallback } from 'react';\n\nexport function useAuth() {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n\n  const login = useCallback(async (email: string, password: string) => {\n    setLoading(true);\n    // Mock login\n    await new Promise(r => setTimeout(r, 800));\n    setUser({ id: '1', email, name: 'Alex Chen' } as any);\n    setLoading(false);\n  }, []);\n\n  return { user, loading, error, login };\n}` },
          { id: 'usewebsocket-file', name: 'useWebSocket.ts', type: 'file', language: 'typescript', modified: true, content: `import { useEffect, useRef, useCallback } from 'react';\n\ntype Handler = (data: unknown) => void;\n\nexport function useWebSocket(url: string, onMessage: Handler) {\n  const wsRef = useRef<WebSocket | null>(null);\n\n  const connect = useCallback(() => {\n    const ws = new WebSocket(url);\n    ws.onmessage = (e) => onMessage(JSON.parse(e.data));\n    ws.onclose = () => setTimeout(connect, 3000);\n    wsRef.current = ws;\n  }, [url, onMessage]);\n\n  useEffect(() => {\n    connect();\n    return () => wsRef.current?.close();\n  }, [connect]);\n\n  return { send: (d: unknown) => wsRef.current?.send(JSON.stringify(d)) };\n}` },
          { id: 'usedebounce-file', name: 'useDebounce.ts', type: 'file', language: 'typescript', content: '' },
        ]
      },
      {
        id: 'pages-dir', name: 'pages', type: 'folder',
        children: [
          { id: 'dash-page', name: 'Dashboard.tsx', type: 'file', language: 'typescript', content: '' },
          { id: 'profile-page', name: 'Profile.tsx', type: 'file', language: 'typescript', content: '' },
          { id: 'settings-page', name: 'Settings.tsx', type: 'file', language: 'typescript', content: '' },
        ]
      },
      {
        id: 'api-dir', name: 'api', type: 'folder',
        children: [
          { id: 'api-index', name: 'index.ts', type: 'file', language: 'typescript', content: `const BASE = import.meta.env.VITE_API_URL || 'https://api.xorcode.dev';\n\nasync function req<T>(path: string, opts?: RequestInit): Promise<T> {\n  const token = localStorage.getItem('token');\n  const res = await fetch(BASE + path, {\n    ...opts,\n    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...opts?.headers },\n  });\n  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || res.statusText);\n  return res.json();\n}\n\nexport const api = {\n  auth: {\n    login: (email: string, pw: string) => req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pw }) }),\n  },\n  users: { getAll: () => req('/users') },\n};` },
        ]
      },
      { id: 'app-file', name: 'App.tsx', type: 'file', language: 'typescript', content: '' },
      { id: 'main-file', name: 'main.tsx', type: 'file', language: 'typescript', content: '' },
      { id: 'types-file', name: 'types.ts', type: 'file', language: 'typescript', content: '' },
    ]
  },
  { id: 'public-dir', name: 'public', type: 'folder', children: [{ id: 'favicon', name: 'favicon.svg', type: 'file', language: 'svg', content: '' }] },
  { id: 'pkg', name: 'package.json', type: 'file', language: 'json', content: '' },
  { id: 'tsconfig', name: 'tsconfig.json', type: 'file', language: 'json', content: '' },
  { id: 'vite-cfg', name: 'vite.config.ts', type: 'file', language: 'typescript', content: '' },
  { id: 'readme', name: 'README.md', type: 'file', language: 'markdown', content: '' },
];

export const PULL_REQUESTS: PullRequest[] = [
  {
    id: 'pr1', number: 142,
    title: 'feat: Add real-time collaboration with WebSocket cursors',
    body: 'Implements live cursor tracking and presence indicators for collaborative editing. Uses WebSocket for real-time sync and includes conflict resolution logic.',
    status: 'open', author: USERS[0], reviewers: [USERS[1], USERS[2]],
    branch: 'feat/realtime-collab', targetBranch: 'main',
    createdAt: '2h ago', updatedAt: '20m ago',
    comments: 8, changes: { additions: 342, deletions: 87, files: 12 }, labels: ['feature', 'backend'], ciStatus: 'passing',
  },
  {
    id: 'pr2', number: 141,
    title: 'fix: Resolve memory leak in useEffect cleanup',
    body: 'Fixes a critical memory leak where event listeners were not properly removed on component unmount.',
    status: 'open', author: USERS[1], reviewers: [USERS[0]],
    branch: 'fix/useeffect-cleanup', targetBranch: 'main',
    createdAt: '5h ago', updatedAt: '1h ago',
    comments: 3, changes: { additions: 24, deletions: 18, files: 4 }, labels: ['bug', 'performance'], ciStatus: 'passing',
  },
  {
    id: 'pr3', number: 140,
    title: 'refactor: Migrate state management to Zustand',
    body: 'Replaces Redux with Zustand for simpler, more performant state management. Reduces boilerplate by 60%.',
    status: 'open', author: USERS[3], reviewers: [USERS[0], USERS[1], USERS[2]],
    branch: 'refactor/zustand-migration', targetBranch: 'main',
    createdAt: '1d ago', updatedAt: '3h ago',
    comments: 15, changes: { additions: 890, deletions: 1240, files: 34 }, labels: ['refactor'], ciStatus: 'failing',
  },
  {
    id: 'pr4', number: 139,
    title: 'feat: Implement JWT refresh token rotation',
    body: 'Adds secure token refresh mechanism with rotation policy to prevent token reuse attacks.',
    status: 'merged', author: USERS[4], reviewers: [USERS[2]],
    branch: 'feat/jwt-refresh', targetBranch: 'main',
    createdAt: '2d ago', updatedAt: '1d ago',
    comments: 6, changes: { additions: 156, deletions: 43, files: 8 }, labels: ['security', 'feature'], ciStatus: 'passing',
  },
  {
    id: 'pr5', number: 138,
    title: 'chore: Update dependencies to latest versions',
    body: 'Updates all dependencies to their latest stable versions. Includes React 19 upgrade.',
    status: 'draft', author: USERS[0], reviewers: [],
    branch: 'chore/update-deps', targetBranch: 'main',
    createdAt: '3d ago', updatedAt: '3d ago',
    comments: 0, changes: { additions: 45, deletions: 45, files: 2 }, labels: ['chore'], ciStatus: 'pending',
  },
];

export const PR_COMMENTS: PRComment[] = [
  { id: 'c1', author: USERS[1], body: 'This looks great! Love the approach with the cursor sync. One thing — should we debounce the position updates to avoid flooding the WebSocket?', timestamp: '1h ago', type: 'review' },
  { id: 'c2', author: USERS[2], body: 'LGTM overall. The conflict resolution logic is solid. Left a few inline comments on the merge strategy.', timestamp: '45m ago', type: 'review' },
  { id: 'c3', author: USERS[0], body: '@sarahkim Good catch! Added debouncing with 50ms delay. Also fixed the edge case where cursor jumps on reconnect.', timestamp: '30m ago', type: 'review' },
  { id: 'c4', author: USERS[1], body: 'Could we extract this into a custom hook? `useCursorSync` would be much cleaner and testable.', timestamp: '20m ago', file: 'src/components/Editor.tsx', line: 87, type: 'inline' },
  { id: 'c5', author: USERS[2], body: 'Approved! Ship it 🚀', timestamp: '5m ago', type: 'review' },
];

export const ISSUES: Issue[] = [
  { id: 'i1', number: 87, title: 'Implement command palette (Ctrl+K)', description: 'Add a VS Code-style command palette for quick navigation and actions.', status: 'in_progress', priority: 'high', assignee: USERS[0], labels: ['feature', 'UX'], createdAt: '3d ago', estimate: 5 },
  { id: 'i2', number: 86, title: 'Fix keyboard navigation in dropdowns', description: 'Arrow keys and Enter key should work properly for selecting items in dropdown menus.', status: 'todo', priority: 'medium', assignee: USERS[5], labels: ['bug', 'accessibility'], createdAt: '4d ago', estimate: 2 },
  { id: 'i3', number: 85, title: 'Add drag-and-drop file upload', description: 'Allow users to drag files from their filesystem directly into the editor.', status: 'todo', priority: 'low', labels: ['feature'], createdAt: '5d ago', estimate: 3 },
  { id: 'i4', number: 84, title: 'Performance: Virtual scrolling for large lists', description: 'Implement virtual scrolling for issue lists and PR lists with 1000+ items.', status: 'in_review', priority: 'high', assignee: USERS[3], labels: ['performance'], createdAt: '6d ago', estimate: 8 },
  { id: 'i5', number: 83, title: 'Mobile responsive layout', description: 'Ensure the dashboard and editor work properly on mobile devices.', status: 'todo', priority: 'medium', labels: ['mobile', 'design'], createdAt: '7d ago', estimate: 5 },
  { id: 'i6', number: 82, title: 'Dark/light theme switcher', description: 'Allow users to toggle between dark and light themes with localStorage persistence.', status: 'done', priority: 'low', assignee: USERS[1], labels: ['feature', 'design'], createdAt: '10d ago' },
  { id: 'i7', number: 81, title: 'Add unit tests for auth service', description: 'Write comprehensive unit tests for all authentication flows including edge cases.', status: 'in_progress', priority: 'high', assignee: USERS[4], labels: ['testing'], createdAt: '8d ago', estimate: 6 },
  { id: 'i8', number: 80, title: 'Rate limiting on API endpoints', description: 'Implement rate limiting: 100 req/min per user, 1000 req/min per IP.', status: 'done', priority: 'critical', assignee: USERS[4], labels: ['security', 'backend'], createdAt: '12d ago' },
  { id: 'i9', number: 79, title: 'Collaborative cursor display in editor', description: 'Show other users cursors in different colors when editing the same file.', status: 'in_review', priority: 'medium', assignee: USERS[0], labels: ['feature', 'collaboration'], createdAt: '5d ago', estimate: 4 },
  { id: 'i10', number: 78, title: 'Export issues to CSV', description: 'Add export functionality to download filtered issue lists as CSV.', status: 'todo', priority: 'low', labels: ['feature'], createdAt: '9d ago', estimate: 1 },
];

const makeMessages = (prefix: string): Message[] => [
  { id: `${prefix}-m1`, content: "Hey team! Just pushed the new authentication system. Please review PR #142 when you get a chance 🚀", author: USERS[0], timestamp: '10:32 AM', reactions: [{ emoji: '🚀', users: ['u2', 'u4'], count: 2 }, { emoji: '👍', users: ['u3', 'u5'], count: 2 }] },
  { id: `${prefix}-m2`, content: "Looks amazing Alex! I'll take a look this afternoon. Does it handle the edge case where the token expires mid-session?", author: USERS[1], timestamp: '10:35 AM', reactions: [] },
  { id: `${prefix}-m3`, content: "Yes! Added refresh token rotation. Check the `useAuth` hook — it handles silent refresh automatically before expiry.", author: USERS[0], timestamp: '10:37 AM', reactions: [{ emoji: '✅', users: ['u2'], count: 1 }] },
  { id: `${prefix}-m4`, content: "@alexchen What's the token lifetime? 15 minutes like we discussed in standup?", author: USERS[3], timestamp: '10:41 AM', reactions: [] },
  { id: `${prefix}-m5`, content: "@priyap Exactly — 15min access tokens, 7-day refresh tokens with rotation. PKCE flow for OAuth providers.", author: USERS[0], timestamp: '10:43 AM', reactions: [{ emoji: '🔐', users: ['u4', 'u5'], count: 2 }] },
  { id: `${prefix}-m6`, content: "Quick update: the CI pipeline is now 40% faster after caching improvements. From 12min → 7min 🎉", author: USERS[4], timestamp: '11:02 AM', reactions: [{ emoji: '🎉', users: ['u1', 'u2', 'u3', 'u4'], count: 4 }, { emoji: '🔥', users: ['u1', 'u2'], count: 2 }] },
  { id: `${prefix}-m7`, content: "That's huge! Thanks James 🙌", author: USERS[2], timestamp: '11:04 AM', reactions: [] },
  { id: `${prefix}-m8`, content: "Reminder: team sync at 3pm PST today. We'll review the Q4 roadmap and sprint planning.", author: USERS[2], timestamp: '11:15 AM', reactions: [{ emoji: '📅', users: ['u1', 'u2', 'u4', 'u5'], count: 4 }] },
];

export const CHANNELS: Channel[] = [
  { id: 'ch1', name: 'general', description: 'Team-wide announcements', isPrivate: false, members: USERS, messages: makeMessages('general'), unreadCount: 3, lastActivity: '11:15 AM' },
  { id: 'ch2', name: 'engineering', description: 'Engineering discussions', isPrivate: false, members: USERS.slice(0, 5), messages: [
    { id: 'eng-m1', content: "Anyone have time to pair on the WebSocket implementation? Running into issues with reconnection logic.", author: USERS[3], timestamp: '9:30 AM', reactions: [] },
    { id: 'eng-m2', content: "I'm free after 2pm. Reconnection needs exponential backoff — did something similar last sprint.", author: USERS[0], timestamp: '9:45 AM', reactions: [{ emoji: '🙏', users: ['u4'], count: 1 }] },
    { id: 'eng-m3', content: "Also check out the `useWebSocket` hook I wrote — it has retry logic built in.", author: USERS[0], timestamp: '9:46 AM', reactions: [] },
  ], unreadCount: 0, lastActivity: '9:46 AM' },
  { id: 'ch3', name: 'design', description: 'Design system & UI reviews', isPrivate: false, members: [USERS[1], USERS[5]], messages: [
    { id: 'des-m1', content: "New design tokens are up in Figma. Color system completely revamped for better contrast ratios (WCAG AA).", author: USERS[5], timestamp: 'Yesterday', reactions: [{ emoji: '🎨', users: ['u2', 'u1'], count: 2 }] },
  ], unreadCount: 1, lastActivity: 'Yesterday' },
  { id: 'ch4', name: 'deployments', description: 'CI/CD alerts', isPrivate: false, members: USERS, messages: [
    { id: 'dep-m1', content: "✅ Production deploy v2.4.1 successful. Zero downtime. All health checks passing.", author: USERS[4], timestamp: '8:00 AM', reactions: [{ emoji: '🎉', users: ['u1', 'u2', 'u3'], count: 3 }] },
  ], unreadCount: 0, lastActivity: '8:00 AM' },
  { id: 'ch5', name: 'random', description: 'Off-topic fun', isPrivate: false, members: USERS, messages: [
    { id: 'ran-m1', content: "Fun fact: we've written 847,293 lines of code this year 😅", author: USERS[1], timestamp: 'Yesterday', reactions: [{ emoji: '😱', users: ['u1', 'u3', 'u4', 'u5'], count: 4 }] },
  ], unreadCount: 2, lastActivity: 'Yesterday' },
];

export const COMMITS: Commit[] = [
  { id: 'c1', sha: 'a3f9b2c', message: 'feat(auth): Implement JWT refresh token rotation', author: USERS[0], timestamp: '20m ago', branch: 'feat/jwt-refresh', stats: { additions: 156, deletions: 43 } },
  { id: 'c2', sha: 'b7e1d4a', message: 'fix(editor): Resolve cursor sync on reconnect', author: USERS[0], timestamp: '1h ago', branch: 'feat/realtime-collab', stats: { additions: 32, deletions: 18 } },
  { id: 'c3', sha: 'c2a8f5b', message: 'perf(ci): Add dependency caching to reduce build time', author: USERS[4], timestamp: '2h ago', branch: 'main', stats: { additions: 45, deletions: 12 } },
  { id: 'c4', sha: 'd9c3e6f', message: 'refactor(store): Extract user slice from app store', author: USERS[3], timestamp: '3h ago', branch: 'refactor/zustand-migration', stats: { additions: 234, deletions: 345 } },
  { id: 'c5', sha: 'e4b2a1c', message: 'test(api): Add integration tests for auth endpoints', author: USERS[4], timestamp: '4h ago', branch: 'feat/auth-tests', stats: { additions: 287, deletions: 0 } },
  { id: 'c6', sha: 'f1d7b8e', message: 'style(ui): Update button variants for dark theme', author: USERS[1], timestamp: '5h ago', branch: 'feat/dark-theme', stats: { additions: 67, deletions: 54 } },
  { id: 'c7', sha: 'a9e3c2b', message: 'docs: Update API authentication guide', author: USERS[2], timestamp: '6h ago', branch: 'docs/auth-guide', stats: { additions: 124, deletions: 23 } },
];

export const DEPLOYMENTS: Deployment[] = [
  { id: 'd1', version: 'v2.4.2', environment: 'production', status: 'running', author: USERS[4], timestamp: 'Just now', branch: 'main', duration: '—', commit: 'a3f9b2c', url: 'https://app.xorcode.dev' },
  { id: 'd2', version: 'v2.4.1', environment: 'production', status: 'success', author: USERS[4], timestamp: '6h ago', branch: 'main', duration: '2m 34s', commit: 'b7e1d4a', url: 'https://app.xorcode.dev' },
  { id: 'd3', version: 'v2.4.1-rc1', environment: 'staging', status: 'success', author: USERS[0], timestamp: '8h ago', branch: 'feat/realtime-collab', duration: '2m 12s', commit: 'c2a8f5b', url: 'https://staging.xorcode.dev' },
  { id: 'd4', version: 'v2.4.0', environment: 'production', status: 'success', author: USERS[4], timestamp: '1d ago', branch: 'main', duration: '3m 01s', commit: 'd9c3e6f', url: 'https://app.xorcode.dev' },
  { id: 'd5', version: 'v2.3.9-test', environment: 'development', status: 'failed', author: USERS[3], timestamp: '1d ago', branch: 'refactor/zustand-migration', duration: '1m 45s', commit: 'e4b2a1c' },
  { id: 'd6', version: 'v2.3.9', environment: 'production', status: 'success', author: USERS[4], timestamp: '2d ago', branch: 'main', duration: '2m 58s', commit: 'f1d7b8e', url: 'https://app.xorcode.dev' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'pr_approved', title: 'PR #142 approved', body: 'Marcus Johnson approved your pull request "feat: Add real-time collaboration"', timestamp: '5m ago', read: false, user: USERS[2] },
  { id: 'n2', type: 'mention', title: 'Mentioned in #engineering', body: 'Priya Patel mentioned you: "@alexchen I\'m free after 2pm..."', timestamp: '15m ago', read: false, user: USERS[3] },
  { id: 'n3', type: 'ci_passed', title: 'CI passed on PR #141', body: 'All 47 checks passed on "fix: Resolve memory leak in useEffect cleanup"', timestamp: '30m ago', read: false },
  { id: 'n4', type: 'pr_comment', title: 'New comment on PR #142', body: 'Sarah Kim: "Could we extract this into a custom hook? useCursorSync..."', timestamp: '1h ago', read: true, user: USERS[1] },
  { id: 'n5', type: 'issue_assigned', title: 'Issue #87 assigned to you', body: 'Marcus Johnson assigned "Implement command palette (Ctrl+K)" to you', timestamp: '2h ago', read: true, user: USERS[2] },
  { id: 'n6', type: 'deploy_success', title: 'Deployment successful', body: 'v2.4.1 deployed to production in 2m 34s', timestamp: '6h ago', read: true },
  { id: 'n7', type: 'ci_failed', title: 'CI failed on PR #140', body: '3 of 47 checks failed on "refactor: Migrate state management to Zustand"', timestamp: '3h ago', read: true },
];

export const ACTIVITY_FEED: ActivityEvent[] = [
  { id: 'a1', type: 'commit', user: USERS[0], description: 'pushed 2 commits to feat/realtime-collab', timestamp: '5m ago', meta: { branch: 'feat/realtime-collab' } },
  { id: 'a2', type: 'review', user: USERS[2], description: 'approved PR #142 "Add real-time collaboration"', timestamp: '8m ago' },
  { id: 'a3', type: 'comment', user: USERS[1], description: 'commented on PR #142', timestamp: '20m ago' },
  { id: 'a4', type: 'issue_closed', user: USERS[4], description: 'closed issue #80 "Rate limiting on API endpoints"', timestamp: '35m ago' },
  { id: 'a5', type: 'deploy', user: USERS[4], description: 'deployed v2.4.1 to production', timestamp: '6h ago', meta: { version: 'v2.4.1', env: 'production' } },
  { id: 'a6', type: 'pr_opened', user: USERS[3], description: 'opened PR #140 "Refactor: Migrate to Zustand"', timestamp: '1d ago' },
  { id: 'a7', type: 'issue_created', user: USERS[1], description: 'created issue #86 "Fix keyboard navigation in dropdowns"', timestamp: '1d ago' },
  { id: 'a8', type: 'pr_merged', user: USERS[2], description: 'merged PR #139 "feat: Implement JWT refresh tokens"', timestamp: '2d ago' },
];

export const CHART_DATA: ChartData[] = [
  { label: 'Mon', commits: 12, prs: 3, issues: 5 },
  { label: 'Tue', commits: 19, prs: 5, issues: 8 },
  { label: 'Wed', commits: 8, prs: 2, issues: 3 },
  { label: 'Thu', commits: 24, prs: 7, issues: 11 },
  { label: 'Fri', commits: 31, prs: 4, issues: 6 },
  { label: 'Sat', commits: 6, prs: 1, issues: 2 },
  { label: 'Sun', commits: 4, prs: 0, issues: 1 },
];

export const COMMAND_PALETTE_ITEMS = [
  { id: 'nav-dashboard', type: 'nav' as const, label: 'Go to Dashboard', icon: 'LayoutDashboard', path: '/' },
  { id: 'nav-editor', type: 'nav' as const, label: 'Open Editor', icon: 'Code2', path: '/editor' },
  { id: 'nav-chat', type: 'nav' as const, label: 'Open Team Chat', icon: 'MessageSquare', path: '/chat' },
  { id: 'nav-prs', type: 'nav' as const, label: 'View Pull Requests', icon: 'GitPullRequest', path: '/prs' },
  { id: 'nav-issues', type: 'nav' as const, label: 'View Issues', icon: 'CircleDot', path: '/issues' },
  { id: 'nav-ai', type: 'nav' as const, label: 'Open AI Assistant', icon: 'Sparkles', path: '/ai' },
  { id: 'nav-analytics', type: 'nav' as const, label: 'View Analytics', icon: 'BarChart3', path: '/analytics' },
  { id: 'nav-deployments', type: 'nav' as const, label: 'View Deployments', icon: 'Rocket', path: '/deployments' },
  { id: 'action-new-issue', type: 'action' as const, label: 'Create New Issue', icon: 'Plus', path: '/issues' },
  { id: 'action-new-pr', type: 'action' as const, label: 'New Pull Request', icon: 'GitPullRequestArrow', path: '/prs' },
];
