"use client";

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "For the first time in three years, I'm not the bottleneck in my own company. Athena drafted our Q3 strategy while I slept, and it was 90% ready to execute.",
    name: "Sarah Chen",
    role: "Founder & CEO, Nexus Data",
    initials: "SC",
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    quote: "I used to spend 15 hours a week just syncing context between engineering and marketing. Now, HackBox and Mercury handle it. It's like I hired a world-class executive team for a fraction of the cost.",
    name: "Marcus Wright",
    role: "Co-Founder, Synthetix",
    initials: "MW",
    color: "bg-purple-500/20 text-purple-400"
  },
  {
    quote: "The Company Memory feature alone changed how we operate. No more 'who said what in which Slack channel'. The system just knows. It's the most clarifying software I've ever used.",
    name: "Elena Rodriguez",
    role: "CEO, Vertex Health",
    initials: "ER",
    color: "bg-emerald-500/20 text-emerald-400"
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 relative bg-[#080810] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            What founders are saying.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col justify-between"
            >
              <div className="mb-8">
                <div className="text-blue-500 text-4xl font-serif mb-4 leading-none">"</div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {t.quote}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-medium text-white">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
