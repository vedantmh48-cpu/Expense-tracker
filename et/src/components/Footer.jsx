import React from 'react';
import { Heart, Shield, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 bg-[#0F172A] text-[#FFFFFF] overflow-hidden">
      {/* Top gradient accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#4F46E5] via-[#3B82F6] to-[#10B981]" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] text-[#FFFFFF] flex items-center justify-center text-lg font-bold shadow-lg">
                ₹
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-[#FFFFFF]">
                  ₹upeeFlow
                </span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#4F46E5]/20 text-[#818CF8] border border-[#4F46E5]/30 font-bold">
                  India
                </span>
              </div>
            </div>
            <p className="text-sm text-[#F8FAFC]/80 max-w-md leading-relaxed">
              A modern, intelligent, and private personal cash flow & expense manager built specifically for Indian users.
              Track salary, SIP investments, UPI payments, and house rent with ease.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F8FAFC]/70 font-semibold">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Zero server tracking • 100% LocalStorage persistent</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]/60 mb-4">Quick Navigation</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '#dashboard', label: 'Dashboard Overview' },
                { href: '#analytics', label: 'Cash Flow Analytics' },
                { href: '#activity', label: 'Activity Feed' },
                { href: '#how-to-use', label: 'How to Use Guide' },
                { href: '#contact', label: 'Contact & Support' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#F8FAFC]/70 hover:text-[#818CF8] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#F8FAFC]/30 group-hover:bg-[#818CF8] transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Features */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]/60 mb-4">Connect With Us</h4>
            <p className="text-sm text-[#F8FAFC]/70 mb-4">Follow & connect on social channels:</p>

            <div className="flex items-center gap-3 mb-6">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow on Instagram"
                className="p-2.5 rounded-xl bg-[#F8FAFC]/10 border border-[#F8FAFC]/20 text-[#F8FAFC] hover:bg-[#4F46E5]/20 hover:border-[#4F46E5]/40 hover:text-[#818CF8] transition-all hover:scale-110 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Connect on LinkedIn"
                className="p-2.5 rounded-xl bg-[#F8FAFC]/10 border border-[#F8FAFC]/20 text-[#F8FAFC] hover:bg-[#4F46E5]/20 hover:border-[#4F46E5]/40 hover:text-[#818CF8] transition-all hover:scale-110 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                title="View repository on GitHub"
                className="p-2.5 rounded-xl bg-[#F8FAFC]/10 border border-[#F8FAFC]/20 text-[#F8FAFC] hover:bg-[#4F46E5]/20 hover:border-[#4F46E5]/40 hover:text-[#818CF8] transition-all hover:scale-110 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#F8FAFC]/10 text-[#F8FAFC]/70 border border-[#F8FAFC]/20">
                UPI Ready
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#F8FAFC]/10 text-[#F8FAFC]/70 border border-[#F8FAFC]/20">
                SIP Tracking
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#F8FAFC]/10 text-[#F8FAFC]/70 border border-[#F8FAFC]/20">
                INR Support
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#F8FAFC]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F8FAFC]/50 gap-2">
          <p>© {new Date().getFullYear()} ₹upeeFlow India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for Indian FinTech Users
            </p>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#F8FAFC]/10 hover:bg-[#4F46E5]/20 hover:text-[#818CF8] transition-all"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};