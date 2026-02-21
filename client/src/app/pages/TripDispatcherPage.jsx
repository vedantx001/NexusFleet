import React from 'react';
import { motion } from 'framer-motion';
import TripDispatcher from '../components/dashboard/TripDispatcher';

export default function TripDispatcherPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 font-sans"
    >
      <TripDispatcher />
    </motion.div>
  );
}
