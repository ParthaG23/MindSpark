import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

const Timer = ({ totalSeconds, onTimerEnd, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const intervalRef = useRef(null);

  useEffect(() => { setTimeLeft(totalSeconds); }, [totalSeconds]);

  useEffect(() => {
    if (isPaused) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); onTimerEnd?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, onTimerEnd]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / totalSeconds) * 100;
  const isWarning  = progress < 25;
  const isCritical = progress < 10;

  const color   = isCritical ? '#f87171' : isWarning ? '#fbbf24' : '#818cf8';
  const bgColor = isCritical ? 'rgba(239,68,68,0.1)' : isWarning ? 'rgba(245,158,11,0.1)' : 'rgba(79,99,255,0.08)';
  const border  = isCritical ? '1px solid rgba(239,68,68,0.25)' : isWarning ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(79,99,255,0.15)';

  return (
    <motion.div
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 14px', borderRadius: 10,
        background: bgColor, border,
        fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15,
        color, letterSpacing: '0.02em',
        transition: 'all 0.3s ease',
      }}
      animate={isCritical ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 0.6, repeat: isCritical ? Infinity : 0 }}
    >
      <FiClock size={15} />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </motion.div>
  );
};

export default Timer;
