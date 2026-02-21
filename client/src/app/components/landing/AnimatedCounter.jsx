import React, { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';

export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1.5,
  decimals,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const motionValue = useMotionValue(0);

  const resolvedDecimals = useMemo(() => {
    if (typeof decimals === 'number') return decimals;
    if (Number.isInteger(value)) return 0;
    return 2;
  }, [decimals, value]);

  const formatted = useTransform(motionValue, (latest) => {
    const next = typeof latest === 'number' ? latest : 0;
    return resolvedDecimals === 0 ? String(Math.round(next)) : next.toFixed(resolvedDecimals);
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, { duration, ease: 'easeOut' });
    return () => controls.stop();
  }, [inView, value, duration, motionValue]);

  return (
    <span ref={ref} className="inline-flex">
      {prefix}
      <motion.span>{formatted}</motion.span>
      {suffix}
    </span>
  );
}
