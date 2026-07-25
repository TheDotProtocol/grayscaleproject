"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

const phases = [
  {
    num: "01",
    title: "Founder Memory",
    desc: "Your AI learns who you are, how you think, and what matters to you. It ingests your past decisions, emails, and notes to build a model of your executive intent.",
    status: "Active"
  },
  {
    num: "02",
    title: "Founder OS",
    desc: "Your calendar, priorities, and decisions become coordinated and intentional. Athena acts as your personal Chief of Staff, guarding your time and focus.",
    status: "Active"
  },
  {
    num: "03",
    title: "Company OS",
    desc: "Your entire company runs through a unified operating layer with memory and intelligence. Departments interconnect. Context is never lost.",
    status: "In Progress"
  },
  {
    num: "04",
    title: "Autonomous Company",
    desc: "Your AI executive team runs departments, surfaces decisions, and executes plans autonomously based on your high-level strategy.",
    status: "Upcoming"
  }
];

export default function FourPhases() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section className="py-32 relative bg-[#080810]">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Your journey to an <br className="hidden md:block" /> autonomous company.
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Timeline / Nav */}
          <div className="lg:w-1/3 flex flex-col gap-4 border-l border-white/10 pl-6">
            {phases.map((phase, i) => (
              <button
                key={i}
                onClick={() => setActivePhase(i)}
                className="text-left relative py-4 group"
              >
                <div className={`absolute -left-[25px] top-1/2 -translate-y-1/2 w-[2px] h-0 bg-blue-500 transition-all duration-300 ${activePhase === i ? 'h-full' : 'group-hover:h-1/2 bg-white/20'}`} />
                <div className={`text-sm font-mono tracking-widest mb-1 transition-colors ${activePhase === i ? 'text-blue-400' : 'text-slate-600'}`}>
                  PHASE {phase.num}
                </div>
                <div className={`text-xl font-medium transition-colors ${activePhase === i ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {phase.title}
                </div>
              </button>
            ))}
          </div>

          {/* Active Content */}
          <div className="lg:w-2/3">
            <div className="relative aspect-video lg:aspect-auto lg:h-[400px] w-full rounded-3xl bg-white/[0.02] border border-white/5 p-8 md:p-12 overflow-hidden flex flex-col justify-between">
              {/* Abstract decorative background per phase */}
              <motion.div 
                key={`bg-${activePhase}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute right-0 top-0 w-2/3 h-full opacity-20 pointer-events-none"
              >
                {activePhase === 0 && <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent blur-2xl" />}
                {activePhase === 1 && <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600 via-transparent to-transparent blur-2xl" />}
                {activePhase === 2 && <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600 via-transparent to-transparent blur-2xl" />}
                {activePhase === 3 && <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-600 via-transparent to-transparent blur-2xl" />}
              </motion.div>

              <motion.div
                key={`content-${activePhase}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 h-full flex flex-col justify-end"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-6">
                    {phases[activePhase].status === 'Active' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                    {phases[activePhase].status === 'In Progress' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    {phases[activePhase].status === 'Upcoming' && <div className="w-2 h-2 rounded-full bg-slate-500" />}
                    {phases[activePhase].status}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    {phases[activePhase].title}
                  </h3>
                  <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl">
                    {phases[activePhase].desc}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
