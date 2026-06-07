import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, GitCommit, GitPullRequest, Bug, Clock } from 'lucide-react';
import { CHART_DATA, TEAM_MEMBERS } from '../data/mockData';

const WEEKLY_DATA = [
  { week: 'W1', commits: 87, reviews: 24, bugs: 12 },
  { week: 'W2', commits: 124, reviews: 31, bugs: 8 },
  { week: 'W3', commits: 98, reviews: 28, bugs: 15 },
  { week: 'W4', commits: 156, reviews: 42, bugs: 6 },
  { week: 'W5', commits: 134, reviews: 38, bugs: 9 },
  { week: 'W6', commits: 189, reviews: 56, bugs: 4 },
  { week: 'W7', commits: 204, reviews: 61, bugs: 7 },
  { week: 'W8', commits: 167, reviews: 47, bugs: 11 },
];

const PIE_DATA = [
  { name: 'Features', value: 45, color: '#3B82F6' },
  { name: 'Bug Fixes', value: 28, color: '#EF4444' },
  { name: 'Refactor', value: 17, color: '#7C3AED' },
  { name: 'Chores', value: 10, color: '#4D6280' },
];

const TEAM_STATS = TEAM_MEMBERS.map((m, i) => ({
  ...m,
  commits: [234, 187, 142, 156, 89, 43][i] || 50,
  reviews: [34, 28, 42, 19, 12, 8][i] || 10,
  prs: [8, 6, 3, 5, 2, 1][i] || 2,
}));

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#243B55] p-3 text-xs shadow-xl" style={{ background: '#0D1321' }}>
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

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function Analytics() {
  const summaryStats = [
    { label: 'Total Commits', value: '1,259', change: '+18%', up: true, icon: GitCommit, color: '#3B82F6' },
    { label: 'PRs Merged', value: '89', change: '+12%', up: true, icon: GitPullRequest, color: '#7C3AED' },
    { label: 'Bugs Fixed', value: '72', change: '-23%', up: true, icon: Bug, color: '#10B981' },
    { label: 'Avg Review Time', value: '4.2h', change: '-0.8h', up: true, icon: Clock, color: '#F59E0B' },
  ];

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full">
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#E2EEFF]">Team Analytics</h1>
        <p className="text-sm text-[#4D6280] mt-0.5">Last 8 weeks · All members</p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {summaryStats.map(({ label, value, change, up, icon: Icon, color }) => (
          <motion.div
            key={label}
            variants={cardVariants}
            className="rounded-xl border border-[#1A2E48] p-4"
            style={{ background: '#0D1321' }}
          >
            <div className="flex items-start justify-between mb-2">
              <Icon size={16} style={{ color }} />
              <div className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {change}
              </div>
            </div>
            <p className="text-2xl font-bold text-[#E2EEFF]">{value}</p>
            <p className="text-xs text-[#4D6280] mt-0.5">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly commits area chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 rounded-xl border border-[#1A2E48] p-4"
          style={{ background: '#0D1321' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E2EEFF]">Weekly Contribution Trend</h3>
              <p className="text-xs text-[#4D6280] mt-0.5">Commits, reviews & bug fixes</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#4D6280]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3B82F6]" />Commits</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7C3AED]" />Reviews</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={WEEKLY_DATA} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="commits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1A2E48" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#4D6280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4D6280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="commits" stroke="#3B82F6" strokeWidth={2} fill="url(#commits)" dot={false} />
              <Area type="monotone" dataKey="reviews" stroke="#7C3AED" strokeWidth={2} fill="url(#reviews)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="rounded-xl border border-[#1A2E48] p-4"
          style={{ background: '#0D1321' }}
        >
          <h3 className="text-sm font-semibold text-[#E2EEFF] mb-1">Commit Types</h3>
          <p className="text-xs text-[#4D6280] mb-3">Distribution this month</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {PIE_DATA.map(({ name, value, color }) => (
              <div key={name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-[#8BA4C0] flex-1">{name}</span>
                <span className="font-medium text-[#E2EEFF]">{value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Team leaderboard */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="rounded-xl border border-[#1A2E48] overflow-hidden"
        style={{ background: '#0D1321' }}
      >
        <div className="px-4 py-3 border-b border-[#1A2E48]">
          <h3 className="text-sm font-semibold text-[#E2EEFF]">Contributor Leaderboard</h3>
          <p className="text-xs text-[#4D6280] mt-0.5">Last 8 weeks</p>
        </div>

        {/* Bar chart */}
        <div className="px-4 py-4">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={TEAM_STATS.slice(0, 5)} margin={{ top: 0, right: 4, left: -20, bottom: 0 }} barSize={20} barGap={4}>
              <CartesianGrid stroke="#1A2E48" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4D6280', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => v.split(' ')[0]}
              />
              <YAxis tick={{ fill: '#4D6280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="commits" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reviews" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="divide-y divide-[#1A2E48]/50">
          {TEAM_STATS.map((member, i) => (
            <div key={member.id} className="flex items-center gap-4 px-4 py-3">
              <span className="text-xs font-bold text-[#4D6280] w-5 text-center">{i + 1}</span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: member.color }}
              >
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#E2EEFF]">{member.name}</p>
                <p className="text-[10px] text-[#4D6280]">{member.role}</p>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div className="text-center">
                  <p className="font-bold text-[#E2EEFF]">{member.commits}</p>
                  <p className="text-[10px] text-[#4D6280]">commits</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#E2EEFF]">{member.reviews}</p>
                  <p className="text-[10px] text-[#4D6280]">reviews</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#E2EEFF]">{member.prs}</p>
                  <p className="text-[10px] text-[#4D6280]">PRs</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
