import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { NotificationCenter } from '../NotificationCenter';
import { useAppStore } from '../../store/appStore';

export function Layout() {
  const { sidebarCollapsed, notificationPanelOpen, terminalOpen, terminalOutput } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#080C16]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        <div className="flex flex-1 overflow-hidden relative">
          <main className="flex-1 overflow-auto">
            <motion.div
              key="page"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </main>

          <AnimatePresence>
            {notificationPanelOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="w-80 border-l border-[#1A2E48] overflow-y-auto flex-shrink-0"
                style={{ background: '#0D1321' }}
              >
                <NotificationCenter />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Terminal panel */}
        <AnimatePresence>
          {terminalOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 240, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="border-t border-[#1A2E48] overflow-hidden flex-shrink-0"
              style={{ background: '#06080F' }}
            >
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1A2E48]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444] opacity-80" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B] opacity-80" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981] opacity-80" />
                </div>
                <span className="text-xs text-[#4D6280] font-mono">Terminal — zsh</span>
              </div>
              <div className="p-3 font-mono text-xs overflow-y-auto h-[calc(240px-36px)]">
                {terminalOutput.map((line, i) => (
                  <div key={i} className={`${line.startsWith('$') ? 'text-[#3B82F6]' : line.startsWith('  ➜') ? 'text-[#10B981]' : line.includes('Error') || line.includes('error') ? 'text-[#EF4444]' : 'text-[#8BA4C0]'} leading-5`}>
                    {line || ' '}
                  </div>
                ))}
                <div className="flex items-center gap-1 text-[#3B82F6] mt-1">
                  <span>$</span>
                  <span className="w-2 h-4 bg-[#3B82F6] cursor-blink opacity-80" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
