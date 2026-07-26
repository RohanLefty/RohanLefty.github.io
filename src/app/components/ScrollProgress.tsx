import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div className="fixed left-8 top-0 h-screen flex items-center z-50 pointer-events-none">
      <div className="relative h-[80vh] w-12 flex flex-col items-center">
        {/* Top Arrow */}
        <div className="text-gray-600 mb-2">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M 6 0 L 10 6 L 8 6 L 8 12 L 4 12 L 4 6 L 2 6 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Dimension Line Track */}
        <div className="relative flex-1 w-px bg-gray-800">
          {/* Progress Fill */}
          <motion.div
            className="absolute top-0 left-0 w-full bg-blue-500 origin-top"
            style={{ scaleY }}
          />

          {/* Measurement Ticks */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="absolute w-3 h-px bg-gray-700 -left-1"
              style={{ top: `${tick}%` }}
            />
          ))}
        </div>

        {/* Bottom Arrow */}
        <div className="text-gray-600 mt-2">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M 6 12 L 2 6 L 4 6 L 4 0 L 8 0 L 8 6 L 10 6 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Percentage Label */}
        <motion.div
          className="absolute left-6 text-xs font-mono text-blue-400 whitespace-nowrap"
          style={{ top: `${percentage}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {percentage}%
        </motion.div>

        {/* Dimension Label */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-600 uppercase tracking-wider whitespace-nowrap">
          SCROLL DEPTH
        </div>
      </div>
    </div>
  );
}
