import { useState } from 'react';
import { motion } from 'motion/react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  specs: string[];
  status?: string;
  link?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Gambit',
    category: 'ROBOTICS',
    status: 'In Progress',
    description:
      'A 3-axis Cartesian gantry that plays physical chess against a human opponent. An overhead camera reads the board, an embedded engine plans each move, and an electromagnet end-effector lifts and places the pieces.',
    specs: [
      'Work Envelope: 400×400×80mm',
      'Kinematics: CoreXY + Z',
      'Repeatability: ±0.1mm',
      'End-Effector: Electromagnet, 5N',
      'Vision: Overhead 1080p CV',
      'Engine: Stockfish · ~2800 ELO'
    ]
  },
  {
    id: 2,
    title: 'Working Boxer Engine',
    category: 'POWERTRAIN',
    description:
      'A working scale replica of the Porsche 911 air-cooled flat-six boxer engine. Six horizontally-opposed cylinders share a central crankshaft, giving the near-perfect primary balance and the low, flat profile that define the 911 powerplant.',
    specs: [
      'Configuration: Flat-6 Boxer',
      'Layout: Horizontally Opposed, 180°',
      'Firing Order: 1-6-2-4-3-5',
      'Cooling: Air-cooled',
      'Build: 1:3 Scale Replica'
    ]
  },
  {
    id: 3,
    title: 'Valara',
    category: 'MARKET INTELLIGENCE',
    link: 'https://valara.ca',
    description:
      'Valara gives retail investors access to institutional-grade market intelligence by aggregating data from 20+ sources to identify emerging market narratives before they hit mainstream news. It then uses those insights to actively manage a portfolio spanning ETFs, stocks, options, crypto, and prediction markets. Try Valara free today.',
    specs: [
      'Data Sources: 20+ streams',
      'Detection Lead: ~20 days pre-news',
      'Assets: ETFs · Stocks · Options',
      'Also: Crypto · Prediction Markets',
      'Access: Free tier available'
    ]
  }
];

function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);

  // Isometric chess-board helpers (used by the Gambit drawing).
  // iso grid: column i, row j → screen point, optionally "lifted" up the screen.
  const ISO = (i: number, j: number, lift = 0) =>
    `${150 + (i - j) * 9},${132 + (i + j) * 4.5 - lift}`;
  const isoXY = (i: number, j: number, lift = 0): [number, number] => [
    150 + (i - j) * 9,
    132 + (i + j) * 4.5 - lift,
  ];
  const pawn = (x: number, y: number, accent = false) => {
    const c = accent ? '#3b82f6' : '#9a9a9a';
    return (
      <g>
        <ellipse cx={x} cy={y} rx="3.4" ry="1.4" fill="#000" opacity="0.3" />
        <path
          d={`M ${x - 3} ${y} L ${x + 3} ${y} L ${x + 1.4} ${y - 6.5} L ${x - 1.4} ${y - 6.5} Z`}
          fill={c}
          stroke="#d4d4d4"
          strokeWidth="0.5"
        />
        <circle cx={x} cy={y - 8.4} r="2.4" fill={c} stroke="#d4d4d4" strokeWidth="0.5" />
      </g>
    );
  };

  // Isometric box helpers (used by the boxer-engine drawing).
  // 3D coords: x = crankshaft axis, y = cylinder axis (bank), z = height.
  const ES = 21;        // iso scale
  const EOX = 120;      // origin x
  const EOY = 118;      // origin y
  const pj = (x: number, y: number, z: number): [number, number] => [
    EOX + (x - y) * 0.866 * ES,
    EOY + (x + y) * 0.5 * ES - z * ES,
  ];
  const P = (p: [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const isoBox = (
    x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
    top = '#6a6a6a', fx = '#474747', fy = '#363636', stroke = '#8a8a8a',
  ) => (
    <g>
      {/* top (z1) */}
      <path d={`M ${P(pj(x0, y0, z1))} L ${P(pj(x1, y0, z1))} L ${P(pj(x1, y1, z1))} L ${P(pj(x0, y1, z1))} Z`} fill={top} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
      {/* +x face */}
      <path d={`M ${P(pj(x1, y0, z1))} L ${P(pj(x1, y1, z1))} L ${P(pj(x1, y1, z0))} L ${P(pj(x1, y0, z0))} Z`} fill={fx} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
      {/* +y face */}
      <path d={`M ${P(pj(x0, y1, z1))} L ${P(pj(x1, y1, z1))} L ${P(pj(x1, y1, z0))} L ${P(pj(x0, y1, z0))} Z`} fill={fy} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
    </g>
  );
  // Air-cooling fins across a cylinder jug (lines along x at stepped y).
  const fins = (x0: number, x1: number, y0: number, y1: number, z1: number, n = 6) =>
    [...Array(n)].map((_, i) => {
      const yf = y0 + ((i + 0.7) / n) * (y1 - y0);
      return <line key={i} x1={pj(x0, yf, z1)[0]} y1={pj(x0, yf, z1)[1]} x2={pj(x1, yf, z1)[0]} y2={pj(x1, yf, z1)[1]} stroke="#9a9a9a" strokeWidth="0.7" />;
    });

  return (
    <motion.div
      className="relative border border-gray-700 bg-black/40 p-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Isometric Exploded View */}
      <div className="relative h-64 mb-6 flex items-center justify-center overflow-hidden">
        {project.id === 1 ? (
          <svg className="w-full h-full" viewBox="0 0 300 250">
            {/* ── Chess board (bottom layer) ── */}
            <motion.g
              animate={{ y: isHovered ? 46 : 0, opacity: isHovered ? 0.7 : 1 }}
              transition={{ duration: 0.4 }}
            >
              {[...Array(8)].map((_, j) =>
                [...Array(8)].map((_, i) => (
                  <path
                    key={`c${i}-${j}`}
                    d={`M ${ISO(i, j)} L ${ISO(i + 1, j)} L ${ISO(i + 1, j + 1)} L ${ISO(i, j + 1)} Z`}
                    fill={(i + j) % 2 === 0 ? '#4a4a4a' : '#1c1c1c'}
                    stroke="#565656"
                    strokeWidth="0.4"
                  />
                ))
              )}
              <path
                d={`M ${ISO(0, 0)} L ${ISO(8, 0)} L ${ISO(8, 8)} L ${ISO(0, 8)} Z`}
                fill="none"
                stroke="#808080"
                strokeWidth="2"
              />
              {pawn(...isoXY(1.5, 5.5))}
              {pawn(...isoXY(5.5, 1.5))}
              {pawn(...isoXY(6.5, 6.5))}
            </motion.g>

            {/* ── Support posts (fade out as it explodes) ── */}
            <motion.g animate={{ opacity: isHovered ? 0 : 1 }} transition={{ duration: 0.3 }}>
              {[[150, 132], [222, 168], [150, 204], [78, 168]].map(([cx, cy], k) => (
                <rect key={k} x={cx - 1.5} y={cy - 34} width="3" height="34" fill="#454545" stroke="#6e6e6e" strokeWidth="0.8" />
              ))}
            </motion.g>

            {/* ── Gantry rail frame ── */}
            <motion.g animate={{ y: isHovered ? -6 : 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
              {isHovered && (
                <motion.line
                  x1="150" y1="150" x2="150" y2="184"
                  stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <line x1="150" y1="98" x2="222" y2="134" stroke="#8a8a8a" strokeWidth="4" strokeLinecap="round" />
              <line x1="78" y1="134" x2="150" y2="170" stroke="#8a8a8a" strokeWidth="4" strokeLinecap="round" />
              <line x1="150" y1="98" x2="78" y2="134" stroke="#6a6a6a" strokeWidth="2" />
              <line x1="222" y1="134" x2="150" y2="170" stroke="#6a6a6a" strokeWidth="2" />
              {[[150, 98], [222, 134], [150, 170], [78, 134]].map(([x, y], k) => (
                <rect key={k} x={x - 3} y={y - 3} width="6" height="6" fill="#5a5a5a" stroke="#a3a3a3" strokeWidth="1" />
              ))}
            </motion.g>

            {/* ── X-Y bridge + carriage ── */}
            <motion.g animate={{ y: isHovered ? -42 : 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              {isHovered && (
                <motion.line
                  x1="150" y1="120" x2="150" y2="152"
                  stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                />
              )}
              <line x1="186" y1="116" x2="114" y2="152" stroke="#9a9a9a" strokeWidth="5" strokeLinecap="round" />
              <line x1="186" y1="116" x2="114" y2="152" stroke="#5a5a5a" strokeWidth="1.5" />
              <rect x="142" y="128" width="16" height="12" rx="1" fill="#666666" stroke="#d4d4d4" strokeWidth="1.5" />
              <rect x="144" y="125" width="12" height="3" fill="#777777" stroke="#cfcfcf" strokeWidth="0.8" />
            </motion.g>

            {/* ── Z-axis + electromagnet + held piece (top) ── */}
            <motion.g animate={{ y: isHovered ? -80 : 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              {isHovered && (
                <motion.line
                  x1="150" y1="92" x2="150" y2="118"
                  stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              )}
              <path d="M 158 130 Q 170 120 167 106" fill="none" stroke="#2e2e2e" strokeWidth="1.5" />
              <rect x="143" y="120" width="14" height="9" rx="1" fill="#505050" stroke="#d4d4d4" strokeWidth="1.5" />
              <rect x="147" y="134" width="6" height="24" fill="#808080" stroke="#d4d4d4" strokeWidth="1.5" />
              <rect x="142" y="157" width="16" height="9" rx="1" fill="#454545" stroke="#d4d4d4" strokeWidth="1.5" />
              <line x1="143" y1="160" x2="157" y2="160" stroke="#6a6a6a" strokeWidth="0.8" />
              <line x1="143" y1="162.5" x2="157" y2="162.5" stroke="#6a6a6a" strokeWidth="0.8" />
              <rect x="146" y="166" width="8" height="2.5" fill="#9a9a9a" stroke="#d4d4d4" strokeWidth="0.6" />
              {pawn(150, 178, true)}
            </motion.g>

            {/* ── Dimension annotations on hover ── */}
            {isHovered && (
              <>
                <motion.text x="226" y="74" fill="#3b82f6" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  Z: 80mm
                </motion.text>
                <motion.text x="226" y="120" fill="#3b82f6" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  ±0.1mm
                </motion.text>
                <motion.text x="226" y="158" fill="#3b82f6" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  CoreXY
                </motion.text>
                <motion.text x="38" y="220" fill="#3b82f6" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                  BOARD 400mm
                </motion.text>
              </>
            )}
          </svg>
        ) : project.id === 2 ? (
          <svg className="w-full h-full" viewBox="0 0 300 250">
            {/* ── Rear bank — heads (explode up-right, drawn farthest back) ── */}
            <motion.g animate={{ x: isHovered ? 52 : 0, y: isHovered ? -30 : 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
              {[0.6, 1.7, 2.8].map((xc, k) => (
                <g key={k}>
                  {isoBox(xc - 0.5, xc + 0.5, -2.42, -1.98, 0.05, 1.22, '#585858', '#3c3c3c', '#2c2c2c')}
                  <circle cx={pj(xc, -2.2, 1.28)[0]} cy={pj(xc, -2.2, 1.28)[1]} r="2.4" fill="#2a2a2a" stroke="#9a9a9a" strokeWidth="0.8" />
                </g>
              ))}
            </motion.g>
            {/* ── Rear bank — jugs ── */}
            <motion.g animate={{ x: isHovered ? 30 : 0, y: isHovered ? -17 : 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
              {[0.6, 1.7, 2.8].map((xc, k) => (
                <g key={k}>
                  {isoBox(xc - 0.42, xc + 0.42, -1.98, -0.62, 0.12, 1.12)}
                  {fins(xc - 0.42, xc + 0.42, -1.98, -0.62, 1.12)}
                </g>
              ))}
            </motion.g>

            {/* ── Crankcase ── */}
            <g>
              {isoBox(0, 3.4, -0.62, 0.62, 0, 1.25, '#646464', '#434343', '#313131')}
              <line x1={pj(0, -0.62, 0.6)[0]} y1={pj(0, -0.62, 0.6)[1]} x2={pj(3.4, -0.62, 0.6)[0]} y2={pj(3.4, -0.62, 0.6)[1]} stroke="#8a8a8a" strokeWidth="0.8" />
              {/* crank pulley at the front end */}
              <ellipse cx={pj(3.5, 0, 0.62)[0]} cy={pj(3.5, 0, 0.62)[1]} rx="6" ry="12" fill="#4a4a4a" stroke="#b0b0b0" strokeWidth="1.2" transform={`rotate(28 ${pj(3.5, 0, 0.62)[0]} ${pj(3.5, 0, 0.62)[1]})`} />
            </g>

            {/* ── Crankshaft (revealed on explode) ── */}
            <motion.g animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <line x1={pj(0.2, 0, 0.62)[0]} y1={pj(0.2, 0, 0.62)[1]} x2={pj(3.2, 0, 0.62)[0]} y2={pj(3.2, 0, 0.62)[1]} stroke="#cfcfcf" strokeWidth="2.5" />
              {[0.6, 1.7, 2.8].map((xc, k) => (
                <circle key={k} cx={pj(xc, 0, 0.62)[0]} cy={pj(xc, 0, 0.62)[1]} r="2.6" fill="#6a6a6a" stroke="#e5e5e5" strokeWidth="1" />
              ))}
            </motion.g>

            {/* ── Front bank — jugs (explode down-left) ── */}
            <motion.g animate={{ x: isHovered ? -30 : 0, y: isHovered ? 17 : 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
              {[0.6, 1.7, 2.8].map((xc, k) => (
                <g key={k}>
                  {isoBox(xc - 0.42, xc + 0.42, 0.62, 1.98, 0.12, 1.12)}
                  {fins(xc - 0.42, xc + 0.42, 0.62, 1.98, 1.12)}
                </g>
              ))}
            </motion.g>
            {/* ── Front bank — heads (drawn nearest the viewer) ── */}
            <motion.g animate={{ x: isHovered ? -52 : 0, y: isHovered ? 30 : 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
              {[0.6, 1.7, 2.8].map((xc, k) => (
                <g key={k}>
                  {isoBox(xc - 0.5, xc + 0.5, 1.98, 2.42, 0.05, 1.22, '#585858', '#3c3c3c', '#2c2c2c')}
                  <circle cx={pj(xc, 2.2, 1.28)[0]} cy={pj(xc, 2.2, 1.28)[1]} r="2.4" fill="#2a2a2a" stroke="#9a9a9a" strokeWidth="0.8" />
                </g>
              ))}
            </motion.g>

            {/* ── Annotations on hover ── */}
            {isHovered && (
              <>
                <motion.text x="122" y="34" fill="#3b82f6" fontSize="11" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  FLAT-6
                </motion.text>
                <motion.text x="12" y="118" fill="#3b82f6" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  BANK A
                </motion.text>
                <motion.text x="246" y="150" fill="#3b82f6" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  BANK B
                </motion.text>
                <motion.text x="86" y="240" fill="#3b82f6" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                  FIRING 1-6-2-4-3-5
                </motion.text>
              </>
            )}
          </svg>
        ) : (
          /* ── Valara: data streams → narrative engine → managed portfolio ── */
          <svg className="w-full h-full" viewBox="0 0 300 250">
            <defs>
              <linearGradient id="valaraGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>

            {/* ── Layer 1: source streams (drops away on hover) ── */}
            <motion.g
              animate={{ y: isHovered ? 26 : 0, opacity: isHovered ? 0.75 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <rect x="58" y="188" width="184" height="30" rx="2" fill="none" stroke="#5a5a5a" strokeWidth="1.2" />
              {/* signal spectrum — one bar per ingested stream */}
              {[9, 16, 6, 21, 12, 25, 8, 18, 11, 23, 7, 15, 20, 10, 17, 13].map((h, i) => (
                <line
                  key={i}
                  x1={66 + i * 11.4} y1="214" x2={66 + i * 11.4} y2={214 - h}
                  stroke={i % 3 === 0 ? '#2dd4bf' : '#8a8a8a'}
                  strokeWidth="2.2"
                />
              ))}
            </motion.g>

            {/* ── Layer 2: narrative engine (stays put, the convergence point) ── */}
            <g>
              {/* convergence leaders from the stream band up into the engine */}
              {[[78, 188], [150, 188], [222, 188]].map(([sx, sy], i) => (
                <line key={i} x1={sx} y1={sy} x2="150" y2="152" stroke="#4a4a4a" strokeWidth="1" strokeDasharray="3 3" />
              ))}
              {/* hex housing */}
              <path
                d="M 150 100 L 178 116 L 178 148 L 150 164 L 122 148 L 122 116 Z"
                fill="#101828" stroke="#8a8a8a" strokeWidth="1.6"
              />
              {/* Valara "V" mark */}
              <path d="M 139 120 L 150 143 L 161 120" fill="none" stroke="url(#valaraGrad)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M 157 116 L 166 112 L 162 121 Z" fill="url(#valaraGrad)" />
            </g>

            {/* ── Layer 3: managed portfolio output (lifts on hover) ── */}
            <motion.g
              animate={{ y: isHovered ? -34 : 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              {isHovered && (
                <motion.line
                  x1="150" y1="96" x2="150" y2="74"
                  stroke="#2dd4bf" strokeWidth="1" strokeDasharray="3 3"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              )}
              {/* axes */}
              <line x1="82" y1="76" x2="82" y2="28" stroke="#5a5a5a" strokeWidth="1.2" />
              <line x1="82" y1="76" x2="218" y2="76" stroke="#5a5a5a" strokeWidth="1.2" />
              {/* equity curve, rising */}
              <polyline
                points="82,70 105,64 124,67 146,54 168,46 190,34 214,24"
                fill="none" stroke="url(#valaraGrad)" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round"
              />
              {[[105, 64], [146, 54], [190, 34], [214, 24]].map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r="2.4" fill="#0d1117" stroke="#2dd4bf" strokeWidth="1.4" />
              ))}
            </motion.g>

            {/* ── Annotations on hover ── */}
            {isHovered && (
              <>
                <motion.text x="222" y="30" fill="#2dd4bf" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  PORTFOLIO
                </motion.text>
                <motion.text x="186" y="130" fill="#818cf8" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  NARRATIVE
                </motion.text>
                <motion.text x="186" y="142" fill="#818cf8" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
                  ENGINE
                </motion.text>
                <motion.text x="18" y="206" fill="#60a5fa" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
                  20+ DATA SOURCES
                </motion.text>
                <motion.text x="18" y="118" fill="#60a5fa" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}>
                  ~20 DAYS
                </motion.text>
                <motion.text x="18" y="130" fill="#60a5fa" fontSize="9" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
                  PRE-NEWS
                </motion.text>
              </>
            )}
          </svg>
        )}
      </div>

      {/* Project Info */}
      <div className="space-y-4">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {project.category}
          </div>
          <h3 className="text-xl text-white">{project.title}</h3>
          {project.status && (
            <div className="mt-2 inline-flex items-center gap-1.5 border border-blue-500/40 bg-blue-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-blue-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {project.status}
            </div>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 border border-teal-400/40 bg-teal-400/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-teal-300 font-mono hover:border-teal-300 hover:text-teal-200 transition-colors"
            >
              {project.link.replace(/^https?:\/\//, '')}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-2 space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">
              {project.description}
            </p>
            <div className="border-t border-gray-800 pt-3 space-y-1">
              {project.specs.map((spec, idx) => (
                <div key={idx} className="text-xs text-gray-500 font-mono">
                  ▸ {spec}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Corner Reference Mark */}
      <div className="absolute top-2 right-2 text-xs text-gray-600">
        ITEM-{String(project.id).padStart(3, '0')}
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <section className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl text-white mb-2">SELECTED PROJECTS</h2>
          <div className="h-px w-48 bg-gray-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
