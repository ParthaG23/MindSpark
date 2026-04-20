import { motion } from 'framer-motion';

/* ── Animated Donut Chart ──────────────────────────────────────
   Usage: <DonutChart percentage={75} size={120} color="#34d399" />
   ─────────────────────────────────────────────────────────── */
export function DonutChart({ percentage = 0, size = 120, strokeWidth = 10, color = '#4f63ff', label, sublabel }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background ring */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#111326" strokeWidth={strokeWidth} />
        {/* Animated progress ring */}
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
        {/* Center text */}
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fill: '#f0f4ff', fontSize: size * 0.22, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}
        >
          {percentage}%
        </text>
      </svg>
      {label && <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f4ff' }}>{label}</span>}
      {sublabel && <span style={{ fontSize: 11, color: '#6b7b9e' }}>{sublabel}</span>}
    </div>
  );
}

/* ── Animated Bar Chart ────────────────────────────────────────
   Usage: <BarChart data={[{label:'A', value:80, color:'#34d399'}]} />
   ─────────────────────────────────────────────────────────── */
export function BarChart({ data = [], height = 180, barWidth = 32 }) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, height, paddingBottom: 28, position: 'relative' }}>
      {/* Horizontal grid lines */}
      {[0, 25, 50, 75, 100].map(v => (
        <div key={v} style={{
          position: 'absolute', left: 0, right: 0,
          bottom: 28 + ((v / 100) * (height - 28)),
          borderBottom: '1px solid rgba(79,99,255,0.04)',
        }} />
      ))}

      {data.map((d, i) => {
        const barH = Math.max(4, (d.value / max) * (height - 40));
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1 }}>
            <motion.div
              style={{ width: barWidth, borderRadius: 6, background: d.color || '#4f63ff', position: 'relative' }}
              initial={{ height: 0 }}
              animate={{ height: barH }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            >
              {/* Value tooltip */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                style={{
                  position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 11, fontWeight: 700, color: d.color || '#4f63ff',
                  fontFamily: "'Poppins',sans-serif", whiteSpace: 'nowrap',
                }}
              >
                {d.value}{d.suffix || '%'}
              </motion.span>
            </motion.div>
            <span style={{ fontSize: 11, color: '#6b7b9e', fontFamily: "'Poppins',sans-serif", fontWeight: 500, textAlign: 'center', maxWidth: barWidth + 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Animated Mini Sparkline ────────────────────────────────── */
export function Sparkline({ data = [], color = '#4f63ff', width = 120, height = 40 }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <motion.polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-${color.replace('#','')})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      {/* Line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Endpoint dot */}
      <motion.circle
        cx={width} cy={height - ((data[data.length-1] - min) / range) * (height - 4) - 2}
        r={3} fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      />
    </svg>
  );
}

/* ── Animated Hero Illustration ─────────────────────────────── */
export function HeroIllustration() {
  const cardStyle = {
    background: '#0c0e1a',
    border: '1px solid rgba(79,99,255,0.12)',
    borderRadius: 14,
    padding: '16px 18px',
    fontFamily: "'Poppins',sans-serif",
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 420, margin: '0 auto' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,99,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Quiz card mock */}
      <motion.div
        initial={{ opacity: 0, y: 32, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...cardStyle, position: 'relative', zIndex: 2 }}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <span style={{ padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: 'rgba(79,99,255,0.1)', color: '#818cf8', border: '1px solid rgba(79,99,255,0.15)' }}>MCQ</span>
          <span style={{ padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.15)' }}>Medium</span>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ff', marginBottom: 16 }}>What is the time complexity of binary search?</p>

        {/* Options */}
        {[
          { text: 'O(n)', selected: false },
          { text: 'O(log n)', selected: true },
          { text: 'O(n²)', selected: false },
          { text: 'O(1)', selected: false },
        ].map((opt, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 8, marginBottom: 6,
              background: opt.selected ? 'rgba(79,99,255,0.1)' : '#111326',
              border: `1px solid ${opt.selected ? 'rgba(79,99,255,0.3)' : 'rgba(79,99,255,0.05)'}`,
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: opt.selected ? '#4f63ff' : 'rgba(79,99,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: opt.selected ? '#fff' : '#6b7b9e',
            }}>
              {opt.selected ? '✓' : String.fromCharCode(65 + i)}
            </div>
            <span style={{ fontSize: 13, color: opt.selected ? '#f0f4ff' : '#6b7b9e' }}>{opt.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating score card */}
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 180 }}
        style={{
          position: 'absolute', top: -16, right: -24, zIndex: 3,
          background: '#0c0e1a', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 12, padding: '12px 16px', textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <p style={{ fontSize: 22, fontWeight: 800, color: '#34d399', letterSpacing: '-0.02em' }}>92%</p>
        <p style={{ fontSize: 10, color: '#6b7b9e', fontWeight: 500 }}>Score</p>
      </motion.div>

      {/* Floating timer */}
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 1.3, type: 'spring', stiffness: 180 }}
        style={{
          position: 'absolute', bottom: 20, left: -20, zIndex: 3,
          background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.15)',
          borderRadius: 10, padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f63ff', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#818cf8', fontFamily: "'Poppins',sans-serif" }}>04:32</span>
      </motion.div>
    </div>
  );
}

/* ── Animated Counter ──────────────────────────────────────── */
export function AnimatedCounter({ value, duration = 1.5, suffix = '', color = '#f0f4ff', size = 28 }) {
  return (
    <motion.span
      style={{ fontSize: size, fontWeight: 700, color, letterSpacing: '-0.02em', fontFamily: "'Poppins',sans-serif" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value}{suffix}
      </motion.span>
    </motion.span>
  );
}
