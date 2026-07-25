"use client";

import { motion } from 'framer-motion';
import { Settings2, BrainCircuit, LightbulbOff, BatteryWarning, Users, LayoutDashboard } from 'lucide-react';

const painPoints = [
  { icon: Settings2, label: "Chaos", desc: "Too many tools. Nothing connected." },
  { icon: BrainCircuit, label: "Context Switching", desc: "Your brain pays the tax every time." },
  { icon: LightbulbOff, label: "Lost Ideas", desc: "Your best thinking disappears by morning." },
  { icon: BatteryWarning, label: "Burnout", desc: "Running on fumes, making decisions that matter." },
  { icon: Users, label: "Hiring Costs", desc: "You need a team but can't afford the salaries." },
  { icon: LayoutDashboard, label: "Information Overload", desc: "You're drowning in data, starving for clarity." }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function FounderProblem() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Every founder knows this feeling.
          </h2>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {painPoints.map((point, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className="group relative"
            >
              <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-500 rounded-2xl blur-xl" />
              <div className="relative h-full p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 hover:bg-white/[0.04] transition-all duration-300 backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-red-500/10 group-hover:border-red-500/20 group-hover:text-red-400 transition-colors text-slate-400">
                  <point.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
                  {point.label}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
