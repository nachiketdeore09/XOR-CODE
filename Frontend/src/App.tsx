import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { Chat } from './pages/Chat';
import { PullRequests } from './pages/PullRequests';
import { Issues } from './pages/Issues';
import { AIAssistant } from './pages/AIAssistant';
import { Analytics } from './pages/Analytics';
import { Deployments } from './pages/Deployments';
import { CommandPalette } from './components/CommandPalette';
import { useAppStore } from './store/appStore';

export default function App() {
  const { openCommandPalette, closeCommandPalette, commandPaletteOpen } = useAppStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        commandPaletteOpen ? closeCommandPalette() : openCommandPalette();
      }
      if (e.key === 'Escape' && commandPaletteOpen) closeCommandPalette();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, openCommandPalette, closeCommandPalette]);

  return (
    <BrowserRouter>
      <AnimatePresence>
        {commandPaletteOpen && <CommandPalette />}
      </AnimatePresence>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/prs" element={<PullRequests />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/deployments" element={<Deployments />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
