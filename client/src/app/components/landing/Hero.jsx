import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Truck } from 'lucide-react';
import { fadeUp, staggerContainer } from './motionVariants';

export default function Hero({ primaryCtaHref = '/dashboard', primaryCtaLabel = 'Enter Command Center' }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[var(--bg-main)]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--brand-accent)_0%,transparent_15%)] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10 w-full">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">System Operational</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl lg:text-7xl font-semibold tracking-tight text-[var(--text-primary)] leading-[1.1]"
          >
            Command Logistics <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-accent)] to-[var(--text-secondary)]">
              With Precision.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
            A powerful modular fleet intelligence system built for operational control, lifecycle automation, and data-driven
            dispatching.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-4">
            <Link
              to={primaryCtaHref}
              className="px-6 py-3 bg-[var(--brand-accent)] hover:bg-[var(--brand-accent-hover)] text-black font-medium rounded-xl flex items-center gap-2 transition-colors"
            >
              {primaryCtaLabel} <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              className="px-6 py-3 bg-[var(--bg-surface)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-primary)] font-medium rounded-xl transition-colors"
            >
              View Architecture
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]/60 backdrop-blur-2xl p-6 shadow-[var(--shadow-md)] z-20"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--danger)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--warning)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
              </div>
              <span className="text-xs font-mono text-[var(--text-secondary)]">SYS.TELEM.01</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)] mb-1">Active Units</p>
                <p className="text-2xl font-semibold text-[var(--text-primary)] font-mono">1,204</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)] mb-1">Fleet Efficiency</p>
                <p className="text-2xl font-semibold text-[var(--success)] font-mono">94.2%</p>
              </div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[var(--border)] flex items-center justify-center">
                      <Truck className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Unit #{3040 + i}</p>
                      <p className="text-xs text-[var(--text-secondary)]">En route to Hub {i}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-[var(--success)]/10 text-[var(--success)]">Nominal</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[var(--info)]/10 to-[var(--brand-accent)]/10 blur-3xl rounded-full z-0" />
        </motion.div>
      </div>
    </section>
  );
}
