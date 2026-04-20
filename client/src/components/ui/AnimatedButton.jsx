import { motion } from 'framer-motion';

const styles = {
  primary: {
    background: '#4f63ff',
    color: '#fff',
    border: 'none',
    boxShadow: '0 2px 16px rgba(79,99,255,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  secondary: {
    background: 'rgba(79,99,255,0.08)',
    color: '#818cf8',
    border: '1px solid rgba(79,99,255,0.2)',
  },
  ghost: {
    background: 'transparent',
    color: '#6b7b9e',
    border: '1px solid rgba(79,99,255,0.1)',
  },
  danger: {
    background: 'rgba(239,68,68,0.1)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.2)',
  },
  success: {
    background: 'rgba(16,185,129,0.1)',
    color: '#34d399',
    border: '1px solid rgba(16,185,129,0.2)',
  },
};

const sizes = {
  sm: { padding: '6px 14px', fontSize: 12, borderRadius: 8 },
  md: { padding: '9px 18px', fontSize: 13, borderRadius: 10 },
  lg: { padding: '13px 26px', fontSize: 15, borderRadius: 12 },
};

const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  onClick,
  style: extraStyle = {},
}) => {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.5 : 1,
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    ...styles[variant],
    ...sizes[size],
    ...extraStyle,
  };

  return (
    <motion.button
      type={type}
      style={base}
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style={{ opacity: 0.75 }} />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      ) : null}
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
