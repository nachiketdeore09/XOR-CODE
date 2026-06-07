import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Code2, MessageSquare, GitPullRequest,
  CircleDot, Sparkles, BarChart3, Rocket, ChevronLeft,
  Settings, HelpCircle, Zap,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { TEAM_MEMBERS } from '../../data/mockData';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { path: '/editor', icon: Code2, label: 'Editor', badge: null },
  { path: '/chat', icon: MessageSquare, label: 'Chat', badge: 5 },
  { path: '/prs', icon: GitPullRequest, label: 'Pull Requests', badge: 3 },
  { path: '/issues', icon: CircleDot, label: 'Issues', badge: null },
  { path: '/ai', icon: Sparkles, label: 'AI Assistant', badge: null },
  { path: '/analytics', icon: BarChart3, label: 'Analytics', badge: null },
  // { path: '/deployments', icon: Rocket, label: 'Deployments', badge: null },
];

const STATUS_COLORS: Record<string, string> = {
  coding: '#10B981',
  reviewing: '#3B82F6',
  meeting: '#F59E0B',
  idle: '#4D6280',
  offline: '#4D6280',
};

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();
  const onlineMembers = TEAM_MEMBERS.filter(m => m.online).slice(0, 4);

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 60 : 220 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex-shrink-0 flex flex-col h-full overflow-hidden border-r border-[#1A2E48] relative z-10"
      style={{ background: 'linear-gradient(180deg, #0A1222 0%, #080C16 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3.5 h-12 border-b border-[#1A2E48] flex-shrink-0">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 animated-border">
          <Zap size={14} className="text-white" fill="white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <span className="text-sm font-bold tracking-tight gradient-text whitespace-nowrap">XOR Code</span>
              <span className="ml-2 text-[10px] bg-[#162338] text-[#3B82F6] px-1.5 py-0.5 rounded font-medium">BETA</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleSidebar}
          className={`ml-auto p-1 rounded hover:bg-[#1A2E48] text-[#4D6280] hover:text-[#8BA4C0] transition-all flex-shrink-0 ${sidebarCollapsed ? 'rotate-180' : ''}`}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
        {!sidebarCollapsed && (
          <p className="text-[10px] uppercase tracking-widest text-[#4D6280] font-semibold px-2 pt-1 pb-1.5">Navigation</p>
        )}

        {NAV_ITEMS.map(({ path, icon: Icon, label, badge }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              title={sidebarCollapsed ? label : undefined}
              className={({ isActive: navActive }) =>
                `flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all duration-150 group relative ${
                  isActive || navActive
                    ? 'nav-active text-[#E2EEFF]'
                    : 'text-[#8BA4C0] hover:text-[#E2EEFF] hover:bg-[#111C2E]'
                }`
              }
            >
              <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-[#3B82F6]' : ''}`} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium whitespace-nowrap flex-1"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!sidebarCollapsed && badge && (
                <span className="text-[10px] bg-[#3B82F6] text-white px-1.5 py-0.5 rounded-full font-semibold min-w-[18px] text-center">
                  {badge}
                </span>
              )}
              {sidebarCollapsed && badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#3B82F6] rounded-full" />
              )}
            </NavLink>
          );
        })}

        {/* Team members */}
        <div className="pt-3">
          {!sidebarCollapsed && (
            <p className="text-[10px] uppercase tracking-widest text-[#4D6280] font-semibold px-2 pb-1.5">Online Now</p>
          )}
          {sidebarCollapsed && <div className="h-px bg-[#1A2E48] mx-1 mb-2" />}

          <div className={`${sidebarCollapsed ? 'flex flex-col items-center gap-1.5 px-0.5' : 'space-y-0.5 px-1'}`}>
            {onlineMembers.map(member => (
              <div
                key={member.id}
                title={sidebarCollapsed ? `${member.name} — ${member.status}` : undefined}
                className={`flex items-center gap-2 rounded-lg p-1.5 hover:bg-[#111C2E] cursor-pointer transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: member.color }}
                  >
                    {member.initials}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0A1222]"
                    style={{ background: STATUS_COLORS[member.status] }}
                  />
                </div>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="min-w-0"
                    >
                      <p className="text-xs font-medium text-[#E2EEFF] truncate leading-none">{member.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-[#4D6280] truncate leading-none mt-0.5 capitalize">{member.status}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-[#1A2E48] p-1.5 space-y-0.5 flex-shrink-0">
        {[
          { icon: HelpCircle, label: 'Help' },
          { icon: Settings, label: 'Settings' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={sidebarCollapsed ? label : undefined}
            className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-[#4D6280] hover:text-[#8BA4C0] hover:bg-[#111C2E] transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <Icon size={15} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">{label}</span>}
          </button>
        ))}
      </div>
    </motion.aside>
  );
}
