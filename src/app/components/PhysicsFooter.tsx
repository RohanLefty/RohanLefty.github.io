import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

/* ── Engine geometry (SVG viewBox units) ────────────────────────────── */
const VBW = 820;
const VBH = 330;
const CX = 235;          // crank / flywheel centre x
const CY = 158;          // crank / flywheel centre y
const FR = 110;          // flywheel radius
const R = 72;            // crank throw (½ stroke)
const L = 350;           // connecting-rod length
const PH = 34;           // piston ½ length
const BH = 44;           // piston ½ bore (height)
const CYL_L = 472;       // cylinder opening (left)
const CYL_HEAD = 706;    // cylinder head inner face
const GROUND = 300;
const PISTON_MIN = CX - R + L; // piston centre at BDC
const PISTON_MAX = CX + R + L; // piston centre at TDC

const STROKE = '#9ca3af'; // primary line  (gray-400)
const FAINT = '#4b5563';  // secondary line (gray-600)
const ACCENT = '#3b82f6'; // blue-500
const FILL = '#0d0d0d';

/** Exact slider-crank: piston-pin x as a function of crank angle θ. */
function pistonPos(theta: number) {
  const s = R * Math.sin(theta);
  return CX + R * Math.cos(theta) + Math.sqrt(Math.max(0, L * L - s * s));
}

export function PhysicsFooter() {
  const svgRef = useRef<SVGSVGElement>(null);

  // Simulation state (refs → read by the rAF loop without re-binding)
  const angleRef = useRef(0);          // crank angle θ  (rad)
  const omegaRef = useRef(5);          // angular velocity ω (rad/s)
  const draggingRef = useRef(false);
  const throttleRef = useRef(false);
  const brakeRef = useRef(false);
  const lastPtrAngle = useRef(0);
  const lastMoveT = useRef(0);
  const rafRef = useRef<number>();

  const [angle, setAngle] = useState(0);
  const [rpm, setRpm] = useState(0);   // signed → sign encodes direction
  const [pedal, setPedal] = useState({ gas: false, brake: false }); // visual press state

  /* ── Physics / render loop ───────────────────────────────────────── */
  useEffect(() => {
    let lastT = performance.now();
    const loop = (t: number) => {
      let dt = (t - lastT) / 1000;
      lastT = t;
      dt = Math.min(dt, 0.05);

      let w = omegaRef.current;
      if (draggingRef.current) {
        // angle + ω are driven by the pointer-move handler
      } else if (throttleRef.current) {
        const TARGET = 28;                       // rad/s ≈ 270 rpm
        w += (TARGET - w) * Math.min(1, 2.4 * dt); // rev up toward target & hold
        omegaRef.current = w;
        angleRef.current += w * dt;
      } else if (brakeRef.current) {
        w *= Math.exp(-5 * dt);                  // hold to slow
        if (Math.abs(w) < 0.02) w = 0;
        omegaRef.current = w;
        angleRef.current += w * dt;
      } else {
        w *= Math.exp(-0.12 * dt);               // bearing drag (heavy flywheel)
        const c = 0.14 * dt;                     // dry friction → eventually stops
        if (w > c) w -= c;
        else if (w < -c) w += c;
        else w = 0;
        omegaRef.current = w;
        angleRef.current += w * dt;
      }

      setAngle(angleRef.current);
      setRpm((omegaRef.current * 60) / (2 * Math.PI));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    // safety: releasing the pointer anywhere lets go of the pedals
    const release = () => {
      throttleRef.current = false;
      brakeRef.current = false;
      setPedal({ gas: false, brake: false });
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
  }, []);

  /* ── Grab the flywheel and spin it ───────────────────────────────── */
  const toSvg = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (VBW / rect.width),
      y: (e.clientY - rect.top) * (VBH / rect.height),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const { x, y } = toSvg(e);
    if (Math.hypot(x - CX, y - CY) > FR + 26) return; // only the flywheel grabs
    draggingRef.current = true;
    omegaRef.current = 0;
    lastPtrAngle.current = Math.atan2(y - CY, x - CX);
    lastMoveT.current = performance.now();
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const { x, y } = toSvg(e);
    const a = Math.atan2(y - CY, x - CX);
    const now = performance.now();
    let dt = (now - lastMoveT.current) / 1000;
    if (dt <= 0) dt = 1 / 60;
    const diff = Math.atan2(
      Math.sin(a - lastPtrAngle.current),
      Math.cos(a - lastPtrAngle.current),
    );
    angleRef.current += diff;
    omegaRef.current = Math.max(-30, Math.min(30, (diff / dt) * 0.55 + omegaRef.current * 0.45));
    lastPtrAngle.current = a;
    lastMoveT.current = now;
    setAngle(angleRef.current);
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  // press-and-hold pedals
  const press = (which: 'gas' | 'brake') => (e: React.PointerEvent) => {
    (which === 'gas' ? throttleRef : brakeRef).current = true;
    setPedal((p) => ({ ...p, [which]: true }));
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch {}
  };
  const lift = (which: 'gas' | 'brake') => () => {
    (which === 'gas' ? throttleRef : brakeRef).current = false;
    setPedal((p) => ({ ...p, [which]: false }));
  };

  /* ── Derived geometry for this frame ─────────────────────────────── */
  const theta = angle;
  const angleDeg = (theta * 180) / Math.PI;
  const thetaDeg = (((angleDeg % 360) + 360) % 360);
  const crankPinX = CX + R * Math.cos(theta);
  const crankPinY = CY + R * Math.sin(theta);
  const pistonX = pistonPos(theta);

  const strokeFrac = (pistonX - PISTON_MIN) / (PISTON_MAX - PISTON_MIN); // 0 BDC → 1 TDC
  const speedFac = Math.min(1, Math.abs(rpm) / 60);
  const pistonFace = pistonX + PH;

  // Four-stroke cycle: one full cycle = 720° of crank (two revolutions).
  // θ=0 puts the piston at TDC, so each 180° sweep is one stroke.
  const cycleDeg = (((angleDeg % 720) + 720) % 720);
  const strokeIdx = Math.floor(cycleDeg / 180);           // 0..3
  const phase = ['INTAKE', 'COMPRESSION', 'POWER', 'EXHAUST'][strokeIdx];
  // Combustion flashes just after TDC, at the start of the power stroke only.
  const fire = strokeIdx === 2 ? Math.max(0, 1 - (cycleDeg - 360) / 70) * speedFac : 0;

  const spoke = (i: number) => {
    const a = (i * Math.PI) / 3;
    return { x2: CX + Math.cos(a) * (FR - 14), y2: CY + Math.sin(a) * (FR - 14) };
  };

  return (
    <section className="pt-12 pb-[300px] px-8 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 text-center">
            <h3 className="text-sm text-gray-500 uppercase tracking-wider">
              Interactive Physics Sandbox
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Single-cylinder engine — drag the flywheel, or hold throttle
            </p>
          </div>

          <div className="relative border border-gray-700 bg-black/30 overflow-hidden">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${VBW} ${VBH}`}
              className="w-full h-auto block touch-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onPointerCancel={endDrag}
            >
              {/* ── Ground ── */}
              <line x1="40" y1={GROUND} x2={VBW - 40} y2={GROUND} stroke={FAINT} strokeWidth="1.5" />
              {[...Array(20)].map((_, i) => (
                <line key={i} x1={56 + i * 36} y1={GROUND} x2={44 + i * 36} y2={GROUND + 9} stroke={FAINT} strokeWidth="1" />
              ))}

              {/* ── Crank pedestal ── */}
              <path
                d={`M ${CX - 70} ${GROUND} L ${CX - 34} ${CY + 8} L ${CX + 34} ${CY + 8} L ${CX + 70} ${GROUND}`}
                fill="none" stroke={FAINT} strokeWidth="1.5"
              />

              {/* ── Cylinder (drawn first; piston rides inside) ── */}
              {/* combustion flash */}
              <rect
                x={pistonFace} y={CY - BH}
                width={Math.max(0, CYL_HEAD - pistonFace)} height={BH * 2}
                fill={ACCENT} opacity={fire * 0.5}
              />
              {/* walls */}
              <line x1={CYL_L} y1={CY - BH - 4} x2={CYL_HEAD} y2={CY - BH - 4} stroke={STROKE} strokeWidth="2" />
              <line x1={CYL_L} y1={CY + BH + 4} x2={CYL_HEAD} y2={CY + BH + 4} stroke={STROKE} strokeWidth="2" />
              <line x1={CYL_HEAD} y1={CY - BH - 4} x2={CYL_HEAD} y2={CY + BH + 4} stroke={STROKE} strokeWidth="2" />
              {/* cooling fins */}
              {[...Array(5)].map((_, i) => (
                <g key={i} stroke={FAINT} strokeWidth="1.5">
                  <line x1={CYL_L + 30 + i * 42} y1={CY - BH - 4} x2={CYL_L + 30 + i * 42} y2={CY - BH - 16} />
                  <line x1={CYL_L + 30 + i * 42} y1={CY + BH + 4} x2={CYL_L + 30 + i * 42} y2={CY + BH + 16} />
                </g>
              ))}
              {/* spark plug */}
              <line x1={CYL_HEAD} y1={CY} x2={CYL_HEAD + 20} y2={CY} stroke={STROKE} strokeWidth="2" />
              <circle cx={CYL_HEAD - 8} cy={CY} r="4" fill={fire > 0.15 ? ACCENT : FAINT} />

              {/* ── Connecting rod ── */}
              <line x1={crankPinX} y1={crankPinY} x2={pistonX} y2={CY} stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" />

              {/* ── Piston (axis-aligned with the cylinder bore) ── */}
              <rect x={pistonX - PH} y={CY - BH} width={PH * 2} height={BH * 2} fill={FILL} stroke={STROKE} strokeWidth="2" />
              <line x1={pistonX + 12} y1={CY - BH} x2={pistonX + 12} y2={CY + BH} stroke={FAINT} strokeWidth="1.5" />
              <line x1={pistonX + 22} y1={CY - BH} x2={pistonX + 22} y2={CY + BH} stroke={FAINT} strokeWidth="1.5" />
              {/* wrist pin */}
              <circle cx={pistonX} cy={CY} r="7" fill={FILL} stroke={STROKE} strokeWidth="2" />

              {/* ── Flywheel (rotates with crank angle) ── */}
              <g transform={`rotate(${angleDeg} ${CX} ${CY})`}>
                <circle cx={CX} cy={CY} r={FR} fill={FILL} stroke={STROKE} strokeWidth="2" />
                <circle cx={CX} cy={CY} r={FR - 10} fill="none" stroke={FAINT} strokeWidth="1.5" />
                {[...Array(6)].map((_, i) => {
                  const s = spoke(i);
                  return <line key={i} x1={CX} y1={CY} x2={s.x2} y2={s.y2} stroke={FAINT} strokeWidth="2" />;
                })}
                {/* counterweight arc opposite the crank pin */}
                <path
                  d={`M ${CX - (FR - 24)} ${CY - 30} A ${FR - 24} ${FR - 24} 0 0 0 ${CX - (FR - 24)} ${CY + 30}`}
                  fill="none" stroke={FAINT} strokeWidth="6"
                />
                {/* crank throw + pin */}
                <line x1={CX} y1={CY} x2={CX + R} y2={CY} stroke={STROKE} strokeWidth="3" />
                <circle cx={CX + R} cy={CY} r="9" fill={FILL} stroke={STROKE} strokeWidth="2" />
                <circle cx={CX + R} cy={CY} r="3" fill={ACCENT} />
                {/* timing mark */}
                <line x1={CX + FR - 16} y1={CY} x2={CX + FR - 4} y2={CY} stroke={ACCENT} strokeWidth="3" />
              </g>
              {/* main bearing hub */}
              <circle cx={CX} cy={CY} r="13" fill={FILL} stroke={STROKE} strokeWidth="2" />
              <circle cx={CX} cy={CY} r="4" fill={ACCENT} />

              {/* ── Spec note ── */}
              <text x={CYL_L} y={CY + BH + 46} fill={FAINT} fontSize="11" fontFamily="monospace" letterSpacing="1">
                BORE 92 · STROKE 144 · ROD 350
              </text>
            </svg>

            {/* ── HUD: status (top-left) ── */}
            <div className="absolute top-3 left-3 text-xs font-mono text-gray-500 space-y-0.5 pointer-events-none">
              <div className="text-gray-400 tracking-wider">FOUR-STROKE CYCLE</div>
              <div>θ&nbsp;&nbsp;{thetaDeg.toFixed(0).padStart(3, '0')}°&nbsp;&nbsp;·&nbsp;&nbsp;CYCLE&nbsp;{cycleDeg.toFixed(0).padStart(3, '0')}°</div>
              <div>STROKE&nbsp;&nbsp;{strokeIdx + 1}/4</div>
              <div className="pt-1 space-y-0.5">
                {['INTAKE', 'COMPRESSION', 'POWER', 'EXHAUST'].map((s, i) => (
                  <div
                    key={s}
                    className={i === strokeIdx ? 'text-blue-400' : 'text-gray-700'}
                  >
                    {i === strokeIdx ? '▸ ' : '  '}
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* ── HUD: RPM (top-right) ── */}
            <div className="absolute top-3 right-4 text-right font-mono pointer-events-none">
              <div className="text-3xl text-white tabular-nums leading-none">{Math.abs(rpm).toFixed(0)}</div>
              <div className="text-xs text-gray-500 tracking-widest">
                RPM {rpm > 0.5 ? '↻' : rpm < -0.5 ? '↺' : '—'}
              </div>
            </div>

            {/* ── Hint (top-centre) ── */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-700 font-mono pointer-events-none hidden md:block">
              DRAG&nbsp;FLYWHEEL&nbsp;TO&nbsp;SPIN
            </div>

            {/* ── Pedal box (bottom-left, clear of the title block) ── */}
            <div className="absolute bottom-3 left-3 flex items-end gap-3 select-none">
              {/* Brake pedal — wide pad on an arm (left, as in a real footwell) */}
              <button
                aria-label="Brake"
                onPointerDown={press('brake')}
                onPointerUp={lift('brake')}
                onPointerLeave={lift('brake')}
                onPointerCancel={lift('brake')}
                onContextMenu={(e) => e.preventDefault()}
                className="group flex flex-col items-center gap-1 bg-transparent border-0 p-0 cursor-pointer"
              >
                <svg width="52" height="72" viewBox="0 0 52 72" className="overflow-visible">
                  {/* floor */}
                  <line x1="2" y1="70" x2="50" y2="70" stroke={FAINT} strokeWidth="1.5" />
                  <g
                    style={{ transformOrigin: '26px 68px', transformBox: 'view-box' }}
                    className="transition-transform duration-150"
                    transform={pedal.brake ? 'translate(0 7) scale(1 0.86)' : ''}
                  >
                    {/* arm */}
                    <line x1="26" y1="68" x2="26" y2="30" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
                    {/* pad */}
                    <rect
                      x="7" y="10" width="38" height="24" rx="4"
                      fill={pedal.brake ? '#1e3a5f' : FILL}
                      stroke={pedal.brake ? ACCENT : STROKE}
                      strokeWidth="2"
                      className="transition-colors duration-150"
                    />
                    {/* rubber grip ridges */}
                    {[16, 22, 28].map((y) => (
                      <line key={y} x1="12" y1={y} x2="40" y2={y} stroke={pedal.brake ? ACCENT : FAINT} strokeWidth="1.6" className="transition-colors duration-150" />
                    ))}
                  </g>
                </svg>
                <span className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${pedal.brake ? 'text-blue-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  Brake
                </span>
              </button>

              {/* Gas pedal — tall floor-hinged organ pedal (right) */}
              <button
                aria-label="Gas"
                onPointerDown={press('gas')}
                onPointerUp={lift('gas')}
                onPointerLeave={lift('gas')}
                onPointerCancel={lift('gas')}
                onContextMenu={(e) => e.preventDefault()}
                className="group flex flex-col items-center gap-1 bg-transparent border-0 p-0 cursor-pointer"
              >
                <svg width="34" height="72" viewBox="0 0 34 72" className="overflow-visible">
                  <line x1="2" y1="70" x2="32" y2="70" stroke={FAINT} strokeWidth="1.5" />
                  {/* hinge */}
                  <circle cx="17" cy="66" r="2.5" fill={FAINT} />
                  <g
                    style={{ transformOrigin: '17px 66px', transformBox: 'view-box' }}
                    className="transition-transform duration-150"
                    transform={pedal.gas ? 'scale(1 0.8) skewX(-4)' : ''}
                  >
                    <rect
                      x="6" y="8" width="22" height="58" rx="5"
                      fill={pedal.gas ? '#1e3a5f' : FILL}
                      stroke={pedal.gas ? ACCENT : STROKE}
                      strokeWidth="2"
                      className="transition-colors duration-150"
                    />
                    {/* tread ridges */}
                    {[16, 24, 32, 40, 48, 56].map((y) => (
                      <line key={y} x1="10" y1={y} x2="24" y2={y} stroke={pedal.gas ? ACCENT : FAINT} strokeWidth="1.6" className="transition-colors duration-150" />
                    ))}
                  </g>
                </svg>
                <span className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${pedal.gas ? 'text-blue-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  Gas
                </span>
              </button>
            </div>
          </div>

          {/* ── Footer copyright ── */}
          <div className="mt-4 text-xs text-gray-600 font-mono">
            © 2026 Rohan Singh · Mechanical Engineering Portfolio
          </div>
        </motion.div>
      </div>
    </section>
  );
}
