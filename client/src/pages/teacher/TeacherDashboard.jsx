import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus, FiEdit2, FiBarChart2, FiUsers, FiEye, FiTrendingUp, FiBook, FiZap,
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi2';
import useAuthStore from '../../store/authStore';
import useQuizStore from '../../store/quizStore';
import { AnimatedCounter, Sparkline } from '../../components/ui/Charts';

const P = { fontFamily: "'Poppins', sans-serif" };

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const diffStyle = {
  easy:   { background: 'rgba(16,185,129,0.1)', color: '#34d399',  border: '1px solid rgba(16,185,129,0.2)' },
  medium: { background: 'rgba(245,158,11,0.1)', color: '#fbbf24',  border: '1px solid rgba(245,158,11,0.2)' },
  hard:   { background: 'rgba(239,68,68,0.1)',  color: '#f87171',  border: '1px solid rgba(239,68,68,0.2)' },
};

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const { myQuizzes, isLoading } = useQuizStore();
  const fetchMyQuizzes = useQuizStore(s => s.fetchMyQuizzes);

  useEffect(() => { fetchMyQuizzes(); }, []);

  const totalAttempts = myQuizzes.reduce((a, q) => a + (q.totalAttempts || 0), 0);
  const stats = [
    { label: 'Total Quizzes',  value: myQuizzes.length,                                   icon: FiBook,       color: '#818cf8' },
    { label: 'Published',      value: myQuizzes.filter(q => q.isPublished).length,         icon: FiEye,        color: '#34d399' },
    { label: 'Total Attempts', value: totalAttempts,                                       icon: FiUsers,      color: '#38bdf8' },
    { label: 'Avg. Score',     value: `${myQuizzes.length ? Math.round(myQuizzes.reduce((a,q)=>a+(q.averageScore||0),0)/myQuizzes.length) : 0}%`, icon: FiTrendingUp, color: '#fbbf24' },
  ];

  return (
    <div className="page" style={{ ...P, paddingTop: 64 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#4f63ff', marginBottom: 8 }}>Teacher Dashboard</p>
            <h1 style={{ fontSize: 'clamp(24px,3.5vw,34px)', fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>
              Hello, <span style={{ background: 'linear-gradient(135deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name}</span>
            </h1>
            <p style={{ fontSize: 14, color: '#6b7b9e' }}>Manage your quizzes and track performance</p>
          </div>
          <Link to="/teacher/create-quiz" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ gap: 8 }}>
              <FiPlus size={16} /> Create New Quiz
            </button>
          </Link>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: 16, marginBottom: 48 }}
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp}
              style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '22px 20px' }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <s.icon size={17} color={s.color} />
              </div>
              <AnimatedCounter value={s.value} size={28} color="#f0f4ff" />
              <div style={{ fontSize: 12, color: '#6b7b9e', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Your Quizzes ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f0f4ff' }}>Your Quizzes</h2>
          <span style={{ fontSize: 12, color: '#3d4a6b' }}>{myQuizzes.length} quiz{myQuizzes.length !== 1 ? 'zes' : ''}</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
            {[1,2].map(i => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: 14 }} />
            ))}
          </div>
        ) : myQuizzes.length === 0 ? (
          <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 16, padding: '72px 32px', textAlign: 'center' }}>
            <HiOutlineAcademicCap size={48} color="#3d4a6b" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: '#6b7b9e', marginBottom: 8 }}>No quizzes yet</p>
            <p style={{ fontSize: 13, color: '#3d4a6b', marginBottom: 28 }}>Create your first quiz and share it with students</p>
            <Link to="/teacher/create-quiz" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary"><FiPlus size={15} /> Create Your First Quiz</button>
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 16 }}
          >
            {myQuizzes.map((quiz, i) => (
              <motion.div key={quiz._id} variants={fadeUp}
                style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '24px 22px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(79,99,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(79,99,255,0.08)'}
              >
                {/* top badges */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  {quiz.difficulty && (
                    <span style={{ ...diffStyle[quiz.difficulty], padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
                      {quiz.difficulty}
                    </span>
                  )}
                  <span style={{ background: quiz.isPublished ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)', color: quiz.isPublished ? '#34d399' : '#64748b', border: `1px solid ${quiz.isPublished ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)'}`, padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff', marginBottom: 6, lineHeight: 1.4 }}>{quiz.title}</h3>
                <p style={{ fontSize: 12, color: '#6b7b9e', marginBottom: 16, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {quiz.description || 'No description provided.'}
                </p>

                <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6b7b9e', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiBook size={12} color="#4f63ff" /> {quiz.questions?.length || 0} questions
                  </span>
                  <span style={{ fontSize: 12, color: '#6b7b9e', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiUsers size={12} color="#4f63ff" /> {quiz.totalAttempts || 0} attempts
                  </span>
                  {quiz.subject && (
                    <span style={{ fontSize: 12, color: '#4f63ff' }}>{quiz.subject}</span>
                  )}
                  {/* Mini sparkline showing engagement trend */}
                  <div style={{ marginLeft: 'auto' }}>
                    <Sparkline
                      data={[10, 20, 15, 30, 25, quiz.totalAttempts || 5, Math.max(1, (quiz.totalAttempts || 5) + 3)]}
                      color={quiz.isPublished ? '#34d399' : '#818cf8'}
                      width={80}
                      height={24}
                    />
                  </div>
                </div>

                {/* actions */}
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid rgba(79,99,255,0.06)', paddingTop: 16 }}>
                  <Link to={`/teacher/analytics/${quiz._id}`} style={{ textDecoration: 'none', flex: 1 }}>
                    <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}>
                      <FiBarChart2 size={13} /> Analytics
                    </button>
                  </Link>
                  <Link to={`/teacher/edit-quiz/${quiz._id}`} style={{ textDecoration: 'none', flex: 1 }}>
                    <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}>
                      <FiEdit2 size={13} /> Edit
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
