import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from 'recharts';
import {
  Users, GitPullRequest, CircleDot, Rocket, TrendingUp,
  ArrowUp, ArrowDown, GitCommit, CheckCircle, XCircle,
  Clock, Plus, Zap,
} from 'lucide-react';
import { motion as m } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import {
  CURRENT_USER, TEAM_MEMBERS, PULL_REQUESTS, COMMITS,
  CHART_DATA, ACTIVITY_FEED, DEPLOYMENTS,
} from '../data/mockData';

const METRICS = [
  { label: 'Active Devs', value: 8, change: '+2', up: true, icon: Users, color: '#3B82F6', bg: 'bg-[#3B82F6]/10' },
  { label: 'Open PRs', value: 12, change: '+3', up: true, icon: GitPullRequest, color: '#7C3AED', bg: 'bg-[#7C3AED]/10' },
  { label: 'Open Issues', value: 24, change: '-4', up: false, icon: CircleDot, color: '#F59E0B', bg: 'bg-[#F59E0B]/10' },
  { label: "Deploys Today", value: 3, change: '+1', up: true, icon: Rocket, color: '#10B981', bg: 'bg-[#10B981]/10' },
];

const STATUS_DOT: Record<string, string> = {
  coding: '#10B981', reviewing: '#3B82F6', meeting: '#F59E0B', idle: '#4D6280', offline: '#2D3F55',
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#243B55] p-3 shadow-xl text-xs" style={{ background: '#0D1321' }}>
      <p className="text-[#8BA4C0] mb-2 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#E2EEFF] capitalize">{p.name}: <strong>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [liveEvents, setLiveEvents] = useState(ACTIVITY_FEED);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const NEW_EVENTS = [
      { id: 'live-1', type: 'commit' as const, user: TEAM_MEMBERS[0], description: 'pushed a commit to feat/realtime-collab', timestamp: 'Just now', meta: {} },
      { id: 'live-2', type: 'review' as const, user: TEAM_MEMBERS[1], description: 'left a comment on PR #142', timestamp: 'Just now', meta: {} },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
      setLiveEvents(prev => [{ ...NEW_EVENTS[idx % NEW_EVENTS.length], timestamp: 'Just now' }, ...prev.slice(0, 6)]);
      idx++;
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const ciStatus = { passing: 34, failing: 3, pending: 5 };
  const openPRs = PULL_REQUESTS.filter(p => p.status === 'open');

  return (
    <div className="p-5 space-y-5 min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-[#E2EEFF]">
            Good morning, {CURRENT_USER.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[#4D6280] mt-0.5">Here's what's happening with your team today.</p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${pulse ? 'border-[#3B82F6] text-[#3B82F6] bg-[#3B82F6]/10' : 'border-[#1A2E48] text-[#4D6280]'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${pulse ? 'bg-[#3B82F6]' : 'bg-[#4D6280]'}`} />
          Live updates
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {METRICS.map(({ label, value, change, up, icon: Icon, color, bg }) => (
          <motion.div
            key={label}
            variants={cardVariants}
            className="rounded-xl border border-[#1A2E48] p-4 hover:border-[#243B55] transition-colors cursor-default"
            style={{ background: '#0D1321' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#4D6280] font-medium">{label}</p>
                <p className="text-2xl font-bold text-[#E2EEFF] mt-1">{value}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={17} style={{ color }} />
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${up ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
              <span>{change} this week</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Commit activity chart */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-2 rounded-xl border border-[#1A2E48] p-4"
          style={{ background: '#0D1321' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E2EEFF]">Team Activity</h3>
              <p className="text-xs text-[#4D6280] mt-0.5">Commits, PRs & Issues this week</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#4D6280]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3B82F6]" />Commits</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7C3AED]" />PRs</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" />Issues</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={CHART_DATA} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gbCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gbPRs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1A2E48" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#4D6280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4D6280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="commits" stroke="#3B82F6" strokeWidth={2} fill="url(#gbCommits)" dot={false} />
              <Area type="monotone" dataKey="prs" stroke="#7C3AED" strokeWidth={2} fill="url(#gbPRs)" dot={false} />
              <Area type="monotone" dataKey="issues" stroke="#F59E0B" strokeWidth={2} fill="none" dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* CI Status */}
        <motion.div
          variants={cardVariants}
          className="rounded-xl border border-[#1A2E48] p-4"
          style={{ background: '#0D1321' }}
        >
          <h3 className="text-sm font-semibold text-[#E2EEFF] mb-4">CI Health</h3>
          <div className="space-y-3">
            {[
              { label: 'Passing', value: ciStatus.passing, total: 42, color: '#10B981' },
              { label: 'Failing', value: ciStatus.failing, total: 42, color: '#EF4444' },
              { label: 'Pending', value: ciStatus.pending, total: 42, color: '#F59E0B' },
            ].map(({ label, value, total, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#8BA4C0]">{label}</span>
                  <span className="font-semibold" style={{ color }}>{value}</span>
                </div>
                <div className="h-1.5 bg-[#111C2E] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / total) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#1A2E48] space-y-1.5">
            <p className="text-xs text-[#4D6280] font-medium mb-2">Latest runs</p>
            {DEPLOYMENTS.slice(0, 3).map(d => (
              <div key={d.id} className="flex items-center gap-2 text-xs">
                {d.status === 'success' ? <CheckCircle size={11} className="text-[#10B981]" /> :
                 d.status === 'failed' ? <XCircle size={11} className="text-[#EF4444]" /> :
                 <Clock size={11} className="text-[#F59E0B] animate-spin" style={{ animationDuration: '3s' }} />}
                <span className="text-[#8BA4C0] truncate">{d.version}</span>
                <span className="text-[#4D6280] ml-auto">{d.duration}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Recent PRs */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-2 rounded-xl border border-[#1A2E48] overflow-hidden"
          style={{ background: '#0D1321' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A2E48]">
            <h3 className="text-sm font-semibold text-[#E2EEFF]">Pull Requests</h3>
            <button onClick={() => navigate('/prs')} className="text-xs text-[#3B82F6] hover:text-[#60A5FA] transition-colors">View all</button>
          </div>
          <div className="divide-y divide-[#1A2E48]/50">
            {openPRs.slice(0, 3).map(pr => (
              <div key={pr.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[#111C2E] transition-colors cursor-pointer">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  pr.ciStatus === 'passing' ? 'bg-[#10B981]' : pr.ciStatus === 'failing' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#E2EEFF] truncate">{pr.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[#4D6280]">#{pr.number}</span>
                    <span className="text-[10px] text-[#4D6280]">by {pr.author.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-[#4D6280]">·</span>
                    <span className="text-[10px] text-[#4D6280]">{pr.updatedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {pr.labels.slice(0, 2).map(l => (
                    <span key={l} className="text-[10px] bg-[#162338] text-[#8BA4C0] px-1.5 py-0.5 rounded-full border border-[#1A2E48]">{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          variants={cardVariants}
          className="rounded-xl border border-[#1A2E48] overflow-hidden"
          style={{ background: '#0D1321' }}
        >
          <div className="px-4 py-3 border-b border-[#1A2E48] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#E2EEFF]">Live Activity</h3>
            <span className="flex items-center gap-1 text-[10px] text-[#10B981]">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full status-online" />
              Live
            </span>
          </div>
          <div className="divide-y divide-[#1A2E48]/30 overflow-y-auto max-h-56">
            {liveEvents.slice(0, 6).map((event, i) => (
              <motion.div
                key={event.id}
                initial={i === 0 ? { opacity: 0, y: -8, backgroundColor: 'rgba(59,130,246,0.08)' } : {}}
                animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-2.5 px-4 py-2.5"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ background: event.user.color }}
                >
                  {event.user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#8BA4C0] leading-relaxed">
                    <span className="text-[#E2EEFF] font-semibold">{event.user.name.split(' ')[0]}</span>{' '}
                    {event.description}
                  </p>
                  <p className="text-[10px] text-[#4D6280] mt-0.5">{event.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Team */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="rounded-xl border border-[#1A2E48] overflow-hidden"
        style={{ background: '#0D1321' }}
      >
        <div className="px-4 py-3 border-b border-[#1A2E48]">
          <h3 className="text-sm font-semibold text-[#E2EEFF]">Team</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-[#1A2E48]/50">
          {TEAM_MEMBERS.map(member => (
            <div key={member.id} className="flex flex-col items-center gap-2 p-4 hover:bg-[#111C2E] transition-colors cursor-pointer">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: member.color }}
                >
                  {member.initials}
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0D1321]"
                  style={{ background: STATUS_DOT[member.status] }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#E2EEFF] truncate">{member.name.split(' ')[0]}</p>
                <p className="text-[10px] text-[#4D6280] capitalize">{member.status}</p>
              </div>
              {member.linesWritten !== undefined && member.linesWritten > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-[#10B981]">
                  <TrendingUp size={9} />
                  <span>{member.linesWritten} lines</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
