import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Command } from 'lucide-react';
import { fadeUp } from './motionVariants';

export default function FinalCTA({ ctaHref = '/dashboard' }) {
  return (
    <section className="relative py-32 bg-(--bg-main) overflow-hidden border-t border-(--border)">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <div className="w-200 h-200 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGgxdjQwSDB6TTAgMGg0MHYxSDB6IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPg==')]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-5xl md:text-7xl font-semibold text-(--text-primary) tracking-tight mb-8">
            Experience FleetFlow.
          </h2>
          <Link
            to={ctaHref}
            className="px-8 py-4 bg-(--text-primary) hover:bg-(--text-secondary) text-(--bg-main) font-medium rounded-xl text-lg flex items-center gap-2 mx-auto transition-all hover:scale-105 shadow-xl w-fit"
          >
            Launch System <Command className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
