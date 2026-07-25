"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, TrendingUp, TrendingDown, CheckCircle2, Clock,
  AlertCircle, Brain, Zap, Lock, Sparkles, Activity,
  ChevronRight, Circle, Target, Layers
} from 'lucide-react';
import { useWaitlist } from "@/hooks/use-waitlist";

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ data, color, height = 36 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const area = `M${pts[0]} ` + pts.slice(1).map(p => `L${p}`).join(' ') + ` L${w},${h} L0,${h} Z`;
  const line = `M${pts[0]} ` + pts.slice(1).map(p => `L${p}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color})`} />
      <path d={line} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Circular gauge ───────────────────────────────────────────────────────────
function CompanyScoreGauge({ score }: { score: number }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const arc = (score / 100) * circ * 0.75;
  const offset = circ * 0.125;
  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-[135deg]">
        <circle cx="56" cy="56" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none"
          strokeDasharray={`${circ * 0.75} ${circ}`} strokeDashoffset={-offset} strokeLinecap="round" />
        <circle cx="56" cy="56" r={r} stroke="url(#gauge-grad)" strokeWidth="8" fill="none"
          strokeDasharray={`${arc} ${circ}`} strokeDashoffset={-offset} strokeLinecap="round" />
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white leading-none">{score}</span>
        <span className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm opacity-80"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.5 }}
        />
      ))}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const EXECUTIVES = [
  { name: 'Athena', role: 'CSO', color: '#3B82F6', bg: 'from-blue-500/30 to-blue-700/10', border: 'border-blue-500/40', dot: 'bg-blue-400', status: 'active', initials: 'AT' },
  { name: 'Ledger', role: 'CFO', color: '#10B981', bg: 'from-emerald-500/30 to-emerald-700/10', border: 'border-emerald-500/40', dot: 'bg-emerald-400', status: 'active', initials: 'LD' },
  { name: 'Mercury', role: 'CMO', color: '#8B5CF6', bg: 'from-violet-500/30 to-violet-700/10', border: 'border-violet-500/40', dot: 'bg-violet-400', status: 'active', initials: 'MC' },
  { name: 'Nova', role: 'CPO', color: '#F59E0B', bg: 'from-amber-500/30 to-amber-700/10', border: 'border-amber-500/40', dot: 'bg-amber-400', status: 'thinking', initials: 'NV' },
  { name: 'Atlas', role: 'CoS', color: '#06B6D4', bg: 'from-cyan-500/30 to-cyan-700/10', border: 'border-cyan-500/40', dot: 'bg-cyan-400', status: 'idle', initials: 'AL' },
  { name: 'HackBox', role: 'CTO', color: '#F43F5E', bg: 'from-rose-500/30 to-rose-700/10', border: 'border-rose-500/40', dot: 'bg-rose-400', status: 'active', initials: 'HB' },
];

const BRIEFINGS = [
  { exec: EXECUTIVES[0], priority: 'critical', tag: 'Strategy', time: '7:42 AM', message: 'Q3 enterprise pivot is tracking ahead of schedule. Accelerate outbound by 2 weeks — pipeline signals are strong.' },
  { exec: EXECUTIVES[1], priority: 'good', tag: 'Finance', time: '7:51 AM', message: 'Burn rate down 12% MoM. Runway extended to 18.4 months. Series A positioning looks strong at this trajectory.' },
  { exec: EXECUTIVES[2], priority: 'action', tag: 'Marketing', time: '8:03 AM', message: 'Launch post hit 2.4k impressions. LinkedIn 3x above baseline. Recommend follow-up content by Thursday to sustain momentum.' },
  { exec: EXECUTIVES[3], priority: 'action', tag: 'Product', time: '8:17 AM', message: '3 enterprise feature requests overlap roadmap items — recommend reprioritising sprint 14 before kick-off today.' },
];

const METRICS = [
  { label: 'MRR', value: '$84.2K', change: '+18%', up: true, spark: [42, 45, 41, 50, 55, 58, 62, 68, 72, 80, 84], color: '#10B981' },
  { label: 'Runway', value: '18.4 mo', change: '+2.1mo', up: true, spark: [12, 13, 14, 14, 15, 15, 16, 17, 17, 18, 18], color: '#3B82F6' },
  { label: 'Pipeline', value: '$2.1M', change: '+34%', up: true, spark: [80, 90, 75, 100, 110, 120, 130, 145, 155, 175, 210], color: '#8B5CF6' },
  { label: 'NPS', value: '72', change: '+8pts', up: true, spark: [55, 58, 56, 60, 62, 63, 65, 68, 69, 71, 72], color: '#F59E0B' },
];

const DAILY_TASKS = [
  { time: '9:00', label: 'Investor sync', sub: 'Athena prepared deck', done: true, color: '#3B82F6' },
  { time: '10:30', label: 'Q4 forecast review', sub: 'Ledger financial model ready', done: false, color: '#10B981' },
  { time: '12:00', label: 'Approve case study', sub: 'Mercury — enterprise draft', done: false, color: '#8B5CF6' },
  { time: '14:00', label: 'Sprint 14 kick-off', sub: 'Nova + engineering team', done: false, color: '#F59E0B' },
  { time: '16:00', label: 'Exec team debrief', sub: 'Atlas coordinating', done: false, color: '#06B6D4' },
];

const MEMORY_ITEMS = [
  { label: 'Enterprise pivot decision', date: 'May 14', color: '#3B82F6', icon: Target },
  { label: 'CTO search paused — Series A focus', date: 'May 9', color: '#F59E0B', icon: Circle },
  { label: 'PMF signal from 3 pilots', date: 'Apr 28', color: '#10B981', icon: Sparkles },
  { label: 'Pricing model locked at $299/seat', date: 'Apr 21', color: '#8B5CF6', icon: Layers },
];

const ACTIVITY = [28, 42, 18, 55, 70, 35, 48, 62, 30, 75, 50, 88, 40, 65, 22, 80, 55, 92, 48, 38, 70, 85, 60, 44, 78, 52, 90, 68];

const priorityConfig: Record<string, { label: string; cls: string; dot: string }> = {
  critical: { label: 'Critical', cls: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' },
  action:   { label: 'Action',   cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  good:     { label: 'Good',     cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function FounderDashboard() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { mutate, isPending } = useWaitlist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setErrorMsg('');
    mutate(
      { data: { email: email.trim() } },
      {
        onSuccess: () => { setSubmitted(true); setErrorMsg(''); },
        onError: () => { setErrorMsg('Something went wrong. Try again.'); },
      },
    );
  };

  return (
    <section className="py-32 relative overflow-hidden" style={{ background: '#050507' }}>
      {/* Ambient atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-blue-600/8 blur-[180px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-purple-600/8 blur-[160px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 uppercase tracking-[0.2em] text-[11px] font-bold">Your Command Center</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">
            See what your mornings<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">could look like.</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Every day starts with a full executive briefing — prepared while you slept.
          </p>
        </motion.div>

        {/* Dashboard shell */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 40px 80px -20px rgba(0,0,0,0.8), 0 0 80px rgba(59,130,246,0.06)' }}
        >
          {/* ── Blurred dashboard ─────────────────────────────────────────── */}
          <div className="select-none" style={{ filter: 'blur(2.5px)', pointerEvents: 'none' }}>

            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#0D0D14] border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                <div className="ml-4 flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.07]">
                  <div className="w-2 h-2 rounded-full bg-emerald-400/70" />
                  <span className="text-slate-500 text-xs font-mono tracking-wide">app.grayscale.ai/command</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Brain className="w-3.5 h-3.5 text-blue-400" />
                  <span>6 executives active</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">F</div>
              </div>
            </div>

            {/* Main layout */}
            <div className="flex" style={{ background: '#0A0A12', minHeight: 620 }}>

              {/* Sidebar */}
              <div className="w-48 flex-shrink-0 border-r border-white/[0.05] flex flex-col py-4 px-3 gap-0.5 hidden lg:flex">
                <div className="px-2 py-1 mb-2">
                  <span className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Workspace</span>
                </div>
                {['Command', 'Briefings', 'Planning', 'Memory', 'Finance', 'Market', 'Settings'].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    i === 0
                      ? 'bg-blue-600/20 text-blue-300 font-medium'
                      : 'text-slate-500'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-transparent'}`} />
                    {item}
                    {i === 1 && <div className="ml-auto text-[10px] bg-red-500/20 text-red-400 rounded-full px-1.5 py-0.5 font-bold">4</div>}
                  </div>
                ))}
                <div className="mt-auto pt-4 border-t border-white/[0.05] px-2">
                  <div className="text-[10px] text-slate-600 mb-2 uppercase tracking-widest">Tau Core</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    </div>
                    <span className="text-[10px] text-slate-500">72%</span>
                  </div>
                </div>
              </div>

              {/* Center column */}
              <div className="flex-1 min-w-0 p-5 flex flex-col gap-5 overflow-hidden">

                {/* Greeting + score row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Monday, July 25 · 8:22 AM</div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Good morning, Founder.</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Your executive team has 4 briefings waiting.</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-4">
                    <CompanyScoreGauge score={84} />
                    <div className="hidden xl:block">
                      <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Company Health</div>
                      {['Strategy', 'Finance', 'Growth', 'Product'].map((label, i) => {
                        const vals = [88, 92, 76, 84];
                        const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
                        return (
                          <div key={label} className="flex items-center gap-2 mb-1.5">
                            <span className="text-slate-600 text-[10px] w-14">{label}</span>
                            <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${vals[i]}%`, background: colors[i] }} />
                            </div>
                            <span className="text-[10px] text-slate-500">{vals[i]}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* KPI strip */}
                <div className="grid grid-cols-4 gap-3">
                  {METRICS.map((m) => (
                    <div key={m.label} className="p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.025] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at top right, ${m.color}18, transparent 70%)` }} />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">{m.label}</span>
                          <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>
                            {m.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                            {m.change}
                          </div>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">{m.value}</div>
                        <Sparkline data={m.spark} color={m.color} height={32} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Executive team row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-slate-600 text-[11px] uppercase tracking-wider font-medium">Executive Team</span>
                  {EXECUTIVES.map((ex) => (
                    <div key={ex.name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border bg-white/[0.025]" style={{ borderColor: ex.color + '35' }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: ex.color + '40', border: `1px solid ${ex.color}60` }}>
                        {ex.initials}
                      </div>
                      <span className="text-[11px] font-medium text-slate-300">{ex.name}</span>
                      <span className="text-[9px] text-slate-600">{ex.role}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${ex.dot} ${ex.status === 'thinking' ? 'animate-pulse' : ''}`} />
                    </div>
                  ))}
                </div>

                {/* Briefings */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-semibold">Morning Briefings</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Activity className="w-3 h-3" />
                      <span>All executives reported in</span>
                    </div>
                  </div>
                  {BRIEFINGS.map((b) => {
                    const p = priorityConfig[b.priority];
                    return (
                      <div key={b.exec.name} className="flex gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: b.exec.color }} />
                        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold text-white border" style={{ background: b.exec.color + '25', borderColor: b.exec.color + '40' }}>
                          {b.exec.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-white text-sm font-semibold">{b.exec.name}</span>
                            <span className="text-slate-600 text-xs">{b.exec.role}</span>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.cls}`}>
                              <div className={`w-1 h-1 rounded-full ${p.dot}`} />
                              {b.tag}
                            </span>
                            <span className="ml-auto text-slate-600 text-[11px] font-mono">{b.time}</span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{b.message}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-700 flex-shrink-0 self-center" />
                      </div>
                    );
                  })}
                </div>

                {/* Activity chart */}
                <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.015]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-xs font-semibold">Executive Activity — Last 28 days</span>
                    <span className="text-slate-600 text-[10px]">248 actions logged</span>
                  </div>
                  <div className="flex items-end gap-1 h-10">
                    {ACTIVITY.map((v, i) => (
                      <div key={i} className="flex-1 rounded-sm" style={{
                        height: `${(v / 92) * 100}%`,
                        background: `linear-gradient(to top, #3B82F6${Math.round(40 + (v / 92) * 160).toString(16).padStart(2,'0')}, #8B5CF6${Math.round(20 + (v / 92) * 100).toString(16).padStart(2,'0')})`
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="w-64 flex-shrink-0 border-l border-white/[0.05] flex flex-col p-4 gap-4 hidden xl:flex">

                {/* Today's plan */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-xs font-semibold">Today's Plan</span>
                    <span className="text-slate-600 text-[10px]">1/5 done</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {DAILY_TASKS.map((t, i) => (
                      <div key={i} className={`flex gap-3 p-2.5 rounded-lg ${t.done ? 'opacity-50' : ''}`} style={{ background: t.done ? 'transparent' : 'rgba(255,255,255,0.02)', border: `1px solid ${t.done ? 'transparent' : 'rgba(255,255,255,0.05)'}` }}>
                        <div className="flex-shrink-0 mt-0.5">
                          {t.done
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            : <div className="w-3.5 h-3.5 rounded-full border-2 border-white/10" />
                          }
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
                            <span className="text-slate-300 text-[11px] font-medium truncate">{t.label}</span>
                          </div>
                          <span className="text-slate-600 text-[10px]">{t.time} · {t.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/[0.05]" />

                {/* Company memory */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-white text-xs font-semibold">Company Memory</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {MEMORY_ITEMS.map((m, i) => {
                      const Icon = m.icon;
                      return (
                        <div key={i} className="flex gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                          <div className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center" style={{ background: m.color + '20' }}>
                            <Icon className="w-3 h-3" style={{ color: m.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-300 text-[11px] leading-snug line-clamp-2">{m.label}</p>
                            <span className="text-slate-600 text-[10px]">{m.date}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/[0.05]" />

                {/* Pending decisions */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-white text-xs font-semibold">Awaiting Approval</span>
                    <div className="ml-auto text-[10px] bg-amber-500/20 text-amber-400 rounded-full px-1.5 font-bold">3</div>
                  </div>
                  {['Series A deck revision', 'Hire: Senior Engineer', 'New pricing tier'].map((d, i) => (
                    <div key={i} className="flex items-center gap-2 py-2 border-b border-white/[0.04] last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-slate-400 text-[11px]">{d}</span>
                      <ChevronRight className="w-3 h-3 text-slate-700 ml-auto flex-shrink-0" />
                    </div>
                  ))}
                </div>

                {/* Pulse bar */}
                <div className="mt-auto p-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-blue-300 text-[11px] font-semibold">Tau Core Active</span>
                  </div>
                  <div className="flex items-end gap-0.5 h-6">
                    <MiniBarChart data={[4, 7, 3, 9, 6, 8, 5, 10, 7, 9, 6, 8]} color="#3B82F6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Lock overlay ──────────────────────────────────────────────── */}
          <div className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: 'linear-gradient(to top, rgba(5,5,7,0.97) 0%, rgba(5,5,7,0.82) 45%, rgba(5,5,7,0.45) 75%, transparent 100%)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-center px-6 max-w-md w-full"
            >
              {/* Lock icon */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 backdrop-blur-md flex items-center justify-center">
                  <Lock className="w-6 h-6 text-slate-300" />
                </div>
                <div className="absolute -inset-2 rounded-3xl bg-blue-500/10 blur-xl -z-10" />
              </div>

              <h3 className="text-3xl font-bold text-white tracking-tight mb-2">
                Your command center awaits.
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                Join the waitlist. Be the first founder to wake up to a fully briefed executive team.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-emerald-300 text-sm font-semibold">You're on the list.</p>
                      <p className="text-slate-500 text-xs">We'll reach out when your spot opens.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@company.com"
                      required
                      className="w-full px-5 py-3.5 rounded-full bg-white/5 border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all text-sm"
                    />
                    {errorMsg && <p className="text-red-400 text-xs text-center">{errorMsg}</p>}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full px-6 py-3.5 rounded-full font-semibold text-sm text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 0 32px rgba(37,99,235,0.35)' }}
                    >
                      {isPending ? 'Saving your spot...' : (
                        <>
                          Request Early Access
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-slate-600 text-[11px] text-center">Powered by Tau Core · Privacy-first · No spam</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
