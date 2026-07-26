import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Part {
  id: number;
  shape: 'plate' | 'gear';
  x: number;        // scattered start
  y: number;
  fx: number;       // assembled position
  fy: number;
  teeth?: number;
  pitch?: number;
  dir?: number;     // spin direction
  period?: number;  // seconds per revolution (∝ teeth → constant pitch-line speed)
}

// A meshing gear train: centre distances = sum of pitch radii, periods ∝ teeth
// so the pitch-line speed is shared and the gears stay in mesh while turning.
const PARTS: Part[] = [
  { id: 1, shape: 'plate', x: -150, y: 120, fx: -4, fy: 8 },
  { id: 2, shape: 'gear', x: -140, y: -100, fx: -46, fy: 8, teeth: 16, pitch: 30, dir: 1, period: 20 },
  { id: 3, shape: 'gear', x: 150, y: -80, fx: 6, fy: -4, teeth: 12, pitch: 22, dir: -1, period: 15 },
  { id: 4, shape: 'gear', x: 130, y: 120, fx: 42, fy: 14, teeth: 9, pitch: 16, dir: 1, period: 11.25 },
];

function GearShape({ teeth, pitch }: { teeth: number; pitch: number }) {
  const rRoot = pitch - 2;
  const rTip = pitch + 3;
  return (
    <>
      {[...Array(teeth)].map((_, i) => (
        <rect
          key={i}
          x="-2.1"
          y={-rTip}
          width="4.2"
          height={rTip - rRoot + 2}
          rx="1"
          fill="#c2c2c2"
          stroke="#e5e5e5"
          strokeWidth="0.5"
          transform={`rotate(${(i * 360) / teeth})`}
        />
      ))}
      <circle r={rRoot} fill="#1b1b1b" stroke="#e5e5e5" strokeWidth="2" />
      {[...Array(5)].map((_, i) => (
        <rect
          key={i}
          x="-1.6"
          y={-(rRoot - 2.5)}
          width="3.2"
          height={rRoot - 2.5 - pitch * 0.32}
          rx="1.4"
          fill="#333333"
          transform={`rotate(${i * 72})`}
        />
      ))}
      <circle r={pitch * 0.3} fill="#0a0a0a" stroke="#e5e5e5" strokeWidth="2" />
      <circle r="2.4" fill="#6e6e6e" />
    </>
  );
}

function PlateShape() {
  return (
    <g>
      <rect x="-60" y="-28" width="120" height="64" rx="6" fill="#1e1e1e" stroke="#6e6e6e" strokeWidth="2" />
      <rect x="-60" y="-28" width="120" height="9" rx="6" fill="#2b2b2b" />
      {[[-52, -20], [52, -20], [-52, 28], [52, 28]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#0a0a0a" stroke="#888888" strokeWidth="1" />
      ))}
      {/* shaft bosses beneath each gear centre */}
      {[[-42, 0], [2, -12], [46, 6]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="#141414" stroke="#777777" strokeWidth="1.5" />
      ))}
    </g>
  );
}

export function HeroSection() {
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAssembled(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-8 py-20">
      <div className="max-w-6xl w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Gear-train assembly animation */}
          <div className="flex-1 relative h-80 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="-200 -150 400 300">
              {/* Central assembly point */}
              <circle cx="0" cy="0" r="2" fill="#666" />

              {PARTS.map((p) => (
                <motion.g
                  key={p.id}
                  initial={{ x: p.x, y: p.y, opacity: 0.5 }}
                  animate={{
                    x: assembled ? p.fx : p.x,
                    y: assembled ? p.fy : p.y,
                    opacity: assembled ? 1 : 0.5,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: p.id * 0.15,
                    type: 'spring',
                    stiffness: 60,
                  }}
                >
                  {p.shape === 'gear' ? (
                    <GearShape teeth={p.teeth!} pitch={p.pitch!} />
                  ) : (
                    <PlateShape />
                  )}
                </motion.g>
              ))}

              {/* Assembly-complete indicator */}
              {assembled && (
                <motion.circle
                  cx="-4"
                  cy="6"
                  r="82"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                />
              )}
            </svg>
          </div>

          {/* Hero Text */}
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                ┌─ MECHANICAL ENGINEER
              </div>
              <h1 className="text-5xl lg:text-6xl text-white mb-4">
                Rohan Singh
              </h1>
              <div className="h-px w-32 bg-gray-600 mb-4" />
              <p className="text-gray-400 text-lg leading-relaxed">
                Mechanical engineering student at the University of Toronto.
                Specializing in sustainable energy and design.
              </p>
            </motion.div>

            <motion.div
              className="flex gap-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="border border-gray-700 px-4 py-2">
                <div className="text-gray-500">LOCATION</div>
                <div className="text-white">Toronto, ON</div>
              </div>
              <div className="border border-gray-700 px-4 py-2">
                <div className="text-gray-500">STATUS</div>
                <div className="text-green-500">● AVAILABLE</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
