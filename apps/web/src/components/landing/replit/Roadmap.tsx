"use client";

import { motion } from 'framer-motion';

const milestones = [
  {
    status: "past",
    date: "Q1 2024",
    title: "Internal Alpha",
    desc: "Core memory architecture and the foundational executive team logic established."
  },
  {
    status: "active",
    date: "Now",
    title: "Private Beta",
    desc: "Founder OS deployed to select early-access users. Tuning intent recognition."
  },
  {
    status: "future",
    date: "Q3 2024",
    title: "Public Beta",
    desc: "Full company OS rollout. Departmental coordination and API integrations open."
  },
  {
    status: "future",
    date: "Q4 2024",
    title: "Enterprise",
    desc: "Tau Core and Dot Protocol Enterprise launch for massive scale organizations."
  }
];

export default function Roadmap() {
  return (
    <section className="py-32 relative bg-background" id="roadmap">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Where we're going.
          </h2>
        </motion.div>

        <div className="relative">
          {/* Horizontal Line for Desktop */}
          <div className="hidden md:block absolute top-[28px] left-0 right-0 h-px bg-white/10" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative"
              >
                {/* Node marker */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-background relative z-10 mb-8 
                  ${m.status === 'past' ? 'bg-slate-700 text-slate-400' : 
                    m.status === 'active' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 
                    'bg-[#0A0A0F] border border-white/20'}`}
                >
                  {m.status === 'active' && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-blue-500/30" />
                  )}
                  <span className="text-sm font-bold">{i + 1}</span>
                </div>

                <div className="pr-6">
                  <div className={`text-sm font-mono tracking-wider mb-2 ${m.status === 'active' ? 'text-blue-400' : 'text-slate-500'}`}>
                    {m.date}
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${m.status === 'future' ? 'text-slate-400' : 'text-white'}`}>
                    {m.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
