import { create } from 'zustand';
import type { Notification, Issue, Channel, Message, FileNode } from '../types';
import { NOTIFICATIONS, ISSUES, CHANNELS, FILE_TREE, CURRENT_USER } from '../data/mockData';

interface AppState {
  // UI state
  commandPaletteOpen: boolean;
  notificationPanelOpen: boolean;
  sidebarCollapsed: boolean;
  activeView: string;

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Editor
  openFiles: FileNode[];
  activeFileId: string | null;
  fileTree: FileNode[];

  // Issues
  issues: Issue[];

  // Chat
  channels: Channel[];
  activeChannelId: string;
  typingUsers: string[];

  // AI
  aiMessages: { id: string; role: 'user' | 'assistant'; content: string; timestamp: string }[];
  aiThinking: boolean;

  // Terminal
  terminalOpen: boolean;
  terminalOutput: string[];

  // Actions
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleNotificationPanel: () => void;
  toggleSidebar: () => void;
  setActiveView: (view: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;

  openFile: (file: FileNode) => void;
  closeFile: (id: string) => void;
  setActiveFile: (id: string) => void;

  moveIssue: (issueId: string, newStatus: Issue['status']) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;

  setActiveChannel: (id: string) => void;
  sendMessage: (channelId: string, content: string) => void;
  addReaction: (channelId: string, messageId: string, emoji: string) => void;
  setTypingUsers: (users: string[]) => void;

  sendAIMessage: (content: string) => void;
  clearAIChat: () => void;

  toggleTerminal: () => void;
  addTerminalLine: (line: string) => void;
}

const AI_RESPONSES: Record<string, string> = {
  default: `I can help you with that! Here's what I found:\n\n\`\`\`typescript\n// Example implementation\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\`\`\`\n\nThis implementation uses \`setTimeout\` to delay updates and cleans up with the effect's return function. The generic \`<T>\` makes it work with any value type.`,
  bug: `I found the issue! 🔍\n\nThe memory leak occurs because the event listener is registered but never cleaned up:\n\n\`\`\`typescript\n// ❌ Before — leaks memory\nuseEffect(() => {\n  window.addEventListener('resize', handleResize);\n}, []); // Missing cleanup!\n\n// ✅ After — properly cleaned up\nuseEffect(() => {\n  window.addEventListener('resize', handleResize);\n  return () => window.removeEventListener('resize', handleResize); // 🎯\n}, [handleResize]);\n\`\`\`\n\n**Root cause:** Missing cleanup function in useEffect. The event listener accumulates on every render cycle.\n\n**Fix:** Return a cleanup function that removes the listener. Also, add \`handleResize\` to the dependency array to avoid stale closures.`,
  review: `## PR Review Summary\n\n**Overall: Looks solid! A few suggestions:**\n\n### Strengths ✅\n- Clean separation of concerns\n- Good TypeScript typing\n- Follows existing patterns\n\n### Suggestions 💡\n\n1. **Debounce the cursor updates** (line 87)\n   \`\`\`typescript\n   const debouncedUpdate = useDebounce(cursorPosition, 50);\n   \`\`\`\n\n2. **Extract cursor logic into a hook**\n   \`\`\`typescript\n   const { cursors } = useCursorSync(roomId);\n   \`\`\`\n\n3. **Handle offline state gracefully** — currently throws if WebSocket disconnects mid-edit\n\n### No blocking issues. Ready to merge after addressing the debounce! 🚀`,
  explain: `Let me break this down:\n\n**What this code does:**\nThe \`useWebSocket\` hook creates a persistent WebSocket connection with automatic reconnection.\n\n**Key concepts:**\n\n1. **\`useRef\`** stores the WebSocket instance across renders without triggering re-renders\n2. **\`useCallback\`** memoizes the \`connect\` function to prevent infinite reconnect loops\n3. **\`useEffect\`** manages the connection lifecycle — connects on mount, disconnects on unmount\n4. **Exponential backoff** — the 3000ms delay before reconnecting prevents hammering the server\n\n**Data flow:**\n\`\`\`\nMount → connect() → WebSocket created\n       ↓\n  Message received → onMessage(parsed data)\n       ↓\n  Connection lost → setTimeout(connect, 3000)\n\`\`\`\n\nWant me to add error handling or implement exponential backoff?`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('bug') || lower.includes('fix') || lower.includes('error') || lower.includes('memory')) return AI_RESPONSES.bug;
  if (lower.includes('review') || lower.includes('pr') || lower.includes('pull request')) return AI_RESPONSES.review;
  if (lower.includes('explain') || lower.includes('what') || lower.includes('how') || lower.includes('understand')) return AI_RESPONSES.explain;
  return AI_RESPONSES.default;
}

let notifCounter = 100;
let msgCounter = 1000;
let aiMsgCounter = 1;

export const useAppStore = create<AppState>((set, get) => ({
  commandPaletteOpen: false,
  notificationPanelOpen: false,
  sidebarCollapsed: false,
  activeView: 'dashboard',

  notifications: NOTIFICATIONS,
  get unreadCount() { return get().notifications.filter(n => !n.read).length; },

  openFiles: [],
  activeFileId: null,
  fileTree: FILE_TREE,

  issues: ISSUES,

  channels: CHANNELS,
  activeChannelId: 'ch1',
  typingUsers: [],

  aiMessages: [
    { id: 'ai-welcome', role: 'assistant', content: "Hi! I'm XOR AI, your intelligent coding assistant. I can help you:\n\n- 🐛 **Debug** code and find bugs\n- 📝 **Review** pull requests\n- 💡 **Explain** complex code\n- ✨ **Generate** boilerplate code\n- 🔍 **Search** your codebase\n\nWhat would you like help with today?", timestamp: 'now' }
  ],
  aiThinking: false,

  terminalOpen: false,
  terminalOutput: [
    '$ npm run dev',
    '',
    '  VITE v8.0.12  ready in 234 ms',
    '',
    '  ➜  Local:   http://localhost:5173/',
    '  ➜  Network: http://192.168.1.100:5173/',
    '  ➜  press h + enter to show help',
    '',
  ],

  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleNotificationPanel: () => set(s => ({ notificationPanelOpen: !s.notificationPanelOpen })),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setActiveView: (view) => set({ activeView: view }),

  markNotificationRead: (id) => set(s => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllNotificationsRead: () => set(s => ({
    notifications: s.notifications.map(n => ({ ...n, read: true }))
  })),
  addNotification: (n) => {
    const notification: Notification = {
      ...n, id: `notif-${++notifCounter}`,
      timestamp: 'Just now', read: false,
    };
    set(s => ({ notifications: [notification, ...s.notifications] }));
  },

  openFile: (file) => set(s => {
    if (s.openFiles.find(f => f.id === file.id)) return { activeFileId: file.id };
    return { openFiles: [...s.openFiles, file], activeFileId: file.id };
  }),
  closeFile: (id) => set(s => {
    const files = s.openFiles.filter(f => f.id !== id);
    const activeId = s.activeFileId === id ? (files[files.length - 1]?.id ?? null) : s.activeFileId;
    return { openFiles: files, activeFileId: activeId };
  }),
  setActiveFile: (id) => set({ activeFileId: id }),

  moveIssue: (issueId, newStatus) => set(s => ({
    issues: s.issues.map(i => i.id === issueId ? { ...i, status: newStatus } : i)
  })),
  updateIssue: (id, updates) => set(s => ({
    issues: s.issues.map(i => i.id === id ? { ...i, ...updates } : i)
  })),

  setActiveChannel: (id) => set({ activeChannelId: id }),
  sendMessage: (channelId, content) => {
    const message: Message = {
      id: `msg-${++msgCounter}`,
      content,
      author: CURRENT_USER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };
    set(s => ({
      channels: s.channels.map(ch =>
        ch.id === channelId
          ? { ...ch, messages: [...ch.messages, message], lastActivity: message.timestamp }
          : ch
      )
    }));
  },
  addReaction: (channelId, messageId, emoji) => set(s => ({
    channels: s.channels.map(ch => {
      if (ch.id !== channelId) return ch;
      return {
        ...ch,
        messages: ch.messages.map(m => {
          if (m.id !== messageId) return m;
          const existing = m.reactions.find(r => r.emoji === emoji);
          if (existing) {
            const hasUser = existing.users.includes(CURRENT_USER.id);
            return {
              ...m,
              reactions: m.reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, count: hasUser ? r.count - 1 : r.count + 1, users: hasUser ? r.users.filter(u => u !== CURRENT_USER.id) : [...r.users, CURRENT_USER.id] }
                  : r
              ).filter(r => r.count > 0)
            };
          }
          return { ...m, reactions: [...m.reactions, { emoji, users: [CURRENT_USER.id], count: 1 }] };
        })
      };
    })
  })),
  setTypingUsers: (users) => set({ typingUsers: users }),

  sendAIMessage: async (content) => {
    const userMsg = { id: `ai-user-${++aiMsgCounter}`, role: 'user' as const, content, timestamp: 'now' };
    set(s => ({ aiMessages: [...s.aiMessages, userMsg], aiThinking: true }));

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const response = getAIResponse(content);
    const assistantMsg = { id: `ai-asst-${++aiMsgCounter}`, role: 'assistant' as const, content: response, timestamp: 'now' };
    set(s => ({ aiMessages: [...s.aiMessages, assistantMsg], aiThinking: false }));
  },
  clearAIChat: () => set({ aiMessages: [] }),

  toggleTerminal: () => set(s => ({ terminalOpen: !s.terminalOpen })),
  addTerminalLine: (line) => set(s => ({ terminalOutput: [...s.terminalOutput, line] })),
}));
