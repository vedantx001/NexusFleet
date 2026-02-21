import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, TrendingDown, Wrench } from 'lucide-react';
import { fadeUp, staggerContainer } from './motionVariants';

export default function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: 'Scheduling Chaos',
      desc: 'Manual dispatching creates overlapping routes and missed delivery windows.',
    },
    {
      icon: ShieldAlert,
      title: 'Compliance Risks',
      desc: 'Outdated logbooks lead to regulatory fines and missed driver rest periods.',
    },
    {
      icon: Wrench,
      title: 'Maintenance Downtime',
      desc: 'Reactive repairs cause unexpected vehicle grounding and supply chain halts.',
    },
    {
      icon: TrendingDown,
      title: 'Hidden Cost Leakage',
      desc: 'Unmonitored fuel consumption and inefficient routing erode profit margins.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            Manual Fleet Operations Don’t Scale.
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            Fragmented systems and paper logs introduce severe operational vulnerabilities, compliance gaps, and inevitable
            delays.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {problems.map((prob) => (
            <motion.div
              key={prob.title}
              variants={fadeUp}
              className="p-6 rounded-2xl bg-[var(--bg-main)] border border-[var(--border)] hover:scale-[1.03] transition-transform duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center mb-6 group-hover:border-[var(--brand-accent)] transition-colors">
                <prob.icon className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--brand-accent)] transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">{prob.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{prob.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
