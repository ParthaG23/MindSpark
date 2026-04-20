import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZap, FiArrowRight, FiBarChart2, FiUsers, FiAward } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineSparkles } from 'react-icons/hi';
import { HeroIllustration } from '../components/ui/Charts';

const features = [
  { icon: HiOutlineAcademicCap, title: 'Smart Quiz Builder',  desc: 'MCQ and True/False questions, custom point systems, and adjustable time limits.' },
  { icon: FiBarChart2,          title: 'Deep Analytics',      desc: 'Per-question accuracy, score distributions, and student activity in one place.' },
  { icon: FiAward,              title: 'Live Leaderboards',   desc: 'Auto-graded results, time-based ranking, and beautiful result breakdowns.' },
  { icon: FiUsers,              title: 'Role-Based Access',   desc: 'Separate Teacher and Student dashboards with JWT auth and protected routes.' },
];

const stats = [
  { v: '10K+', l: 'Quizzes' },
  { v: '50K+', l: 'Students' },
  { v: '12+',  l: 'Subjects' },
  { v: '98%',  l: 'Satisfaction' },
];

const steps = [
  { n: '01', t: 'Sign up',         d: 'Create a free account as a Teacher or Student in under 60 seconds.' },
  { n: '02', t: 'Build or Browse', d: 'Teachers build timed quizzes. Students discover them by subject and difficulty.' },
  { n: '03', t: 'Learn & Compete', d: 'Take quizzes, review answers in depth, and climb the leaderboard.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

/* shared section wrapper */
const Section = ({ children, style = {} }) => (
  <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', ...style }}>
    {children}
  </section>
);

/* section eyebrow label */
const EyeBrow = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4f63ff', marginBottom: 12 }}>
    {children}
  </p>
);

export default function Landing() {
  return (
    <div className="page grid-bg" style={{ fontFamily: "'Poppins',sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ paddingTop: 130, paddingBottom: 80 }}>
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 48, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>

              {/* badge */}
              <div style={{ display: 'flex', marginBottom: 32 }}>
                <span className="badge badge-indigo">
                  <HiOutlineSparkles size={14} />
                  Quizzes re-imagined for modern learning
                </span>
              </div>

              {/* headline */}
              <h1 style={{ fontSize: 'clamp(36px,5vw,68px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, color: '#f0f4ff' }}>
                The quiz platform<br />
                <span className="text-gradient">built to impress.</span>
              </h1>

              {/* subtext */}
              <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#6b7b9e', maxWidth: 520, marginBottom: 44, lineHeight: 1.7 }}>
                Teachers build rich, timed assessments. Students compete, review, and grow —
                inside a platform that actually looks good.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <motion.button className="btn btn-primary btn-lg" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    Get started free <FiArrowRight size={18} />
                  </motion.button>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <motion.button className="btn btn-ghost btn-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    Sign in
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </Section>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section style={{ paddingBottom: 80 }}>
        <Section>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ gap: 16 }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontSize: 'clamp(28px,3vw,36px)', fontWeight: 800, color: '#f0f4ff', letterSpacing: '-0.03em' }}>{s.v}</div>
                <div style={{ fontSize: 13, color: '#3d4a6b', fontWeight: 500, marginTop: 6 }}>{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section style={{ paddingBottom: 80 }}>
        <Section>
          <motion.div style={{ marginBottom: 48 }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <EyeBrow>Features</EyeBrow>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#f0f4ff', lineHeight: 1.15 }}>
              Everything you need,<br />nothing you don't.
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 16 }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="card" style={{ padding: '32px 28px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(79,99,255,0.1)', border: '1px solid rgba(79,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon size={22} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0f4ff', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7b9e', lineHeight: 1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ paddingBottom: 80 }}>
        <Section>
          <motion.div style={{ marginBottom: 48 }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <EyeBrow>How it works</EyeBrow>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#f0f4ff', lineHeight: 1.15 }}>
              Start in three steps.
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                style={{
                  display: 'flex', gap: 24, alignItems: 'flex-start',
                  padding: '28px 0',
                  borderBottom: i < steps.length - 1 ? '1px solid rgba(79,99,255,0.07)' : 'none',
                }}
              >
                <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 11, border: '1px solid rgba(79,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily:"'Poppins',sans-serif", fontWeight: 800, fontSize: 14, color: '#4f63ff', background: 'rgba(79,99,255,0.05)' }}>
                  {s.n}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0f4ff', marginBottom: 8 }}>{s.t}</h3>
                  <p style={{ fontSize: 14, color: '#6b7b9e', lineHeight: 1.65, maxWidth: 560 }}>{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ paddingBottom: 100 }}>
        <Section>
          <motion.div
            style={{ position: 'relative', background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.1)', borderRadius: 24, padding: 'clamp(48px,8vw,80px) 32px', textAlign: 'center', overflow: 'hidden' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 400, height: 250, background: 'radial-gradient(circle,rgba(79,99,255,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <FiZap size={36} color="#4f63ff" style={{ marginBottom: 20, opacity: 0.8 }} />
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#f0f4ff', marginBottom: 16, lineHeight: 1.15 }}>
              Ready to spark curiosity?
            </h2>
            <p style={{ fontSize: 16, color: '#6b7b9e', maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.65 }}>
              Sign up free. Create your first quiz in minutes. No credit card required.
            </p>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <motion.button className="btn btn-primary btn-lg" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Create free account <FiArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </Section>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(79,99,255,0.07)', maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, overflow: 'hidden', boxShadow: '0 2px 14px rgba(79,99,255,0.25)' }}>
              <img src="/logo.png" alt="MindSpark" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: '#f0f4ff' }}>MindSpark</span>
          </div>
          <p style={{ fontSize: 13, color: '#3d4a6b' }}>© {new Date().getFullYear()} MindSpark. Built for education.</p>
        </div>
      </footer>
    </div>
  );
}
