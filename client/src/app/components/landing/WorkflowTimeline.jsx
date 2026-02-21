import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { fadeUp, staggerContainer } from './motionVariants';

export default function WorkflowTimeline() {
  const steps = [
    { title: 'Vehicle Intake', desc: 'Asset added to registry.' },
    { title: 'Compliance', desc: 'Driver & doc validation.' },
    { title: 'Dispatch', desc: 'Route algorithm assigned.' },
    { title: 'Completion', desc: 'Telemetry confirms delivery.' },
    { title: 'Maintenance', desc: 'Odometer triggers service.' },
    { title: 'Analytics', desc: 'Cost & efficiency logged.' },
  ];

  return (
    <section id="workflow" className="py-24 bg-[var(--bg-surface)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] tracking-tight mb-4">
            Operational Pipeline
          </h2>
          <p className="text-[var(--text-secondary)]">Automated workflows bridging assets, personnel, and data.</p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-[var(--border)] -translate-y-1/2" />
          <div className="md:hidden absolute left-[27px] top-0 bottom-0 w-px bg-[var(--border)]" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4 relative z-10"
          >
            {steps.map((step) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="flex md:flex-col items-center md:text-center gap-6 md:gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--bg-main)] border-2 border-[var(--border)] flex items-center justify-center group-hover:border-[var(--brand-accent)] group-hover:scale-110 transition-all z-10 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--brand-accent)]" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-[var(--text-primary)] mb-1">{step.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
