import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiZap, FiArrowRight } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineBookOpen } from 'react-icons/hi2';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) { toast.error('Please select your role'); return; }
    try {
      const data = await register(form);
      toast.success('Account created!');
      navigate(data.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err) { toast.error(err.message); }
  };

  const roles = [
    { value: 'teacher', label: 'Teacher', icon: HiOutlineAcademicCap, desc: 'Create & manage quizzes' },
    { value: 'student', label: 'Student', icon: HiOutlineBookOpen,    desc: 'Discover & take quizzes' },
  ];

  const s = {
    page: { minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 20px 40px', fontFamily: "'Poppins',sans-serif", position: 'relative' },
    glow: { position: 'fixed', top: '20%', right: '30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 },
    wrap: { width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 },
    card: { background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.1)', borderRadius: 20, padding: '36px 32px' },
    head: { textAlign: 'center', marginBottom: 30 },
    icon: { width: 48, height: 48, borderRadius: 13, overflow: 'hidden', margin: '0 auto 18px', boxShadow: '0 4px 20px rgba(79,99,255,0.3)' },
    h1: { fontSize: 24, fontWeight: 700, color: '#f0f4ff', marginBottom: 8 },
    sub: { fontSize: 13, color: '#6b7b9e' },
    form: { display: 'flex', flexDirection: 'column', gap: 18 },
    field: { display: 'flex', flexDirection: 'column' },
    inputWrap: { position: 'relative' },
    eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#6b7b9e', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    footer: { marginTop: 24, textAlign: 'center', fontSize: 13, color: '#6b7b9e' },
    link: { color: '#4f63ff', textDecoration: 'none', fontWeight: 600 },
    iconSpan: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3d4a6b', display: 'flex', alignItems: 'center' },
  };

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <motion.div style={s.wrap} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div style={s.card}>
          {/* Header */}
          <div style={s.head}>
            <motion.div style={s.icon} initial={{ scale: 0.6, rotate: 20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, delay: 0.1 }}>
              <img src="/logo.png" alt="MindSpark" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
            <h1 style={s.h1}>Create your account</h1>
            <p style={s.sub}>Join MindSpark and start your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={s.form}>
            {/* Role selector */}
            <div>
              <span className="label">I am a</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {roles.map(r => {
                  const sel = form.role === r.value;
                  return (
                    <motion.button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 14px',
                        borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                        background: sel ? 'rgba(79,99,255,0.1)' : '#111326',
                        border: `1.5px solid ${sel ? 'rgba(79,99,255,0.4)' : 'rgba(79,99,255,0.08)'}`,
                        boxShadow: sel ? '0 0 20px rgba(79,99,255,0.08)' : 'none',
                      }}
                    >
                      <r.icon size={22} color={sel ? '#818cf8' : '#6b7b9e'} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: sel ? '#f0f4ff' : '#a8b2d8' }}>{r.label}</span>
                      <span style={{ fontSize: 11, color: '#6b7b9e', lineHeight: 1.4 }}>{r.desc}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div style={s.field}>
              <span className="label">Full name</span>
              <div style={s.inputWrap}>
                <span style={s.iconSpan}><FiUser size={16} /></span>
                <input className="input" type="text" required placeholder="Alex Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            <div style={s.field}>
              <span className="label">Email address</span>
              <div style={s.inputWrap}>
                <span style={s.iconSpan}><FiMail size={16} /></span>
                <input className="input" type="email" required placeholder="you@school.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div style={s.field}>
              <span className="label">Password</span>
              <div style={s.inputWrap}>
                <span style={s.iconSpan}><FiLock size={16} /></span>
                <input className="input" type={showPass ? 'text' : 'password'} required placeholder="Min. 6 characters" minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 44 }} />
                <button type="button" style={s.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {isLoading ? 'Creating account…' : <><span>Create account</span><FiArrowRight size={16} /></>}
            </motion.button>
          </form>

          <div style={s.footer}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
