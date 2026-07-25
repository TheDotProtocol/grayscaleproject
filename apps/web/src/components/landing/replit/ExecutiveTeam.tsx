"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

const executives = [
  {
    name: "Athena",
    role: "Chief Strategy Officer",
    color: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
    desc: "Orchestrates high-level company strategy, quarterly planning, and goal alignment across all departments."
  },
  {
    name: "Atlas",
    role: "Chief of Staff",
    color: "from-indigo-500 to-purple-500",
    shadow: "shadow-purple-500/20",
    desc: "Coordinates execution across the executive team, tracks projects, and ensures nothing falls through the cracks."
  },
  {
    name: "Ledger",
    role: "Chief Financial Officer",
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
    desc: "Manages budgets, burn rate, forecasting, and financial health of the company."
  },
  {
    name: "Mercury",
    role: "Chief Marketing Officer",
    color: "from-orange-500 to-red-500",
    shadow: "shadow-orange-500/20",
    desc: "Leads brand strategy, content, growth experiments, and market positioning."
  },
  {
    name: "Nova",
    role: "Chief Product Officer",
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/20",
    desc: "Drives product roadmap, feature prioritization, and user experience decisions."
  },
  {
    name: "HackBox",
    role: "Chief Technology Officer",
    color: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/20",
    desc: "Oversees technical architecture, engineering decisions, and security posture."
  },
  {
    name: "Market Intel",
    role: "VP of Research",
    color: "from-violet-500 to-fuchsia-500",
    shadow: "shadow-violet-500/20",
    desc: "Continuous competitive monitoring, market signals, and opportunity detection."
  },
  {
    name: "Bounce Box",
    role: "Head of Customer Success",
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
    desc: "Manages customer feedback loops, retention signals, and escalation routing."
  }
];

export default function ExecutiveTeam() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-32 relative bg-[#080810]" id="team">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20 md:w-2/3"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Meet Your <br className="hidden md:block" /> Executive Team.
          </h2>
          <p className="text-xl text-slate-400 font-light">
            Eight world-class AI executives, each a master of their domain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {executives.map((exec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative cursor-pointer group"
            >
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${exec.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} 
              />
              
              <div className={`h-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300 ${hoveredIndex === i ? 'border-white/20 scale-[1.02] ' + exec.shadow : ''}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exec.color} mb-6 flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {exec.name.charAt(0)}
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-1">{exec.name}</h3>
                <p className="text-sm font-medium text-slate-400 mb-4">{exec.role}</p>
                
                <p className={`text-sm text-slate-500 leading-relaxed transition-all duration-300 ${hoveredIndex === i ? 'text-slate-300' : ''}`}>
                  {exec.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
