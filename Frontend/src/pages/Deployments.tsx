import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, CheckCircle, XCircle, Clock, RotateCcw, ExternalLink,
  GitBranch, Server, Globe, Code2, RefreshCw, AlertTriangle,
} from 'lucide-react';
import { DEPLOYMENTS } from '../data/mockData';
import type { Deployment } from '../types';

const ENV_CONFIG = {
  production: { label: 'Production', color: '#10B981', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', icon: Globe },
  staging: { label: 'Staging', color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20', icon: Server },
  development: { label: 'Development', color: '#3B82F6', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/20', icon: Code2 },
};

const STATUS_CONFIG = {
  running: { label: 'Deploying', color: 'text-[#3B82F6]', icon: RefreshCw, animate: true },
  success: { label: 'Success', color: 'text-[#10B981]', icon: CheckCircle, animate: false },
  failed: { label: 'Failed', color: 'text-[#EF4444]', icon: XCircle, animate: false },
  pending: { label: 'Pending', color: 'text-[#F59E0B]', icon: Clock, animate: false },
  cancelled: { label: 'Cancelled', color: 'text-[#4D6280]', icon: XCircle, animate: false },
};

function DeploymentRow({ deployment, isActive }: { deployment: Deployment; isActive: boolean }) {
  const env = ENV_CONFIG[deployment.environment];
  const status = STATUS_CONFIG[deployment.status];
  const StatusIcon = status.icon;
  const EnvIcon = env.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-4 px-5 py-4 border-b border-[#1A2E48]/50 hover:bg-[#0F1829] transition-colors cursor-pointer ${isActive ? 'bg-[#0F1829]' : ''}`}
    >
      {/* Status */}
      <StatusIcon
        size={16}
        className={`${status.color} flex-shrink-0 ${status.animate ? 'animate-spin' : ''}`}
        style={status.animate ? { animationDuration: '2s' } : {}}
      />

      {/* Version & env */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#E2EEFF] font-mono">{deployment.version}</span>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${env.bg} ${env.border} border`} style={{ color: env.color }}>
            <EnvIcon size={9} />
            {env.label}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#4D6280]">
          <GitBranch size={9} />
          <span className="font-mono">{deployment.branch}</span>
          <span>·</span>
          <span className="font-mono">{deployment.commit}</span>
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 ml-4">
        <div
          className="w-5 h-5 rounded-full text-[8px] font-bold text-white flex items-center justify-center flex-shrink-0"
          style={{ background: deployment.author.color }}
        >
          {deployment.author.initials.charAt(0)}
        </div>
        <span className="text-xs text-[#8BA4C0]">{deployment.author.name.split(' ')[0]}</span>
      </div>

      <div className="ml-auto flex items-center gap-4 text-xs">
        <span className="text-[#4D6280]">{deployment.timestamp}</span>
        <span className="text-[#4D6280] w-16 text-right">{deployment.duration}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-[#4D6280] hover:text-[#8BA4C0] rounded hover:bg-[#162338] transition-colors">
            <RotateCcw size={12} />
          </button>
          {deployment.url && (
            <button className="p-1 text-[#4D6280] hover:text-[#3B82F6] rounded hover:bg-[#162338] transition-colors">
              <ExternalLink size={12} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EnvCard({ env, deploys }: { env: 'production' | 'staging' | 'development'; deploys: Deployment[] }) {
  const config = ENV_CONFIG[env];
  const EnvIcon = config.icon;
  const latest = deploys[0];
  const status = latest ? STATUS_CONFIG[latest.status] : null;

  return (
    <div className="rounded-xl border p-4" style={{ background: '#0D1321', borderColor: config.color + '30' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
            <EnvIcon size={15} style={{ color: config.color }} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#E2EEFF]">{config.label}</p>
            {latest?.url && <p className="text-[10px] text-[#4D6280]">{latest.url.replace('https://', '')}</p>}
          </div>
        </div>
        {status && (
          <div className={`flex items-center gap-1 text-[10px] font-medium ${status.color}`}>
            <status.icon size={11} className={status.animate ? 'animate-spin' : ''} style={{ animationDuration: '2s' }} />
            {status.label}
          </div>
        )}
      </div>

      {latest ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#4D6280]">Version</span>
            <span className="font-mono font-semibold text-[#E2EEFF]">{latest.version}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#4D6280]">Deployed</span>
            <span className="text-[#8BA4C0]">{latest.timestamp}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#4D6280]">Duration</span>
            <span className="text-[#8BA4C0]">{latest.duration}</span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-[#4D6280]">No deployments yet</p>
      )}

      {latest?.status === 'running' && (
        <div className="mt-3">
          <div className="h-1 bg-[#1A2E48] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: config.color }}
              animate={{ width: ['0%', '85%'] }}
              transition={{ duration: 2.5, ease: 'easeOut', repeat: Infinity, repeatType: 'loop' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function Deployments() {
  const [filter, setFilter] = useState<'all' | 'production' | 'staging' | 'development'>('all');
  const [activeDeployId, setActiveDeployId] = useState<string | null>(null);
  const [currentDeploy, setCurrentDeploy] = useState(DEPLOYMENTS);

  const filtered = filter === 'all' ? currentDeploy : currentDeploy.filter(d => d.environment === filter);

  const byEnv = (env: Deployment['environment']) => currentDeploy.filter(d => d.environment === env);

  const TABS = [
    { key: 'all', label: 'All' },
    { key: 'production', label: 'Production' },
    { key: 'staging', label: 'Staging' },
    { key: 'development', label: 'Dev' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1A2E48] flex-shrink-0" style={{ background: '#0D1321' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#E2EEFF]">Deployments</h2>
            <p className="text-xs text-[#4D6280] mt-0.5">Monitor and manage your deployments</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs bg-[#3B82F6] text-white px-3 py-1.5 rounded-lg hover:bg-[#2563EB] transition-colors font-medium">
            <Rocket size={12} />
            Deploy
          </button>
        </div>

        {/* Environment status cards */}
        <div className="grid grid-cols-3 gap-3">
          {(['production', 'staging', 'development'] as const).map(env => (
            <EnvCard key={env} env={env} deploys={byEnv(env)} />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-5 py-2 border-b border-[#1A2E48] flex-shrink-0" style={{ background: '#0A1222' }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === key ? 'bg-[#162338] text-[#E2EEFF]' : 'text-[#4D6280] hover:text-[#8BA4C0] hover:bg-[#111C2E]'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#4D6280]">{filtered.length} deployments</span>
      </div>

      {/* Deployment list */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#080C16' }}>
        {/* Table header */}
        <div className="flex items-center gap-4 px-5 py-2 border-b border-[#1A2E48]/50 text-[10px] uppercase tracking-widest text-[#4D6280] font-semibold" style={{ background: '#0A1222' }}>
          <span className="w-5" />
          <span className="flex-1">Version / Branch</span>
          <span>Author</span>
          <span className="ml-auto">Time</span>
          <span className="w-16 text-right">Duration</span>
          <span className="w-14 text-right">Actions</span>
        </div>

        {filtered.map((deploy, i) => (
          <DeploymentRow
            key={deploy.id}
            deployment={deploy}
            isActive={activeDeployId === deploy.id}
          />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Rocket size={32} className="text-[#1A2E48] mb-3" />
            <p className="text-sm text-[#4D6280]">No deployments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
