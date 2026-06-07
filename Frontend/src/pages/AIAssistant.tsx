import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, Copy, CheckCheck, User, Bot, Code2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const SUGGESTED_PROMPTS = [
  { icon: '🐛', text: 'Find and fix the memory leak in my useEffect' },
  { icon: '📝', text: 'Review PR #142 and give me feedback' },
  { icon: '💡', text: 'Explain how the useWebSocket hook works' },
  { icon: '✨', text: 'Generate a custom debounce hook with TypeScript' },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-[#1A2E48]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A2E48]" style={{ background: '#060A12' }}>
        <div className="flex items-center gap-1.5">
          <Code2 size={11} className="text-[#4D6280]" />
          <span className="text-[10px] text-[#4D6280] font-mono">typescript</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-[#4D6280] hover:text-[#8BA4C0] transition-colors"
        >
          {copied ? <CheckCheck size={11} className="text-[#10B981]" /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="code-block p-4 text-[#E2EEFF] overflow-x-auto" style={{ background: '#0A1020', margin: 0 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-sm leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
          return <CodeBlock key={i} code={code} />;
        }
        // Handle bold **text**
        const rendered = part.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) => {
          if (chunk.startsWith('**') && chunk.endsWith('**')) {
            return <strong key={j} className="font-semibold text-[#E2EEFF]">{chunk.slice(2, -2)}</strong>;
          }
          // Handle inline code `text`
          return chunk.split(/(`[^`]+`)/g).map((c, k) => {
            if (c.startsWith('`') && c.endsWith('`')) {
              return <code key={k} className="font-mono text-[11px] bg-[#111C2E] px-1.5 py-0.5 rounded text-[#A78BFA] border border-[#1A2E48]">{c.slice(1, -1)}</code>;
            }
            // Handle headers ## text
            if (c.startsWith('## ')) {
              return <h3 key={k} className="font-bold text-[#E2EEFF] text-sm mt-3 mb-1">{c.slice(3)}</h3>;
            }
            // Handle bullet ### text
            if (c.startsWith('### ')) {
              return <h4 key={k} className="font-semibold text-[#8BA4C0] text-xs mt-2 mb-1 uppercase tracking-wide">{c.slice(4)}</h4>;
            }
            return <span key={k}>{c}</span>;
          });
        });
        return <span key={i}>{rendered}</span>;
      })}
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
        <Bot size={12} className="text-white" />
      </div>
      <div className="flex items-center gap-1 bg-[#111C2E] rounded-xl px-4 py-2.5 border border-[#1A2E48]">
        <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full typing-dot" />
        <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full typing-dot" />
        <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full typing-dot" />
      </div>
    </div>
  );
}

export function AIAssistant() {
  const { aiMessages, aiThinking, sendAIMessage, clearAIChat } = useAppStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages.length, aiThinking]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || aiThinking) return;
    sendAIMessage(trimmed);
    setInput('');
  };

  const handlePrompt = (text: string) => {
    if (aiThinking) return;
    sendAIMessage(text);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1A2E48] flex-shrink-0" style={{ background: '#0D1321' }}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#E2EEFF]">XOR AI Assistant</h2>
          <p className="text-[10px] text-[#10B981] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
            Ready · Powered by Claude
          </p>
        </div>
        {aiMessages.length > 1 && (
          <button
            onClick={clearAIChat}
            className="ml-auto flex items-center gap-1.5 text-xs text-[#4D6280] hover:text-[#EF4444] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[#EF4444]/5"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2" style={{ background: '#080C16' }}>
        {/* Suggested prompts if only welcome message */}
        {aiMessages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 mb-4 max-w-2xl mx-auto">
            {SUGGESTED_PROMPTS.map(({ icon, text }) => (
              <button
                key={text}
                onClick={() => handlePrompt(text)}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-[#1A2E48] hover:border-[#243B55] hover:bg-[#0F1829] transition-all text-left"
                style={{ background: '#0D1321' }}
              >
                <span className="text-base flex-shrink-0">{icon}</span>
                <span className="text-xs text-[#8BA4C0] leading-relaxed">{text}</span>
              </button>
            ))}
          </div>
        )}

        {aiMessages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {msg.role === 'assistant' ? (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={13} className="text-white" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={13} className="text-white" />
              </div>
            )}

            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] border ${
                msg.role === 'user'
                  ? 'bg-[#162338] border-[#243B55] text-[#E2EEFF] rounded-tr-sm'
                  : 'border-[#1A2E48] text-[#8BA4C0] rounded-tl-sm'
              }`}
              style={{ background: msg.role === 'user' ? '#162338' : '#0D1321' }}
            >
              {msg.role === 'assistant' ? (
                <MessageContent content={msg.content} />
              ) : (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              )}
            </div>
          </motion.div>
        ))}

        {aiThinking && <ThinkingDots />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-[#1A2E48]" style={{ background: '#0D1321' }}>
        <div className="flex items-end gap-2 rounded-xl border border-[#1A2E48] focus-within:border-[#7C3AED]/50 transition-colors px-3 py-2.5" style={{ background: '#111C2E' }}>
          <Sparkles size={15} className="text-[#7C3AED] mb-0.5 flex-shrink-0" />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask XOR AI anything about your code..."
            rows={1}
            disabled={aiThinking}
            className="flex-1 bg-transparent text-sm text-[#E2EEFF] placeholder-[#4D6280] outline-none resize-none leading-relaxed disabled:opacity-60"
            style={{ maxHeight: 120 }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || aiThinking}
            className="p-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={13} />
          </button>
        </div>
        <p className="text-[10px] text-[#4D6280] mt-1.5 text-center">
          XOR AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
