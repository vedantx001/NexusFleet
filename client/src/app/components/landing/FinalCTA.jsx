import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Command } from 'lucide-react';
import { fadeUp } from './motionVariants';

export default function FinalCTA({ ctaHref = '/dashboard' }) {
  return (
    <section className="relative py-32 bg-[#0B1220] overflow-hidden border-t border-(--border)/10">
      {/* Background Gradient & Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-linear-to-r from-(--brand-accent)/10 to-(--success)/10 blur-[150px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="p-12 md:p-16 rounded-3xl bg-[#111827]/80 backdrop-blur-xl border border-(--brand-accent)/20 shadow-[0_0_50px_rgba(56,189,248,0.1)] relative overflow-hidden group"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 border border-(--brand-accent)/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-(--text-primary) tracking-tight mb-6">
            Ready to upgrade your fleet?
          </h2>
          <p className="text-lg md:text-xl text-(--text-muted) mb-10 max-w-2xl mx-auto leading-relaxed">
            Join modern logistics companies using FleetFlow to cut costs, ensure compliance, and deliver on time.
          </p>
          <Link
            to={ctaHref}
            className="px-10 py-5 bg-(--brand-accent) hover:bg-(--brand-accent-hover) hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] text-black font-bold rounded-xl text-lg flex items-center justify-center gap-3 mx-auto transition-all duration-300 transform-gpu w-fit"
          >
            Start Managing Your Fleet Today <Command className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
