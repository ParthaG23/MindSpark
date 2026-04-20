import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiZap, FiArrowRight } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err) { toast.error(err.message); }
  };

  const s = {
    page: { minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 40px', fontFamily: "'Poppins',sans-serif", position: 'relative' },
    glow: { position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,99,255,0.08) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 },
    wrap: { width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 },
    card: { background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.1)', borderRadius: 20, padding: '40px 36px' },
    head: { textAlign: 'center', marginBottom: 36 },
    icon: { width: 50, height: 50, borderRadius: 14, overflow: 'hidden', margin: '0 auto 20px', boxShadow: '0 4px 20px rgba(79,99,255,0.3)' },
    h1: { fontSize: 26, fontWeight: 700, color: '#f0f4ff', marginBottom: 8 },
    sub: { fontSize: 14, color: '#6b7b9e' },
    form: { display: 'flex', flexDirection: 'column', gap: 20 },
    field: { display: 'flex', flexDirection: 'column', gap: 0 },
    inputWrap: { position: 'relative' },
    eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#6b7b9e', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    footer: { marginTop: 24, textAlign: 'center', fontSize: 13, color: '#6b7b9e' },
    link: { color: '#4f63ff', textDecoration: 'none', fontWeight: 600 },
  };

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <motion.div style={s.wrap} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div style={s.card}>
          {/* Header */}
          <div style={s.head}>
            <motion.div style={s.icon} initial={{ scale: 0.6, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, delay: 0.1 }}>
              <img src="/logo.png" alt="MindSpark" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
            <h1 style={s.h1}>Welcome back</h1>
            <p style={s.sub}>Sign in to continue to MindSpark</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <span className="label">Email address</span>
              <div style={s.inputWrap}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3d4a6b', display: 'flex', alignItems: 'center' }}>
                  <FiMail size={16} />
                </span>
                <input className="input" type="email" required placeholder="you@school.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div style={s.field}>
              <span className="label">Password</span>
              <div style={s.inputWrap}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3d4a6b', display: 'flex', alignItems: 'center' }}>
                  <FiLock size={16} />
                </span>
                <input className="input" type={showPass ? 'text' : 'password'} required placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 44 }} />
                <button type="button" style={s.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {isLoading ? 'Signing in…' : <><span>Sign in</span><FiArrowRight size={16} /></>}
            </motion.button>
          </form>

          <div style={s.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={s.link}>Create one</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
