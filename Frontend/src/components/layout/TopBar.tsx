import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Terminal, Plus, ChevronDown, GitBranch, Wifi } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { CURRENT_USER } from '../../data/mockData';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/editor': 'Code Editor',
  '/chat': 'Team Chat',
  '/prs': 'Pull Requests',
  '/issues': 'Issues',
  '/ai': 'AI Assistant',
  '/analytics': 'Analytics',
  '/deployments': 'Deployments',
};

const QUICK_ACTIONS = [
  { label: 'New Issue', shortcut: '⌘I' },
  { label: 'New PR', shortcut: '⌘P' },
  { label: 'New Branch', shortcut: '⌘B' },
];

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    openCommandPalette, toggleNotificationPanel, toggleTerminal,
    notifications, notificationPanelOpen,
  } = useAppStore();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  const title = PAGE_TITLES[location.pathname] ?? 'XOR Code';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setQuickActionsOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-12 flex items-center gap-3 px-4 border-b border-[#1A2E48] flex-shrink-0" style={{ background: '#0A1222' }}>
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[#E2EEFF]">{title}</span>
        <div className="flex items-center gap-1 text-[10px] text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
          <Wifi size={9} />
          <span>Live</span>
        </div>
      </div>

      {/* Branch indicator */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-[#4D6280] bg-[#111C2E] px-2 py-1 rounded border border-[#1A2E48]">
        <GitBranch size={11} />
        <span className="font-mono">feat/realtime-collab</span>
      </div>

      {/* Search */}
      <button
        onClick={openCommandPalette}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111C2E] border border-[#1A2E48] text-xs text-[#4D6280] hover:border-[#243B55] hover:text-[#8BA4C0] transition-all cursor-text ml-auto"
        style={{ minWidth: 180 }}
      >
        <Search size={12} />
        <span>Search or jump to…</span>
        <span className="ml-auto bg-[#1A2E48] px-1.5 py-0.5 rounded text-[10px] font-mono">⌘K</span>
      </button>

      <div className="flex items-center gap-1.5 ml-auto md:ml-0">
        {/* Quick actions */}
        <div className="relative" ref={actionsRef}>
          <button
            onClick={() => setQuickActionsOpen(v => !v)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-[#8BA4C0] hover:text-[#E2EEFF] hover:bg-[#111C2E] border border-[#1A2E48] hover:border-[#243B55] transition-all"
          >
            <Plus size={13} />
            <span className="hidden sm:inline font-medium">New</span>
            <ChevronDown size={11} className={`transition-transform ${quickActionsOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {quickActionsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-[#1A2E48] py-1 z-50 shadow-2xl"
                style={{ background: '#0D1321' }}
              >
                {QUICK_ACTIONS.map(({ label, shortcut }) => (
                  <button
                    key={label}
                    onClick={() => setQuickActionsOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#8BA4C0] hover:text-[#E2EEFF] hover:bg-[#111C2E] transition-colors"
                  >
                    <span>{label}</span>
                    <span className="text-[#4D6280] font-mono">{shortcut}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Terminal toggle */}
        <button
          onClick={toggleTerminal}
          title="Toggle Terminal"
          className="p-1.5 rounded-lg text-[#4D6280] hover:text-[#8BA4C0] hover:bg-[#111C2E] transition-colors"
        >
          <Terminal size={15} />
        </button>

        {/* Notifications */}
        <button
          onClick={toggleNotificationPanel}
          className={`relative p-1.5 rounded-lg transition-colors ${notificationPanelOpen ? 'bg-[#162338] text-[#3B82F6]' : 'text-[#4D6280] hover:text-[#8BA4C0] hover:bg-[#111C2E]'}`}
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#EF4444] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(v => !v)}
            className="flex items-center gap-1.5 hover:bg-[#111C2E] rounded-lg px-1 py-0.5 transition-colors"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: CURRENT_USER.color }}
            >
              {CURRENT_USER.initials}
            </div>
            <span className="hidden sm:block text-xs font-medium text-[#8BA4C0]">{CURRENT_USER.name.split(' ')[0]}</span>
            <ChevronDown size={10} className="text-[#4D6280] hidden sm:block" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-[#1A2E48] py-1 z-50 shadow-2xl"
                style={{ background: '#0D1321' }}
              >
                <div className="px-3 py-2.5 border-b border-[#1A2E48]">
                  <p className="text-sm font-semibold text-[#E2EEFF]">{CURRENT_USER.name}</p>
                  <p className="text-xs text-[#4D6280]">@{CURRENT_USER.username}</p>
                </div>
                {['Profile', 'Settings', 'Keyboard Shortcuts', 'Sign Out'].map(item => (
                  <button
                    key={item}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${item === 'Sign Out' ? 'text-[#EF4444] hover:bg-[#EF4444]/10' : 'text-[#8BA4C0] hover:text-[#E2EEFF] hover:bg-[#111C2E]'}`}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
