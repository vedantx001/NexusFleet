import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { fadeUp, staggerContainer } from './motionVariants';

export default function KPISection() {
  const metrics = [
    { title: 'Active Fleet', value: 1240, suffix: '+', decimals: 0 },
    { title: 'Utilization Rate', value: 94, suffix: '%', decimals: 0 },
    { title: 'Maintenance Alerts', value: 12, suffix: '', decimals: 0 },
    { title: 'Op. Cost / KM', value: 1.24, prefix: '$', decimals: 2 },
  ];

  return (
    <section id="metrics" className="py-24 bg-(--bg-main)">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.title}
              variants={fadeUp}
              className="relative overflow-hidden p-6 md:p-8 rounded-2xl bg-(--bg-surface) border border-(--border) flex flex-col items-center text-center group"
            >
              <div className="absolute inset-0 bg-linear-to-b from-(--bg-surface) to-(--bg-main) opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-sm font-medium text-(--text-secondary) mb-4 relative z-10 uppercase tracking-wider">
                {metric.title}
              </p>
              <h3 className="text-4xl md:text-5xl font-semibold text-(--text-primary) font-mono relative z-10">
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
