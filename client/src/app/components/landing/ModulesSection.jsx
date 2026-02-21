import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Command, Truck, Wrench, FileText } from 'lucide-react';
import { fadeUp, staggerContainer } from './motionVariants';

export default function ModulesSection() {
  const modules = [
    { icon: Command, title: 'Command Center', desc: 'Centralized operational overview with real-time telematics and active trip monitoring.' },
    { icon: FileText, title: 'Vehicle Registry', desc: 'Comprehensive lifecycle tracking, specifications, and compliance document management.' },
    { icon: Truck, title: 'Trip Dispatcher', desc: 'Algorithmic routing, intelligent load assignments, and real-time delivery tracking.' },
    { icon: Wrench, title: 'Maintenance Tracking', desc: 'Predictive service scheduling, repair cost tracking, and automated service reminders.' },
    { icon: BarChart3, title: 'Analytics & Insights', desc: 'Custom reporting on fleet utilization, cost per kilometer, and operational efficiency.' },
  ];

  return (
    <section id="modules" className="py-24 bg-[#0B1220] relative border-t border-(--border)/10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="mb-16 text-center">
          <span className="text-(--brand-accent) font-semibold text-sm uppercase tracking-widest mb-3 block drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
            System Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-(--text-primary) tracking-tight">Everything you need.</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((mod, index) => (
            <motion.div
              key={mod.title}
              variants={fadeUp}
              className={`p-8 rounded-2xl bg-[#111827] border border-(--border)/20 hover:border-(--brand-accent)/50 transition-all duration-300 group ${index === 4 ? 'lg:col-span-2' : ''}`}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-(--brand-accent)/10 group-hover:bg-(--brand-accent)/20 transition-colors">
                  <mod.icon className="w-6 h-6 text-(--brand-accent)" />
                </div>
                <h3 className="text-xl font-bold text-(--text-primary)">{mod.title}</h3>
              </div>
              <p className="text-(--text-muted) text-base leading-relaxed">{mod.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
