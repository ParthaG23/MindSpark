import { motion } from 'framer-motion';

const GlassCard = ({ children, style = {}, hover = true, onClick }) => (
  <motion.div
    onClick={onClick}
    style={{
      background: '#0c0e1a',
      border: '1px solid rgba(79,99,255,0.08)',
      borderRadius: 16,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
    whileHover={hover ? { borderColor: 'rgba(79,99,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)', y: -2 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
  >
    {children}
  </motion.div>
);

export default GlassCard;
