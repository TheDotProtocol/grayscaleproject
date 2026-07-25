"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Cpu } from "lucide-react";

interface HeroProps {
  onWaitlistClick?: () => void;
}

export default function Hero({ onWaitlistClick }: HeroProps) {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] opacity-40 translate-x-1/4 -translate-y-1/4" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik00MCAwaC00MHY0MGg0MFYweiIvPjwvZz48L3N2Zz4=')] opacity-50" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mb-8"
        >
          <div className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
            <span className="text-blue-400 uppercase tracking-[0.2em] text-[11px] font-bold">
              Introducing Project Grayscale
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[100px] leading-[1.05] font-bold text-white tracking-tighter mb-8"
        >
          Run Your Company Like You Already Have an{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            Executive Team.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
        >
          Project Grayscale gives founders an AI Executive Team that remembers everything, plans intelligently, coordinates departments, and helps companies execute faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onWaitlistClick}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full font-medium text-lg transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:scale-[1.02]"
          >
            Join the Waitlist
          </button>
          <Link
            href="/experience"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full font-medium text-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Play className="w-5 h-5 fill-white/80" />
            Experience Grayscale
          </Link>
        </motion.div>

        {/* Tau Core trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex items-center justify-center gap-2"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <Cpu className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="text-slate-500 text-xs font-medium">Powered by</span>
            <span className="text-slate-300 text-xs font-bold tracking-wide">Tau Core</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-300 text-xs font-bold tracking-wide">Tau OS</span>
            <span className="text-slate-700">·</span>
            <span className="text-emerald-500 text-xs font-semibold">Privacy-first</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
