"use client";

import { motion } from 'framer-motion';
import { Lock, HardDrive, ShieldCheck, EyeOff, Cpu, Server } from 'lucide-react';

export default function Privacy() {
  return (
    <section className="py-32 relative bg-[#080810] overflow-hidden border-y border-white/5" id="whitepaper">
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] opacity-50" />

      {/* Tau Core glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Tau Core banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="relative rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-slate-900/40 to-purple-950/40 backdrop-blur-xl p-10 overflow-hidden">
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 relative z-10">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">Powered by</span>
                  <div className="h-px flex-1 max-w-[40px] bg-blue-500/30" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
                  Tau Core <span className="text-slate-500 font-light">·</span> <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Tau OS</span>
                </h3>
                <p className="text-slate-400 text-lg font-light max-w-2xl leading-relaxed">
                  The infrastructure layer beneath Project Grayscale. Tau Core is a privacy-first computation engine — all AI reasoning, memory, and orchestration runs locally on your infrastructure. Tau OS coordinates it seamlessly. Your data never leaves your control by default.
                </p>
              </div>
              <div className="flex-shrink-0 hidden lg:flex flex-col gap-2 text-right">
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Local-first
                </div>
                <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Privacy-native
                </div>
                <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
                  Zero training
                </div>
              </div>
            </div>

            {/* Architecture line diagram */}
            <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-0 overflow-x-auto pb-1">
                {[
                  { label: 'Your Device', sub: 'Tau Core runtime', icon: <HardDrive className="w-4 h-4" />, color: 'blue' },
                  { label: 'Tau OS', sub: 'Orchestration layer', icon: <Cpu className="w-4 h-4" />, color: 'indigo' },
                  { label: 'AI Executives', sub: 'Local inference', icon: <Server className="w-4 h-4" />, color: 'purple' },
                  { label: 'Company Memory', sub: 'Encrypted store', icon: <Lock className="w-4 h-4" />, color: 'violet' },
                  { label: 'Cloud Sync', sub: 'Optional only', icon: <ShieldCheck className="w-4 h-4" />, color: 'slate' },
                ].map((node, i) => (
                  <div key={node.label} className="flex items-center gap-0 flex-shrink-0">
                    <div className={`flex flex-col items-center gap-2 px-5 py-3 rounded-xl border ${
                      node.color === 'slate'
                        ? 'bg-white/[0.02] border-white/10 opacity-40'
                        : 'bg-white/[0.03] border-white/10'
                    }`}>
                      <span className={`${
                        node.color === 'blue' ? 'text-blue-400' :
                        node.color === 'indigo' ? 'text-indigo-400' :
                        node.color === 'purple' ? 'text-purple-400' :
                        node.color === 'violet' ? 'text-violet-400' :
                        'text-slate-500'
                      }`}>{node.icon}</span>
                      <span className="text-white text-xs font-semibold whitespace-nowrap">{node.label}</span>
                      <span className="text-slate-500 text-[10px] whitespace-nowrap">{node.sub}</span>
                    </div>
                    {i < 4 && (
                      <div className={`flex items-center gap-0.5 px-1 ${i === 3 ? 'opacity-30' : ''}`}>
                        <div className="h-px w-6 bg-gradient-to-r from-blue-500/50 to-purple-500/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                        <div className="h-px w-6 bg-gradient-to-r from-purple-500/50 to-blue-500/20" />
                      </div>
                    )}
                  </div>
                ))}
                {/* Optional label */}
                <div className="ml-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium border border-slate-700/50 rounded px-2 py-0.5">
                    Optional
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300 mb-8">
              <Lock className="w-4 h-4 text-blue-400" /> Your data. Your rules.
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-8">
              Privacy isn't a feature. <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">It's the foundation.</span>
            </h2>
            <p className="text-xl text-slate-400 font-light leading-relaxed mb-8">
              Tau Core processes everything locally by default. Unlike cloud-only AI products that route your intellectual property through shared infrastructure, Grayscale is engineered so your most sensitive company decisions stay on your hardware.
            </p>
            <p className="text-slate-500 leading-relaxed max-w-md">
              Cloud sync is available — and always optional. You hold the keys.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
                <HardDrive className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-lg font-medium text-white mb-2">Local-first default</h3>
                <p className="text-sm text-slate-400">Tau Core runs on your device. Data lives with you first. Cloud sync is strictly optional.</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md mt-0 sm:mt-8">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mb-6" />
                <h3 className="text-lg font-medium text-white mb-2">E2E Encrypted</h3>
                <p className="text-sm text-slate-400">When you do sync, Tau OS encrypts everything in transit and at rest. Always.</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
                <EyeOff className="w-8 h-8 text-purple-400 mb-6" />
                <h3 className="text-lg font-medium text-white mb-2">Zero Training</h3>
                <p className="text-sm text-slate-400">Your private company data is never used to train global AI models. This is contractual, not a setting.</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md mt-0 sm:mt-8">
                <Lock className="w-8 h-8 text-amber-400 mb-6" />
                <h3 className="text-lg font-medium text-white mb-2">Zero-knowledge</h3>
                <p className="text-sm text-slate-400">Self-hosted Tau Core deployment available for enterprise-grade isolation and compliance.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
