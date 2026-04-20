import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiZap } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineBookOpen } from 'react-icons/hi2';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/'); setOpen(false); };

  const links = user
    ? user.role === 'teacher'
      ? [
          { to: '/teacher/dashboard',   label: 'Dashboard',    icon: HiOutlineAcademicCap },
          { to: '/teacher/create-quiz', label: 'Create Quiz',  icon: FiZap },
        ]
      : [
          { to: '/student/dashboard', label: 'Dashboard',      icon: HiOutlineBookOpen },
          { to: '/student/browse',    label: 'Browse Quizzes', icon: HiOutlineAcademicCap },
        ]
    : [];

  const isActive = (p) => location.pathname === p;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      fontFamily: "'Poppins', sans-serif",
    }}>
      {/* Main bar */}
      <div style={{
        height: 64,
        background: 'rgba(5,5,16,0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(79,99,255,0.09)',
      }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto', height: '100%',
          padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>

          {/* ── Logo ── */}
          <Link
            to={user ? (user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard') : '/'}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 14px rgba(79,99,255,0.2)'
            }}>
              <img src="/logo.png" alt="MindSpark Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#f0f4ff', letterSpacing: '-0.01em' }}>
              MindSpark
            </span>
          </Link>

          {/* ── Desktop centre links — hidden on mobile via .nav-desktop ── */}
          <div className="nav-desktop" style={{ gap: 2, flex: 1, justifyContent: 'center' }}>
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 8,
                  textDecoration: 'none', fontSize: 13, fontWeight: 500,
                  color: isActive(l.to) ? '#818cf8' : '#6b7b9e',
                  background: isActive(l.to) ? 'rgba(79,99,255,0.08)' : 'transparent',
                  border: `1px solid ${isActive(l.to) ? 'rgba(79,99,255,0.15)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
              >
                <l.icon size={15} />
                {l.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop right actions — hidden on mobile via .nav-desktop ── */}
          <div className="nav-desktop" style={{ gap: 8, flexShrink: 0 }}>
            {user ? (
              <>
                {/* Avatar pill */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '5px 12px 5px 6px', borderRadius: 10,
                  background: 'rgba(12,14,26,0.9)',
                  border: '1px solid rgba(79,99,255,0.09)',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: 'linear-gradient(135deg,#4f63ff,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ lineHeight: 1.3 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: '#4f63ff', textTransform: 'capitalize' }}>{user.role}</div>
                  </div>
                </div>

                {/* Logout icon button */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  style={{
                    width: 34, height: 34,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 8, border: '1px solid rgba(79,99,255,0.09)',
                    background: 'transparent', cursor: 'pointer', color: '#6b7b9e',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#f87171';
                    e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)';
                    e.currentTarget.style.background = 'rgba(239,68,68,0.07)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#6b7b9e';
                    e.currentTarget.style.borderColor = 'rgba(79,99,255,0.09)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <FiLogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    fontSize: 13, fontWeight: 500, color: '#6b7b9e',
                    textDecoration: 'none', padding: '7px 14px', borderRadius: 8,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f0f4ff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7b9e'}
                >
                  Log in
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>
                    Get started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* ── Hamburger — only on mobile via .nav-mobile-btn ── */}
          <button
            className="nav-mobile-btn"
            onClick={() => setOpen(!open)}
            style={{
              width: 36, height: 36,
              borderRadius: 8, border: 'none',
              background: 'rgba(79,99,255,0.07)',
              cursor: 'pointer', color: '#a8b2d8',
              flexShrink: 0,
            }}
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, display: 'block' }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'rgba(5,5,16,0.97)',
              borderBottom: '1px solid rgba(79,99,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '8px 16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Nav links */}
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 10,
                    textDecoration: 'none', fontSize: 14, fontWeight: 500,
                    color: isActive(l.to) ? '#818cf8' : '#6b7b9e',
                    background: isActive(l.to) ? 'rgba(79,99,255,0.09)' : 'transparent',
                  }}
                >
                  <l.icon size={18} />
                  {l.label}
                </Link>
              ))}

              {user ? (
                <>
                  {/* User info row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px',
                    borderTop: '1px solid rgba(79,99,255,0.07)',
                    marginTop: 4,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'linear-gradient(135deg,#4f63ff,#8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: '#fff',
                    }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ lineHeight: 1.3 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: '#4f63ff', textTransform: 'capitalize' }}>{user.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 14px', borderRadius: 10,
                      border: 'none', background: 'transparent',
                      cursor: 'pointer', fontSize: 14, fontWeight: 500,
                      color: '#f87171', width: '100%',
                    }}
                  >
                    <FiLogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 10,
                  paddingTop: 12, marginTop: 8,
                  borderTop: '1px solid rgba(79,99,255,0.07)',
                }}>
                  <Link to="/login" onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}>
                    <button className="btn btn-ghost" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
                      Log in
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
                      Get started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
