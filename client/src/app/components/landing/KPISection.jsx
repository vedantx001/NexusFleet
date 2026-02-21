import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { fadeUp, staggerContainer } from './motionVariants';

export default function KPISection() {
  const metrics = [
    { title: 'Vehicles Managed', value: 500, suffix: '+', decimals: 0 },
    { title: 'Trips Completed', value: 10000, suffix: '+', decimals: 0 },
    { title: 'Cost Reduction', value: 25, suffix: '%', decimals: 0 },
    { title: 'Fleet Utilization', value: 98, suffix: '%', decimals: 0 },
  ];

  return (
    <section id="metrics" className="py-24 bg-[#0B1220] relative border-t border-(--border)/10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.title}
              variants={fadeUp}
              className="relative overflow-hidden p-8 rounded-2xl bg-[#111827] border border-(--border)/20 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(56,189,248,0.1)]"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-linear-to-b from-(--brand-accent)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <p className="text-sm font-bold text-(--text-muted) mb-3 relative z-10 uppercase tracking-widest group-hover:text-(--brand-accent) transition-colors">
                {metric.title}
              </p>

              <h3 className="text-5xl font-bold text-(--text-primary) tracking-tight relative z-10">
                <AnimatedCounter
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  decimals={metric.decimals}
                />
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
