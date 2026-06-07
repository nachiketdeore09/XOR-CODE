import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, LayoutDashboard, Code2, MessageSquare, GitPullRequest, CircleDot, Sparkles, BarChart3, Rocket, ArrowRight, Hash } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { COMMAND_PALETTE_ITEMS } from '../data/mockData';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard, Code2, MessageSquare, GitPullRequest, CircleDot,
  Sparkles, BarChart3, Rocket, GitPullRequestArrow: GitPullRequest, Plus: Hash,
};

export function CommandPalette() {
  const { closeCommandPalette } = useAppStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? COMMAND_PALETTE_ITEMS.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
    : COMMAND_PALETTE_ITEMS;

  useEffect(() => {
    inputRef.current?.focus();
    setSelectedIdx(0);
  }, []);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    closeCommandPalette();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIdx]) {
      handleSelect(filtered[selectedIdx].path);
    } else if (e.key === 'Escape') {
      closeCommandPalette();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={closeCommandPalette}
      />

      {/* Palette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 rounded-2xl border border-[#243B55] shadow-2xl overflow-hidden"
        style={{ background: '#0D1321', boxShadow: '0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.08)' }}
        onKeyDown={handleKey}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1A2E48]">
          <Search size={16} className="text-[#4D6280] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands, files, issues..."
            className="flex-1 bg-transparent text-sm text-[#E2EEFF] placeholder-[#4D6280] outline-none font-medium"
          />
          <kbd className="text-[10px] text-[#4D6280] bg-[#111C2E] px-1.5 py-0.5 rounded border border-[#1A2E48] font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#4D6280]">No results for "{query}"</div>
          ) : (
            <>
              {['nav', 'action'].map(type => {
                const items = filtered.filter(i => i.type === type);
                if (!items.length) return null;
                return (
                  <div key={type} className="mb-2">
                    <p className="px-4 py-1 text-[10px] uppercase tracking-widest text-[#4D6280] font-semibold">
                      {type === 'nav' ? 'Navigation' : 'Actions'}
                    </p>
                    {items.map((item, idx) => {
                      const Icon = ICON_MAP[item.icon] ?? Hash;
                      const globalIdx = filtered.indexOf(item);
                      const isSelected = globalIdx === selectedIdx;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.path)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            isSelected
                              ? 'bg-[#162338] text-[#E2EEFF]'
                              : 'text-[#8BA4C0] hover:text-[#E2EEFF] hover:bg-[#111C2E]'
                          }`}
                          onMouseEnter={() => setSelectedIdx(globalIdx)}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#3B82F6]/20' : 'bg-[#111C2E]'}`}>
                            <Icon size={14} className={isSelected ? 'text-[#3B82F6]' : 'text-[#4D6280]'} />
                          </div>
                          <span className="font-medium">{item.label}</span>
                          <ArrowRight size={13} className={`ml-auto transition-opacity ${isSelected ? 'opacity-100 text-[#3B82F6]' : 'opacity-0'}`} />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#1A2E48] px-4 py-2 flex items-center gap-4 text-[10px] text-[#4D6280]">
          <span><kbd className="bg-[#111C2E] px-1 rounded border border-[#1A2E48] font-mono">↑↓</kbd> Navigate</span>
          <span><kbd className="bg-[#111C2E] px-1 rounded border border-[#1A2E48] font-mono">↵</kbd> Select</span>
          <span><kbd className="bg-[#111C2E] px-1 rounded border border-[#1A2E48] font-mono">ESC</kbd> Close</span>
        </div>
      </motion.div>
    </>
  );
}
