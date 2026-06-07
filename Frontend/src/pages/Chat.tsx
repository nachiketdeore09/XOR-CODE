import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Lock, Plus, Send, Smile, Paperclip, Search, AtSign, MoreHorizontal } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { CURRENT_USER, USERS } from '../data/mockData';

const EMOJI_QUICK = ['👍', '✅', '🚀', '🎉', '❤️', '🔥', '😂', '🤔'];

function Avatar({ initials, color, size = 7, online }: { initials: string; color: string; size?: number; online?: boolean }) {
  return (
    <div className="relative flex-shrink-0">
      <div
        className={`w-${size} h-${size} rounded-full flex items-center justify-center text-[10px] font-bold text-white`}
        style={{ background: color, width: `${size * 4}px`, height: `${size * 4}px` }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-[#0D1321]"
          style={{ width: 8, height: 8, background: online ? '#10B981' : '#4D6280' }}
        />
      )}
    </div>
  );
}

function TypingIndicator({ users }: { users: string[] }) {
  if (!users.length) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-[#4D6280]">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-[#4D6280] rounded-full typing-dot" />
        <span className="w-1.5 h-1.5 bg-[#4D6280] rounded-full typing-dot" />
        <span className="w-1.5 h-1.5 bg-[#4D6280] rounded-full typing-dot" />
      </div>
      <span>{users.join(', ')} {users.length === 1 ? 'is' : 'are'} typing...</span>
    </div>
  );
}

export function Chat() {
  const { channels, activeChannelId, setActiveChannel, sendMessage, addReaction, typingUsers } = useAppStore();
  const [input, setInput] = useState('');
  const [showEmojiFor, setShowEmojiFor] = useState<string | null>(null);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [simulatedTyping, setSimulatedTyping] = useState<string[]>([]);

  const activeChannel = channels.find(c => c.id === activeChannelId)!;
  const messages = activeChannel?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Simulate occasional typing indicators
  useEffect(() => {
    const simulate = () => {
      const typer = USERS[Math.floor(Math.random() * USERS.length)];
      if (typer.id === CURRENT_USER.id) return;
      setSimulatedTyping([typer.name.split(' ')[0]]);
      setTimeout(() => setSimulatedTyping([]), 2500);
    };
    const interval = setInterval(simulate, 12000);
    return () => clearInterval(interval);
  }, [activeChannelId]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(activeChannelId, trimmed);
    setInput('');
  };

  const isOwnMessage = (authorId: string) => authorId === CURRENT_USER.id;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Channel sidebar */}
      <div className="w-56 flex-shrink-0 flex flex-col border-r border-[#1A2E48] overflow-hidden" style={{ background: '#0A1222' }}>
        <div className="px-3 py-3 border-b border-[#1A2E48]">
          <div className="relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4D6280]" />
            <input
              placeholder="Search channels..."
              className="w-full bg-[#111C2E] rounded-lg border border-[#1A2E48] text-xs text-[#E2EEFF] pl-7 pr-3 py-1.5 placeholder-[#4D6280] outline-none focus:border-[#243B55] transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          {/* Channels */}
          <div className="mb-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <p className="text-[10px] uppercase tracking-widest text-[#4D6280] font-semibold">Channels</p>
              <button className="text-[#4D6280] hover:text-[#8BA4C0] transition-colors"><Plus size={12} /></button>
            </div>
            {channels.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left ${
                  ch.id === activeChannelId ? 'bg-[#162338] text-[#E2EEFF]' : 'text-[#4D6280] hover:text-[#8BA4C0] hover:bg-[#111C2E]'
                }`}
              >
                {ch.isPrivate ? <Lock size={12} /> : <Hash size={12} />}
                <span className="text-xs font-medium flex-1 truncate">{ch.name}</span>
                {ch.unreadCount > 0 && (
                  <span className="text-[10px] bg-[#3B82F6] text-white px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                    {ch.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* DMs */}
          <div>
            <div className="flex items-center justify-between px-1 mb-1">
              <p className="text-[10px] uppercase tracking-widest text-[#4D6280] font-semibold">Direct Messages</p>
              <button className="text-[#4D6280] hover:text-[#8BA4C0] transition-colors"><Plus size={12} /></button>
            </div>
            {USERS.filter(u => u.id !== CURRENT_USER.id).slice(0, 4).map(user => (
              <button
                key={user.id}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#111C2E] transition-colors text-left"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center" style={{ background: user.color }}>
                    {user.initials.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0A1222]" style={{ background: user.online ? '#10B981' : '#4D6280' }} />
                </div>
                <span className="text-xs text-[#8BA4C0] truncate">{user.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Channel header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1A2E48] flex-shrink-0" style={{ background: '#0D1321' }}>
          <Hash size={16} className="text-[#4D6280]" />
          <div>
            <span className="text-sm font-semibold text-[#E2EEFF]">{activeChannel?.name}</span>
            {activeChannel?.description && (
              <span className="text-xs text-[#4D6280] ml-3">{activeChannel.description}</span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex -space-x-1">
              {activeChannel?.members.slice(0, 5).map(m => (
                <div key={m.id} className="w-5 h-5 rounded-full border-2 border-[#0D1321] text-[8px] font-bold text-white flex items-center justify-center" style={{ background: m.color }}>
                  {m.initials.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-xs text-[#4D6280]">{activeChannel?.members.length} members</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          {messages.map((msg, i) => {
            const prevMsg = messages[i - 1];
            const isContinuation = prevMsg?.author.id === msg.author.id;
            const isOwn = isOwnMessage(msg.author.id);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="group relative"
                onMouseEnter={() => setHoveredMsg(msg.id)}
                onMouseLeave={() => { setHoveredMsg(null); setShowEmojiFor(null); }}
              >
                <div className={`flex gap-3 ${isContinuation ? 'mt-0.5' : 'mt-4'}`}>
                  {!isContinuation ? (
                    <Avatar initials={msg.author.initials} color={msg.author.color} size={8} />
                  ) : (
                    <div className="w-8" />
                  )}
                  <div className="flex-1 min-w-0">
                    {!isContinuation && (
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-[#E2EEFF]">{msg.author.name}</span>
                        <span className="text-[10px] text-[#4D6280]">{msg.timestamp}</span>
                      </div>
                    )}
                    <p className="text-sm text-[#8BA4C0] leading-relaxed break-words">{msg.content}</p>

                    {/* Reactions */}
                    {msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {msg.reactions.filter(r => r.count > 0).map(r => (
                          <button
                            key={r.emoji}
                            onClick={() => addReaction(activeChannelId, msg.id, r.emoji)}
                            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all ${
                              r.users.includes(CURRENT_USER.id)
                                ? 'bg-[#3B82F6]/15 border-[#3B82F6]/30 text-[#E2EEFF]'
                                : 'bg-[#111C2E] border-[#1A2E48] text-[#8BA4C0] hover:border-[#243B55]'
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span className="font-medium">{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover actions */}
                <AnimatePresence>
                  {hoveredMsg === msg.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute -top-3 right-2 flex items-center gap-1 rounded-lg border border-[#1A2E48] px-1 py-0.5 shadow-xl z-10"
                      style={{ background: '#0D1321' }}
                    >
                      {EMOJI_QUICK.slice(0, 5).map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(activeChannelId, msg.id, emoji)}
                          className="text-sm hover:scale-125 transition-transform p-0.5"
                        >
                          {emoji}
                        </button>
                      ))}
                      <button className="p-1 text-[#4D6280] hover:text-[#8BA4C0] transition-colors">
                        <MoreHorizontal size={13} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          <TypingIndicator users={simulatedTyping} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="flex items-end gap-2 rounded-xl border border-[#1A2E48] focus-within:border-[#243B55] transition-colors px-3 py-2" style={{ background: '#111C2E' }}>
            <button className="text-[#4D6280] hover:text-[#8BA4C0] transition-colors p-0.5">
              <Paperclip size={15} />
            </button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message #${activeChannel?.name}`}
              rows={1}
              className="flex-1 bg-transparent text-sm text-[#E2EEFF] placeholder-[#4D6280] outline-none resize-none leading-relaxed"
              style={{ maxHeight: 120 }}
            />
            <div className="flex items-center gap-1">
              <button className="text-[#4D6280] hover:text-[#8BA4C0] transition-colors p-0.5">
                <AtSign size={15} />
              </button>
              <button className="text-[#4D6280] hover:text-[#8BA4C0] transition-colors p-0.5">
                <Smile size={15} />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="ml-1 p-1.5 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-[#4D6280] mt-1 px-1">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
