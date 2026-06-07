import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';
import { X, Circle, ChevronDown, Check, GitBranch, Wifi, Users } from 'lucide-react';
import { FileExplorer } from '../components/editor/FileExplorer';
import { useAppStore } from '../store/appStore';
import { TEAM_MEMBERS, CURRENT_USER } from '../data/mockData';
import type { FileNode } from '../types';

const THEMES = [
  { id: 'vs-dark', label: 'Dark+' },
  { id: 'hc-black', label: 'High Contrast' },
];

const LANG_DISPLAY: Record<string, string> = {
  typescript: 'TypeScript', javascript: 'JavaScript',
  json: 'JSON', markdown: 'Markdown', svg: 'SVG', css: 'CSS',
};

const FAKE_CURSORS = [
  { user: TEAM_MEMBERS[1], line: 23, col: 18 },
  { user: TEAM_MEMBERS[3], line: 45, col: 4 },
];

function FileTabs({ files, activeId, onSelect, onClose }: {
  files: FileNode[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}) {
  return (
    <div className="flex items-center overflow-x-auto border-b border-[#1A2E48] flex-shrink-0" style={{ background: '#0A1222' }}>
      {files.map(file => (
        <div
          key={file.id}
          onClick={() => onSelect(file.id)}
          className={`flex items-center gap-2 px-4 py-2.5 border-r border-[#1A2E48] cursor-pointer flex-shrink-0 transition-colors ${
            activeId === file.id
              ? 'bg-[#0D1321] border-b-2 border-b-[#3B82F6] -mb-px'
              : 'hover:bg-[#111C2E] text-[#4D6280] hover:text-[#8BA4C0]'
          }`}
        >
          {file.modified && <Circle size={5} className="fill-[#F59E0B] text-[#F59E0B] flex-shrink-0" />}
          <span className={`text-xs font-medium ${activeId === file.id ? 'text-[#E2EEFF]' : ''}`}>{file.name}</span>
          <button
            onClick={e => { e.stopPropagation(); onClose(file.id); }}
            className="text-[#4D6280] hover:text-[#E2EEFF] p-0.5 rounded hover:bg-[#1A2E48] transition-colors"
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function Editor() {
  const { openFiles, activeFileId, closeFile, setActiveFile, openFile } = useAppStore();
  const [theme, setTheme] = useState('vs-dark');
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [collaborators, setCollaborators] = useState(FAKE_CURSORS);
  const editorRef = useRef<any>(null);

  const activeFile = openFiles.find(f => f.id === activeFileId);

  useEffect(() => {
    if (openFiles.length === 0) {
      const defaultFile = {
        id: 'auth-file', name: 'Auth.tsx', type: 'file' as const, language: 'typescript',
        modified: true,
        content: `import React, { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';\nimport { useAuth } from '../hooks/useAuth';\n\ninterface AuthProps {\n  mode: 'login' | 'register';\n}\n\nexport const Auth: React.FC<AuthProps> = ({ mode }) => {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const { login, register, loading, error } = useAuth();\n  const navigate = useNavigate();\n\n  const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();\n    try {\n      if (mode === 'login') {\n        await login(email, password);\n      } else {\n        await register(email, password);\n      }\n      navigate('/dashboard');\n    } catch (err) {\n      console.error('Auth error:', err);\n    }\n  };\n\n  return (\n    <div className="auth-container">\n      <form onSubmit={handleSubmit}>\n        <input\n          type="email"\n          value={email}\n          onChange={(e) => setEmail(e.target.value)}\n          placeholder="Email"\n          required\n        />\n        <input\n          type="password"\n          value={password}\n          onChange={(e) => setPassword(e.target.value)}\n          placeholder="Password"\n          required\n        />\n        <button type="submit" disabled={loading}>\n          {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}\n        </button>\n        {error && <p className="error">{error}</p>}\n      </form>\n    </div>\n  );\n};`,
      };
      openFile(defaultFile);
    }
  }, []);

  // Simulate cursor movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev =>
        prev.map(c => ({
          ...c,
          line: Math.max(1, c.line + Math.floor(Math.random() * 5) - 2),
          col: Math.max(1, c.col + Math.floor(Math.random() * 10) - 5),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      {/* File Explorer Sidebar */}
      <div className="w-52 flex-shrink-0 border-r border-[#1A2E48] overflow-hidden" style={{ background: '#0A1222' }}>
        <FileExplorer />
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        {openFiles.length > 0 && (
          <FileTabs
            files={openFiles}
            activeId={activeFileId}
            onSelect={setActiveFile}
            onClose={closeFile}
          />
        )}

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden relative">
          {activeFile ? (
            <>
              <MonacoEditor
                height="100%"
                language={activeFile.language ?? 'plaintext'}
                value={activeFile.content ?? '// Select a file to edit'}
                theme={theme}
                options={{
                  fontSize: 13,
                  fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
                  fontLigatures: true,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: 'line',
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  bracketPairColorization: { enabled: true },
                  guides: { bracketPairs: true },
                  tabSize: 2,
                  insertSpaces: true,
                }}
                onMount={editor => { editorRef.current = editor; }}
              />

              {/* Fake collaborator cursor badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 pointer-events-none">
                {collaborators.map(({ user, line, col }) => (
                  <motion.div
                    key={user.id}
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                    className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] text-white font-medium shadow-lg"
                    style={{ background: user.color }}
                  >
                    <span>{user.initials}</span>
                    <span className="opacity-80">Ln {line}</span>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center" style={{ background: '#0D1321' }}>
              <div className="w-16 h-16 rounded-2xl bg-[#111C2E] flex items-center justify-center mb-4">
                <Users size={28} className="text-[#243B55]" />
              </div>
              <p className="text-sm font-semibold text-[#4D6280]">No file open</p>
              <p className="text-xs text-[#2D3F55] mt-1">Select a file from the explorer</p>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div
          className="flex items-center gap-4 px-3 py-1 border-t border-[#1A2E48] text-[10px] flex-shrink-0"
          style={{ background: '#060A12' }}
        >
          {/* Collaborators */}
          <div className="flex items-center gap-1.5">
            {collaborators.concat([{ user: TEAM_MEMBERS[0], line: 1, col: 1 }]).map(({ user }) => (
              <div
                key={user.id}
                title={user.name}
                className="w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center"
                style={{ background: user.color }}
              >
                {user.initials.charAt(0)}
              </div>
            ))}
            <span className="text-[#4D6280]">{collaborators.length + 1} editing</span>
          </div>

          <div className="flex items-center gap-1 text-[#10B981]">
            <Wifi size={9} />
            <span>Synced</span>
          </div>

          <div className="flex items-center gap-1 text-[#4D6280]">
            <GitBranch size={9} />
            <span>feat/realtime-collab</span>
          </div>

          <div className="ml-auto flex items-center gap-3 text-[#4D6280]">
            {/* Theme switcher */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(v => !v)}
                className="flex items-center gap-1 hover:text-[#8BA4C0] transition-colors"
              >
                <span>{THEMES.find(t => t.id === theme)?.label ?? 'Theme'}</span>
                <ChevronDown size={9} />
              </button>
              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute bottom-full right-0 mb-1 rounded-lg border border-[#1A2E48] py-1 w-36 shadow-xl z-10"
                    style={{ background: '#0D1321' }}
                  >
                    {THEMES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setTheme(t.id); setThemeMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#8BA4C0] hover:text-[#E2EEFF] hover:bg-[#111C2E] transition-colors"
                      >
                        {theme === t.id && <Check size={10} className="text-[#3B82F6]" />}
                        {theme !== t.id && <span className="w-[10px]" />}
                        {t.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {activeFile && <span>{LANG_DISPLAY[activeFile.language ?? ''] ?? activeFile.language}</span>}
            <span>UTF-8</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
