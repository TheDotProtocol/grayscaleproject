"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { User, Cpu, Building2, CheckCircle2, Zap, Database } from 'lucide-react';
import { useRef } from 'react';

const steps = [
  { id: 1, icon: User, label: "Founder Input", desc: "You speak, type, or forward an email." },
  { id: 2, icon: Cpu, label: "Executive Orchestrator", desc: "Athena processes intent and breaks it into parallel tasks." },
  { id: 3, icon: Building2, label: "Department Routing", desc: "Tasks are routed to specialized AI executives." },
  { id: 4, icon: CheckCircle2, label: "Approval Gate", desc: "High-stakes decisions are surfaced for your final nod." },
  { id: 5, icon: Zap, label: "Autonomous Execution", desc: "APIs trigger, emails send, code deploys." },
  { id: 6, icon: Database, label: "Company Memory", desc: "The outcome is logged permanently to the knowledge graph." }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-32 relative bg-background overflow-hidden" id="product">
      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            One input. Infinite execution.
          </h2>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            The operating system maps your intent directly to organizational action. No manual delegation required.
          </p>
        </motion.div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/5 md:-translate-x-1/2" />
          
          {/* Animated Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 md:-translate-x-1/2 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />

          <div className="flex flex-col gap-16 relative">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              
              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`md:w-1/2 flex ${isEven ? 'md:justify-start' : 'md:justify-end'} pl-20 md:pl-0`}>
                    <div className={`glass-card p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md w-full max-w-sm hover:bg-white/[0.04] transition-colors group relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <h3 className="text-xl font-semibold text-white mb-2 relative z-10">{step.label}</h3>
                      <p className="text-slate-400 text-sm relative z-10">{step.desc}</p>
                    </div>
                  </div>

                  <div className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full bg-[#0A0A0F] border border-white/20 flex items-center justify-center md:-translate-x-1/2 -translate-x-6 z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] group">
                    <motion.div 
                      whileInView={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"
                    />
                    <step.icon className="w-5 h-5 text-slate-300 relative z-10" />
                  </div>
                  
                  <div className="md:w-1/2 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
