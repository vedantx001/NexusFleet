import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Truck } from 'lucide-react';
import { fadeUp, staggerContainer } from './motionVariants';

const AnimatedCounter = ({ value, label }) => (
  <div className="flex flex-col items-center sm:items-start">
    <motion.h4
      className="text-3xl md:text-4xl font-bold text-(--text-primary)"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {value}
    </motion.h4>
    <p className="text-sm text-(--text-muted) font-medium mt-1">{label}</p>
  </div>
);

export default function Hero({ primaryCtaHref = '/dashboard', primaryCtaLabel = 'Launch Command Center' }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#0B1220]">
      {/* Soft radial background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-(--brand-accent) opacity-5 blur-[120px] rounded-full mix-blend-screen mix-blend-lighten pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid xl:grid-cols-2 gap-16 items-center z-10 w-full py-20">

        {/* Left Side: Content */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-8 text-center xl:text-left">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-(--border)/30 bg-(--bg-surface)/40 backdrop-blur-sm w-fit mx-auto xl:mx-0 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-(--success) animate-pulse shadow-[0_0_8px_var(--success)]" />
            <span className="text-xs font-semibold text-(--text-secondary) uppercase tracking-widest">System Operational</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-(--text-primary) leading-[1.1]"
          >
            Control Your Fleet.<br />
            Cut Costs.<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-(--brand-accent) to-sky-400 drop-shadow-sm">
              Eliminate Chaos.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-(--text-muted) max-w-2xl mx-auto xl:mx-0 leading-relaxed">
            FleetFlow gives real-time visibility into vehicles, trips, maintenance, and fuel expenses — all from one intelligent command center.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start pt-2">
            <Link
              to={primaryCtaHref}
              className="px-8 py-4 bg-(--brand-accent) hover:bg-(--brand-accent-hover) hover:scale-105 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] text-black font-semibold text-lg rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform-gpu"
            >
              {primaryCtaLabel} <ChevronRight className="w-5 h-5" />
            </Link>

            <button
              type="button"
              className="px-8 py-4 bg-transparent hover:bg-(--bg-surface)/50 border-2 border-(--border)/50 hover:border-(--border) hover:scale-105 text-(--text-primary) font-semibold text-lg rounded-xl transition-all duration-300 transform-gpu backdrop-blur-sm"
            >
              View Features
            </button>
          </motion.div>

          {/* Animated Counters */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 pt-8 border-t border-(--border)/30 mt-4">
            <AnimatedCounter value="500+" label="Vehicles Managed" />
            <AnimatedCounter value="10k+" label="Trips Completed" />
            <AnimatedCounter value="25%" label="Cost Saved" />
          </motion.div>

        </motion.div>

        {/* Right Side: Mock Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="relative hidden xl:block"
        >
          {/* Dashboard Preview Mock */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'inOut' }}
            className="relative rounded-2xl border border-(--brand-accent)/20 bg-[#111827]/80 backdrop-blur-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 overflow-hidden"
          >
            {/* Glow overlay inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-(--brand-accent) opacity-5 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-(--border)/30 pb-5 mb-8 relative z-10">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-(--danger) shadow-[0_0_8px_var(--danger)]" />
                <div className="w-3.5 h-3.5 rounded-full bg-(--warning) shadow-[0_0_8px_var(--warning)]" />
                <div className="w-3.5 h-3.5 rounded-full bg-(--success) shadow-[0_0_8px_var(--success)]" />
              </div>
              <span className="text-xs font-mono text-(--text-muted) tracking-wider">COMMAND.CENTER.V2</span>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-8 relative z-10">
              <div className="p-5 rounded-xl bg-(--bg-surface)/50 border border-(--border)/30 backdrop-blur-md">
                <p className="text-sm font-medium text-(--text-muted) mb-2 uppercase tracking-wide">Active Fleet</p>
                <p className="text-4xl font-bold text-(--text-primary) tracking-tight">1,204</p>
                <p className="text-xs text-(--success) mt-2 flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-(--success) inline-block" /> 98% Online</p>
              </div>
              <div className="p-5 rounded-xl bg-(--bg-surface)/50 border border-(--border)/30 backdrop-blur-md">
                <p className="text-sm font-medium text-(--text-muted) mb-2 uppercase tracking-wide">Avg Efficiency</p>
                <p className="text-4xl font-bold text-(--brand-accent) tracking-tight">94.2%</p>
                <p className="text-xs text-(--text-secondary) mt-2 font-medium">+2.4% this week</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <p className="text-sm font-medium text-(--text-muted) uppercase tracking-wider mb-2">Live Dispatch Feed</p>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-(--bg-surface)/40 border border-(--border)/20 hover:bg-(--bg-surface)/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-(--brand-accent)/10 flex items-center justify-center border border-(--brand-accent)/20">
                      <Truck className="w-5 h-5 text-(--brand-accent)" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-(--text-primary)">Heavy Haul #{3040 + i}</p>
                      <p className="text-sm text-(--text-muted)">En route to Distribution Hub {i}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-(--success)/10 text-(--success) border border-(--success)/20 drop-shadow-sm shadow-[0_0_10px_rgba(34,197,94,0.1)]">Nominal</span>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
