"use client";

import { Twitter, Linkedin, Github } from "lucide-react";
import { GrayscaleLogo } from "../grayscale-logo";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          <div className="col-span-1 md:col-span-1">
            <GrayscaleLogo variant="nav" href="/" />
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The AI Company Operating System.<br />
              Run your company like you already have an executive team.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Product</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500">
              <li><a href="#product" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#whitepaper" className="hover:text-white transition-colors">Whitepaper</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a></li>
              <li><span className="text-slate-600">Blog</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500">
              <li><span className="text-slate-600">About</span></li>
              <li><span className="text-slate-600">Investors</span></li>
              <li><span className="text-slate-600">Media Kit</span></li>
              <li><span className="text-slate-600">Careers</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500">
              <li><span className="text-slate-600">Privacy Policy</span></li>
              <li><span className="text-slate-600">Terms of Service</span></li>
              <li><span className="text-slate-600">Security</span></li>
              <li><span className="text-slate-600">Data Processing</span></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-slate-600">
          <p>© {new Date().getFullYear()} Project Grayscale Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span>San Francisco, CA</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>London, UK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
