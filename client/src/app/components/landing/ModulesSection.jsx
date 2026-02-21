import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Command, Fuel, Layers, Truck, UserCheck, Wrench } from 'lucide-react';
import { fadeUp, staggerContainer } from './motionVariants';

export default function ModulesSection() {
  const modules = [
    { icon: Command, title: 'Command Center', desc: 'Centralized operational overview with real-time telematics.' },
    { icon: Truck, title: 'Trip Dispatcher', desc: 'Algorithmic routing and intelligent load assignments.' },
    { icon: Layers, title: 'Vehicle Registry', desc: 'Comprehensive lifecycle tracking and asset documentation.' },
    { icon: Wrench, title: 'Maintenance Logs', desc: 'Predictive service scheduling and repair cost tracking.' },
    { icon: Fuel, title: 'Expense Intelligence', desc: 'Automated fuel consumption analysis and receipt parsing.' },
    { icon: UserCheck, title: 'Driver Profiles', desc: 'Safety scoring, hour tracking, and credential validation.' },
    { icon: BarChart3, title: 'Operational Analytics', desc: 'Custom reporting on fleet utilization and cost per km.' },
  ];

  return (
    <section id="modules" className="py-32 bg-(--bg-main)">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16">
          <span className="text-(--brand-accent) font-mono text-sm uppercase tracking-widest mb-2 block">
            System Architecture
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold text-(--text-primary) tracking-tight">Modular Intelligence.</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((mod) => (
            <motion.div
              key={mod.title}
              variants={fadeUp}
              className="p-8 rounded-2xl bg-(--bg-surface) border border-(--border) hover:border-(--brand-accent) hover:shadow-[0_4px_20px_rgba(196,165,117,0.1)] transition-all duration-300 group"
            >
              <mod.icon className="w-8 h-8 text-(--text-primary) mb-6 group-hover:text-(--brand-accent) transition-colors" />
              <h3 className="text-xl font-medium text-(--text-primary) mb-3">{mod.title}</h3>
              <p className="text-(--text-secondary) text-sm leading-relaxed">{mod.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
