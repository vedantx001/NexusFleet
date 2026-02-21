import React from 'react';
import { Command, LayoutDashboard, Truck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }) {
  // Decorative floating shapes variant
  const floatAnim = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0B1220] font-sans text-white selection:bg-(--brand-accent)/30 selection:text-(--brand-accent)">

      {/* LEFT PANEL - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between bg-[#0B1220] p-12 relative overflow-hidden border-r border-white/5">

        {/* Decorative Gradients & Floating Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-(--brand-accent)/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3B82F6]/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

        <motion.div variants={floatAnim} animate="animate" className="absolute top-1/4 right-1/4 w-24 h-24 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-3xl rotate-12 flex items-center justify-center pointer-events-none z-0 shadow-2xl">
          <LayoutDashboard className="w-8 h-8 text-white/20" />
        </motion.div>
        <motion.div variants={floatAnim} animate="animate" transition={{ delay: 2, duration: 12, repeat: Infinity }} className="absolute bottom-1/3 left-1/4 w-32 h-32 rounded-full border border-(--brand-accent)/10 bg-(--brand-accent)/5 backdrop-blur-3xl -rotate-6 flex items-center justify-center pointer-events-none z-0 shadow-2xl">
          <Zap className="w-10 h-10 text-(--brand-accent)/20" />
        </motion.div>

        {/* Brand Logo & Headline */}
        <div className="relative z-10 mt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-(--brand-accent) to-sky-500 shadow-lg shadow-(--brand-accent)/20">
              <Command size={24} className="text-[#0B1220]" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Fleet<span className="text-(--brand-accent)">Flow</span></span>
          </div>

          <div className="mt-24 space-y-6 max-w-lg">
            <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-white">
              Smarter Fleet <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-(--brand-accent) to-sky-300">Control Starts Here</span>
            </h1>
            <p className="text-lg text-gray-400 font-light leading-relaxed">
              Gain real-time visibility, algorithm-driven dispatching, and intelligent cost controls required for modern logistics.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Truck size={16} />
          <span>© 2026 FleetFlow Enterprise. All rights reserved.</span>
        </div>
      </div>

      {/* RIGHT PANEL - Authentication Form */}
      <div className="flex w-full lg:w-7/12 flex-col justify-center items-center p-6 relative bg-[#0B1220]">

        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-(--brand-accent) to-sky-500 shadow-md">
            <Command size={20} className="text-[#0B1220]" />
          </div>
          <span className="text-xl font-bold text-white">Fleet<span className="text-(--brand-accent)">Flow</span></span>
        </div>

        {/* Auth Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center sm:text-left mt-16 sm:mt-0">
            <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
            <p className="mt-2 text-gray-400 text-base">{subtitle}</p>
          </div>

          <div className="w-full rounded-2xl bg-[#111827]/80 border border-white/10 backdrop-blur-md p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            {children}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
