"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { GrayscaleLogo } from "../grayscale-logo";

interface NavbarProps {
  onWaitlistClick?: () => void;
}

export default function Navbar({ onWaitlistClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(10, 10, 15, 0)", "rgba(10, 10, 15, 0.8)"],
  );

  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"],
  );

  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(255, 255, 255, 0)", "1px solid rgba(255, 255, 255, 0.05)"],
  );

  return (
    <motion.nav
      style={{ backgroundColor, backdropFilter: backdropBlur, borderBottom }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <GrayscaleLogo variant="nav" />

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#team" className="hover:text-white transition-colors">Team</a>
          <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
          <a href="#whitepaper" className="hover:text-white transition-colors">Whitepaper</a>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={onWaitlistClick}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Join Waitlist
          </button>
          <Link
            href="/experience"
            className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
          >
            Experience Grayscale
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white">
            Sign in
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-[#0A0A0F] border-b border-white/10 px-6 py-6 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4 text-sm font-medium text-slate-300">
            <a href="#product" className="hover:text-white" onClick={() => setIsOpen(false)}>Product</a>
            <a href="#team" className="hover:text-white" onClick={() => setIsOpen(false)}>Team</a>
            <a href="#roadmap" className="hover:text-white" onClick={() => setIsOpen(false)}>Roadmap</a>
            <a href="#whitepaper" className="hover:text-white" onClick={() => setIsOpen(false)}>Whitepaper</a>
          </div>
          <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => { onWaitlistClick?.(); setIsOpen(false); }}
              className="w-full text-left text-sm font-medium text-slate-300 hover:text-white"
            >
              Join Waitlist
            </button>
            <Link
              href="/experience"
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-full transition-all"
            >
              Experience Grayscale
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
