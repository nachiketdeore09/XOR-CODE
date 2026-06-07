import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Search, FileCode, FileText, FileJson,
  Folder, FolderOpen, Circle, X,
} from 'lucide-react';
import type { FileNode } from '../../types';
import { useAppStore } from '../../store/appStore';

const LANG_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  typescript: FileCode, javascript: FileCode, json: FileJson,
  markdown: FileText, svg: FileText, css: FileText,
};

function getFileIcon(node: FileNode) {
  if (node.type === 'folder') return null;
  const Icon = LANG_ICONS[node.language ?? ''] ?? FileText;
  return Icon;
}

const LANG_COLORS: Record<string, string> = {
  typescript: '#3B82F6', javascript: '#F59E0B', json: '#10B981',
  markdown: '#8BA4C0', svg: '#EF4444', css: '#7C3AED',
};

function FileTreeNode({ node, depth }: { node: FileNode; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const { openFile, activeFileId } = useAppStore();
  const isActive = activeFileId === node.id;

  const Icon = getFileIcon(node);

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center gap-1 py-0.5 px-1 rounded hover:bg-[#162338] transition-colors text-left group"
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
        >
          <ChevronRight
            size={12}
            className={`text-[#4D6280] transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}
          />
          {expanded
            ? <FolderOpen size={13} className="text-[#F59E0B] flex-shrink-0" />
            : <Folder size={13} className="text-[#F59E0B] flex-shrink-0" />
          }
          <span className="text-xs text-[#8BA4C0] group-hover:text-[#E2EEFF] transition-colors font-medium truncate">{node.name}</span>
        </button>
        <AnimatePresence>
          {expanded && node.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {node.children.map(child => (
                <FileTreeNode key={child.id} node={child} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <button
      onClick={() => openFile(node)}
      className={`w-full flex items-center gap-1.5 py-0.5 px-1 rounded transition-colors text-left group ${
        isActive ? 'bg-[#162338] text-[#E2EEFF]' : 'hover:bg-[#111C2E]'
      }`}
      style={{ paddingLeft: `${depth * 12 + 16}px` }}
    >
      {Icon && (
        <span style={{ color: LANG_COLORS[node.language ?? ''] ?? '#8BA4C0', display: 'flex', flexShrink: 0 }}>
          <Icon size={12} />
        </span>
      )}
      <span className={`text-xs truncate font-medium ${isActive ? 'text-[#E2EEFF]' : 'text-[#8BA4C0] group-hover:text-[#E2EEFF]'} transition-colors`}>
        {node.name}
      </span>
      {node.modified && (
        <Circle size={5} className="text-[#F59E0B] fill-[#F59E0B] flex-shrink-0 ml-auto" />
      )}
    </button>
  );
}

export function FileExplorer() {
  const { fileTree } = useAppStore();
  const [search, setSearch] = useState('');

  const filteredTree = search
    ? fileTree.map(f => ({ ...f, children: f.children?.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) }))
    : fileTree;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-[#1A2E48] flex-shrink-0">
        <p className="text-[10px] uppercase tracking-widest text-[#4D6280] font-semibold mb-2">Explorer</p>
        <div className="relative">
          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#4D6280]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-[#111C2E] rounded border border-[#1A2E48] text-xs text-[#E2EEFF] pl-6 pr-2 py-1.5 placeholder-[#4D6280] outline-none focus:border-[#3B82F6]/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#4D6280] hover:text-[#8BA4C0]">
              <X size={10} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-1 px-1">
        {filteredTree.map(node => (
          <FileTreeNode key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}
