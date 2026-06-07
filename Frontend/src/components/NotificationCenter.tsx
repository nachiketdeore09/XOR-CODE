import { motion } from 'framer-motion';
import { X, GitPullRequest, MessageSquare, AtSign, CheckCircle, XCircle, CircleDot, Rocket, Bell } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import type { Notification } from '../types';

const TYPE_CONFIG: Record<Notification['type'], { icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  pr_approved: { icon: GitPullRequest, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
  pr_comment: { icon: MessageSquare, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
  mention: { icon: AtSign, color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/10' },
  ci_passed: { icon: CheckCircle, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
  ci_failed: { icon: XCircle, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
  issue_assigned: { icon: CircleDot, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  deploy_success: { icon: Rocket, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
  deploy_failed: { icon: Rocket, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
};

export function NotificationCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead, toggleNotificationPanel } = useAppStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A2E48] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-[#3B82F6]" />
          <span className="text-sm font-semibold text-[#E2EEFF]">Notifications</span>
          {unread > 0 && (
            <span className="text-[10px] bg-[#EF4444] text-white px-1.5 py-0.5 rounded-full font-bold">{unread}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-[10px] text-[#3B82F6] hover:text-[#60A5FA] transition-colors px-2 py-1 rounded hover:bg-[#162338]"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={toggleNotificationPanel}
            className="p-1 rounded text-[#4D6280] hover:text-[#8BA4C0] hover:bg-[#111C2E] transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <Bell size={28} className="text-[#1A2E48] mb-2" />
            <p className="text-sm text-[#4D6280]">All caught up!</p>
          </div>
        ) : (
          <div>
            {notifications.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markNotificationRead(n.id)}
                  className={`flex gap-3 px-4 py-3 border-b border-[#1A2E48]/50 cursor-pointer transition-colors ${
                    n.read ? 'opacity-60 hover:opacity-80' : 'hover:bg-[#111C2E]'
                  }`}
                >
                  {!n.read && (
                    <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full flex-shrink-0 mt-1.5" />
                  )}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${cfg.bg} ${n.read ? 'ml-4' : ''}`}>
                    <Icon size={13} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#E2EEFF] truncate">{n.title}</p>
                    <p className="text-[11px] text-[#4D6280] leading-relaxed mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-[#4D6280] mt-1">{n.timestamp}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
