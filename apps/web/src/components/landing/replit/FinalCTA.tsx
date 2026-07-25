"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWaitlist } from "@/hooks/use-waitlist";

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { mutate, isPending } = useWaitlist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setErrorMsg('');
    mutate(
      { data: { email: email.trim() } },
      {
        onSuccess: () => {
          setSubmitted(true);
          setErrorMsg('');
        },
        onError: () => setErrorMsg('Something went wrong. Please try again.'),
      },
    );
  };

  return (
    <section className="py-40 relative bg-[#0A0A0F] overflow-hidden flex items-center justify-center border-t border-white/5">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-full h-[500px] bg-blue-600/10 blur-[150px] opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 leading-[1.1]">
            The future belongs to founders who move faster.
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-light mb-12 max-w-2xl mx-auto">
            Join the waitlist. Be among the first to run your company with an AI executive team.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 max-w-lg mx-auto"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-emerald-300 font-semibold">You're on the list.</p>
                  <p className="text-slate-400 text-sm">We'll reach out when your spot opens.</p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Founder's email address"
                  required
                  className="w-full sm:w-2/3 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-lg"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Saving...' : (
                    <>
                      Join Waitlist
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {errorMsg && (
            <p className="mt-4 text-red-400 text-sm">{errorMsg}</p>
          )}

          <p className="mt-6 text-sm text-slate-500 font-medium tracking-wide uppercase">
            Limited spots available for Q3 rollout
          </p>
        </motion.div>
      </div>
    </section>
  );
}
