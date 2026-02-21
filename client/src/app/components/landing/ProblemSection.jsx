import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, TrendingDown } from 'lucide-react';
import { fadeUp, staggerContainer } from './motionVariants';

export default function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: 'Manual Tracking',
      desc: 'Spreadsheets and paper logs lead to errors, missing data, and operational blind spots.',
    },
    {
      icon: ShieldAlert,
      title: 'No Real-Time Visibility',
      desc: 'Lack of live location and status updates causes delays and unhappy customers.',
    },
    {
      icon: TrendingDown,
      title: 'Rising Operational Costs',
      desc: 'Unmonitored fuel consumption and reactive maintenance erode your profit margins.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#0B1220] relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-(--text-primary) tracking-tight mb-6">
            Manual Fleet Operations Don’t Scale.
          </h2>
          <p className="text-(--text-muted) max-w-2xl mx-auto text-lg leading-relaxed">
            Fragmented systems and paper logs introduce severe operational vulnerabilities, compliance gaps, and inevitable delays.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {problems.map((prob) => (
            <motion.div
              key={prob.title}
              variants={fadeUp}
              className="p-8 rounded-2xl bg-[#111827]/80 backdrop-blur-md border border-(--border)/20 hover:border-(--brand-accent)/50 hover:-translate-y-2 transition-all duration-300 group shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(56,189,248,0.1)] relative overflow-hidden"
            >
              {/* Subtle accent glow top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-(--brand-accent) scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />

              <div className="w-14 h-14 rounded-xl bg-(--bg-surface)/50 border border-(--border)/30 flex items-center justify-center mb-6 group-hover:bg-(--brand-accent)/10 group-hover:border-(--brand-accent)/30 transition-colors duration-300">
                <prob.icon className="w-7 h-7 text-(--text-muted) group-hover:text-(--brand-accent) transition-colors duration-300 drop-shadow-sm" />
              </div>
              <h3 className="text-2xl font-semibold text-(--text-primary) mb-3 group-hover:text-(--brand-accent) transition-colors">{prob.title}</h3>
              <p className="text-(--text-muted) leading-relaxed text-base">{prob.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
