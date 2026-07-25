"use client";

import { motion } from 'framer-motion';
import { Database, FileText, CreditCard, Calendar, Shield, Network, LineChart, Code2, UserCircle, MessageSquare, ListTodo, Activity, Smartphone, Monitor, Globe, Box } from 'lucide-react';

const features = [
  { icon: Database, name: "Company Memory", desc: "A unified knowledge graph of everything that happens." },
  { icon: FileText, name: "Executive Briefings", desc: "Automated daily summaries tailored to your focus." },
  { icon: CreditCard, name: "Billing & Runway", desc: "Real-time burn rate monitoring and projections." },
  { icon: Calendar, name: "Intelligent Scheduling", desc: "Context-aware calendar orchestration." },
  { icon: Shield, name: "Enterprise Security", desc: "End-to-end encryption and audit logging." },
  { icon: Network, name: "Knowledge Graph", desc: "Connecting entities, decisions, and outcomes natively." },
  { icon: LineChart, name: "Market Intelligence", desc: "Continuous competitor and market signal tracking." },
  { icon: Code2, name: "HackBox", desc: "Sandboxed environment for engineering experiments." },
  { icon: UserCircle, name: "Founder Profile", desc: "Deep context modeling of your intent and style." },
  { icon: MessageSquare, name: "Bounce Box", desc: "Triage and escalate high-value feedback." },
  { icon: ListTodo, name: "Daily Plans", desc: "Synthesized execution paths generated overnight." },
  { icon: Activity, name: "Event Bus", desc: "High-throughput message routing across departments." },
  { icon: Smartphone, name: "Mobile First", desc: "Native iOS and Android clients for execution anywhere." },
  { icon: Monitor, name: "Desktop Apps", desc: "Persistent command center for Mac and Windows." },
  { icon: Globe, name: "Web Interface", desc: "Deep-dive analytical views in the browser." },
  { icon: Box, name: "API Access", desc: "Connect your existing tools to the central nervous system." }
];

export default function Features() {
  return (
    <section className="py-32 relative bg-background">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Everything your company <br className="hidden md:block" /> needs to operate at scale.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.03] transition-colors group"
            >
              <feat.icon className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">{feat.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
