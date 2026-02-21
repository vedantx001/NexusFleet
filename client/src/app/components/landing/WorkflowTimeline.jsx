import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { fadeUp, staggerContainer } from './motionVariants';

export default function WorkflowTimeline() {
  const steps = [
    { title: 'Register Vehicles', desc: 'Add telematics and specs to the command center.' },
    { title: 'Assign Drivers', desc: 'Match personnel to assets based on qualifications.' },
    { title: 'Dispatch Trips', desc: 'Generate algorithmic routes and load plans.' },
    { title: 'Monitor in Real-Time', desc: 'Track location, fuel, and ETA continuously.' },
    { title: 'Analyze & Optimize', desc: 'Review performance insights to cut future costs.' },
  ];

  return (
    <section id="workflow" className="py-24 bg-[#111827] overflow-hidden relative border-t border-(--border)/10">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-(--brand-accent) opacity-5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="mb-20 text-center"
        >
          <span className="text-(--brand-accent) font-semibold text-sm uppercase tracking-widest mb-3 block drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-(--text-primary) tracking-tight mb-4">
            Streamlined Operational Flow
          </h2>
          <p className="text-(--text-muted) max-w-2xl mx-auto text-lg leading-relaxed">
            From asset intake to final delivery analysis, FleetFlow connects every step of your logistics pipeline.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Desktop horizontal line */}
          <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-1 bg-linear-to-r from-(--border)/10 via-(--brand-accent)/50 to-(--border)/10 rounded-full" />

          {/* Mobile vertical line */}
          <div className="md:hidden absolute left-[31px] top-[10px] bottom-[10px] w-1 bg-linear-to-b from-(--border)/10 via-(--brand-accent)/50 to-(--border)/10 rounded-full" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4 relative z-10"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="flex md:flex-col items-start md:items-center text-left md:text-center gap-6 md:gap-4 group relative"
              >
                <div className="relative">
                  {/* Glow on hover */}
                  <div className="absolute inset-0 bg-(--brand-accent) opacity-0 group-hover:opacity-40 blur-xl rounded-full transition-opacity duration-300" />

                  <div className="w-16 h-16 rounded-full bg-[#0B1220] border-2 border-(--border)/30 flex items-center justify-center group-hover:border-(--brand-accent) group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300 z-10 shrink-0 relative">
                    <span className="text-xl font-bold text-(--text-muted) group-hover:text-(--brand-accent) transition-colors">{index + 1}</span>
                  </div>
                </div>

                <div className="pt-2 md:pt-0">
                  <h4 className="text-lg font-bold text-(--text-primary) mb-2 group-hover:text-(--brand-accent) transition-colors">{step.title}</h4>
                  <p className="text-sm text-(--text-muted) leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
