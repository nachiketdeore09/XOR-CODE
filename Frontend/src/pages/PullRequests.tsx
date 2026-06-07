import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitPullRequest, GitMerge, Plus, Filter, Search,
  CheckCircle, XCircle, Clock, MessageSquare, ChevronDown,
  ChevronRight, FileCode, Plus as PlusIcon, Check, X,
} from 'lucide-react';
import { PULL_REQUESTS, PR_COMMENTS } from '../data/mockData';
import type { PullRequest } from '../types';

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', icon: GitPullRequest },
  closed: { label: 'Closed', color: 'text-[#4D6280]', bg: 'bg-[#4D6280]/10', border: 'border-[#4D6280]/20', icon: XCircle },
  merged: { label: 'Merged', color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/10', border: 'border-[#7C3AED]/20', icon: GitMerge },
  draft: { label: 'Draft', color: 'text-[#4D6280]', bg: 'bg-[#4D6280]/10', border: 'border-[#4D6280]/20', icon: FileCode },
};

const CI_CONFIG = {
  passing: { icon: CheckCircle, color: 'text-[#10B981]', label: 'CI passing' },
  failing: { icon: XCircle, color: 'text-[#EF4444]', label: 'CI failing' },
  pending: { icon: Clock, color: 'text-[#F59E0B]', label: 'CI pending' },
  none: { icon: Clock, color: 'text-[#4D6280]', label: 'No CI' },
};

const LABEL_COLORS: Record<string, string> = {
  feature: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  bug: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  refactor: 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20',
  security: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  chore: 'bg-[#4D6280]/10 text-[#4D6280] border-[#4D6280]/20',
  performance: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  backend: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20',
};

function PRCard({ pr, onClick, selected }: { pr: PullRequest; onClick: () => void; selected: boolean }) {
  const status = STATUS_CONFIG[pr.status];
  const ci = CI_CONFIG[pr.ciStatus];
  const CiIcon = ci.icon;

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`flex items-start gap-4 px-5 py-4 border-b border-[#1A2E48]/50 cursor-pointer transition-colors ${
        selected ? 'bg-[#111C2E]' : 'hover:bg-[#0F1829]'
      }`}
    >
      <div className={`mt-0.5 flex-shrink-0`}>
        <GitPullRequest size={16} className={status.color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-sm font-semibold text-[#E2EEFF] leading-tight">{pr.title}</span>
        </div>

        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-xs text-[#4D6280]">#{pr.number}</span>
          <span className="text-xs text-[#4D6280]">
            by <span className="text-[#8BA4C0]">{pr.author.name}</span>
          </span>
          <span className="text-xs text-[#4D6280]">{pr.updatedAt}</span>
          <div className="flex items-center gap-1">
            <CiIcon size={11} className={ci.color} />
            <span className={`text-[10px] ${ci.color}`}>{ci.label}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#4D6280]">
            <MessageSquare size={11} />
            <span>{pr.comments}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {pr.labels.map(l => (
            <span key={l} className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${LABEL_COLORS[l] ?? 'bg-[#111C2E] text-[#4D6280] border-[#1A2E48]'}`}>
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Reviewer avatars */}
        <div className="flex -space-x-1">
          {pr.reviewers.slice(0, 3).map(r => (
            <div key={r.id} title={r.name} className="w-5 h-5 rounded-full border-2 border-[#0D1321] text-[8px] font-bold text-white flex items-center justify-center" style={{ background: r.color }}>
              {r.initials.charAt(0)}
            </div>
          ))}
        </div>
        <div className="text-xs text-[#4D6280]">
          <span className="text-[#10B981]">+{pr.changes.additions}</span>
          {' '}
          <span className="text-[#EF4444]">-{pr.changes.deletions}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function PullRequests() {
  const [filter, setFilter] = useState<'all' | 'open' | 'merged' | 'draft'>('open');
  const [selectedPR, setSelectedPR] = useState<string | null>('pr1');
  const [reviewAction, setReviewAction] = useState<Record<string, string>>({});

  const filtered = filter === 'all'
    ? PULL_REQUESTS
    : PULL_REQUESTS.filter(pr => pr.status === filter);

  const detailPR = PULL_REQUESTS.find(pr => pr.id === selectedPR);

  const TABS = [
    { key: 'open', label: 'Open', count: PULL_REQUESTS.filter(p => p.status === 'open').length },
    { key: 'merged', label: 'Merged', count: PULL_REQUESTS.filter(p => p.status === 'merged').length },
    { key: 'draft', label: 'Draft', count: PULL_REQUESTS.filter(p => p.status === 'draft').length },
    { key: 'all', label: 'All', count: PULL_REQUESTS.length },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* PR List */}
      <div className="w-[420px] flex-shrink-0 flex flex-col border-r border-[#1A2E48] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1A2E48] flex-shrink-0" style={{ background: '#0D1321' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#E2EEFF]">Pull Requests</h2>
            <button className="flex items-center gap-1 text-xs bg-[#3B82F6] text-white px-2.5 py-1.5 rounded-lg hover:bg-[#2563EB] transition-colors font-medium">
              <Plus size={12} />
              New PR
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === key ? 'bg-[#162338] text-[#E2EEFF]' : 'text-[#4D6280] hover:text-[#8BA4C0] hover:bg-[#111C2E]'
                }`}
              >
                {label}
                {count > 0 && <span className="ml-1.5 text-[10px] opacity-70">{count}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ background: '#0D1321' }}>
          {filtered.map(pr => (
            <PRCard
              key={pr.id}
              pr={pr}
              onClick={() => setSelectedPR(pr.id === selectedPR ? null : pr.id)}
              selected={pr.id === selectedPR}
            />
          ))}
        </div>
      </div>

      {/* PR Detail */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#080C16' }}>
        {detailPR ? (
          <div className="max-w-3xl mx-auto px-6 py-5">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start gap-3 mb-3">
                <h1 className="text-lg font-bold text-[#E2EEFF] leading-tight flex-1">{detailPR.title}</h1>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[detailPR.status].bg} ${STATUS_CONFIG[detailPR.status].color} ${STATUS_CONFIG[detailPR.status].border} flex-shrink-0`}>
                  {(() => { const Icon = STATUS_CONFIG[detailPR.status].icon; return <Icon size={12} />; })()}
                  {STATUS_CONFIG[detailPR.status].label}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#4D6280]">
                <span>#{detailPR.number}</span>
                <span className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center" style={{ background: detailPR.author.color }}>
                    {detailPR.author.initials.charAt(0)}
                  </div>
                  {detailPR.author.name}
                </span>
                <span>{detailPR.branch} → {detailPR.targetBranch}</span>
                <span>opened {detailPR.createdAt}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Files', value: detailPR.changes.files },
                { label: 'Additions', value: `+${detailPR.changes.additions}`, color: 'text-[#10B981]' },
                { label: 'Deletions', value: `-${detailPR.changes.deletions}`, color: 'text-[#EF4444]' },
                { label: 'Comments', value: detailPR.comments },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl border border-[#1A2E48] p-3 text-center" style={{ background: '#0D1321' }}>
                  <p className={`text-sm font-bold ${color ?? 'text-[#E2EEFF]'}`}>{value}</p>
                  <p className="text-[10px] text-[#4D6280] mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="rounded-xl border border-[#1A2E48] p-4 mb-4" style={{ background: '#0D1321' }}>
              <h3 className="text-xs font-semibold text-[#8BA4C0] mb-2">Description</h3>
              <p className="text-sm text-[#8BA4C0] leading-relaxed">{detailPR.body}</p>
            </div>

            {/* Review Actions */}
            {detailPR.status === 'open' && (
              <div className="rounded-xl border border-[#1A2E48] p-4 mb-4" style={{ background: '#0D1321' }}>
                <h3 className="text-xs font-semibold text-[#8BA4C0] mb-3">Your Review</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setReviewAction(p => ({ ...p, [detailPR.id]: 'approved' }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                      reviewAction[detailPR.id] === 'approved'
                        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30'
                        : 'border-[#1A2E48] text-[#8BA4C0] hover:border-[#10B981]/30 hover:text-[#10B981]'
                    }`}
                  >
                    <Check size={12} />
                    Approve
                  </button>
                  <button
                    onClick={() => setReviewAction(p => ({ ...p, [detailPR.id]: 'changes' }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                      reviewAction[detailPR.id] === 'changes'
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30'
                        : 'border-[#1A2E48] text-[#8BA4C0] hover:border-[#F59E0B]/30 hover:text-[#F59E0B]'
                    }`}
                  >
                    <X size={12} />
                    Request Changes
                  </button>
                  <button
                    onClick={() => setReviewAction(p => ({ ...p, [detailPR.id]: 'comment' }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                      reviewAction[detailPR.id] === 'comment'
                        ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30'
                        : 'border-[#1A2E48] text-[#8BA4C0] hover:border-[#3B82F6]/30 hover:text-[#3B82F6]'
                    }`}
                  >
                    <MessageSquare size={12} />
                    Comment
                  </button>
                </div>
                {reviewAction[detailPR.id] === 'approved' && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2 text-xs text-[#10B981]">
                    <CheckCircle size={13} />
                    Your approval has been submitted!
                  </motion.div>
                )}
              </div>
            )}

            {/* Comments */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#8BA4C0]">{PR_COMMENTS.length} Comments</h3>
              {PR_COMMENTS.map((comment, i) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-[#1A2E48] overflow-hidden"
                  style={{ background: '#0D1321' }}
                >
                  <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#1A2E48]/50" style={{ background: '#111C2E' }}>
                    <div className="w-5 h-5 rounded-full text-[8px] font-bold text-white flex items-center justify-center" style={{ background: comment.author.color }}>
                      {comment.author.initials.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-[#E2EEFF]">{comment.author.name}</span>
                    {comment.type === 'inline' && comment.file && (
                      <span className="text-[10px] text-[#3B82F6] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded font-mono">{comment.file}:{comment.line}</span>
                    )}
                    <span className="ml-auto text-[10px] text-[#4D6280]">{comment.timestamp}</span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-[#8BA4C0] leading-relaxed">{comment.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <GitPullRequest size={40} className="text-[#1A2E48] mb-3" />
            <p className="text-sm font-semibold text-[#4D6280]">Select a pull request</p>
            <p className="text-xs text-[#2D3F55] mt-1">Click any PR to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
