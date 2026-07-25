"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "What is Project Grayscale?",
    a: "Project Grayscale is an AI Company Operating System. Rather than a set of disjointed tools, it acts as a central nervous system for your company, deploying an AI Executive Team to help you strategize, coordinate, and execute across all departments."
  },
  {
    q: "Who is this for?",
    a: "It is built exclusively for founders, CEOs, and executive leaders who are overwhelmed by context-switching, operational chaos, and the sheer volume of decisions required to scale a company."
  },
  {
    q: "Is my data private?",
    a: "Yes. Grayscale is built on a strict local-first architecture. Your company data is E2E encrypted, and we explicitly do not use your private data to train our global AI models. We offer zero-knowledge, self-hosted backend options for enterprise teams."
  },
  {
    q: "How is this different from ChatGPT or Notion AI?",
    a: "ChatGPT is a stateless conversational agent. Notion AI helps you write documents. Grayscale is an autonomous executing layer. It remembers past decisions, proactively plans, orchestrates APIs, and coordinates distinct 'AI Executives' that handle specific domain logic (Finance, Marketing, Engineering) without prompting."
  },
  {
    q: "What does 'AI Executive Team' mean in practice?",
    a: "Instead of a single AI assistant, Grayscale segments logic into personas. 'Ledger' monitors your runway via Stripe/Plaid and flags anomalies. 'Athena' reviews your calendar and drafts strategic priorities. They communicate with each other and surface only the finalized decisions to you for approval."
  },
  {
    q: "When can I get access?",
    a: "We are currently in a highly restricted Private Beta. We are onboarding new companies on a rolling basis. Join the waitlist to secure your place in line."
  },
  {
    q: "Is this a subscription service?",
    a: "Yes. Given the immense compute requirements for persistent, background-running AI models, Grayscale will be offered as a premium SaaS tier based on company scale and compute usage."
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data is yours. You can export your entire Company Memory knowledge graph in standard formats (JSON, Markdown) at any time. We hard-delete all your data from our servers within 30 days of cancellation."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 relative bg-background">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Everything you need to know.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`border border-white/10 rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-white/[0.04]' : 'bg-transparent hover:bg-white/[0.02]'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
