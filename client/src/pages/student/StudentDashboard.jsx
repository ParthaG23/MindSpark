import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiAward, FiTrendingUp, FiBookOpen, FiBarChart2, FiArrowRight, FiClock,
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import useResultStore from '../../store/resultStore';
import AnimatedButton from '../../components/ui/AnimatedButton';
import { DonutChart, BarChart, AnimatedCounter } from '../../components/ui/Charts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const P = { fontFamily: "'Poppins',sans-serif" };

const diffColor = { easy: '#34d399', medium: '#fbbf24', hard: '#f87171' };

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '24px 20px', ...P }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
      <Icon size={18} color={color} />
    </div>
    <AnimatedCounter value={value} size={28} color="#f0f4ff" />
    <div style={{ fontSize: 12, color: '#6b7b9e', fontWeight: 500, marginTop: 4 }}>{label}</div>
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { studentStats, fetchStudentStats, isLoading } = useResultStore();

  useEffect(() => { fetchStudentStats(); }, []);

  const stats = studentStats;

  return (
    <div className="page" style={{ ...P, paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4f63ff', marginBottom: 8 }}>Student Hub</p>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>
            Welcome back, <span style={{ background: 'linear-gradient(135deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name}</span>
          </h1>
          <p style={{ fontSize: 14, color: '#6b7b9e' }}>Track your progress and discover new quizzes</p>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: 16, marginBottom: 48 }}
          variants={stagger} initial="hidden" animate="show"
        >
          {[
            { label: 'Quizzes Taken',    value: stats?.totalQuizzes || 0,          icon: FiBookOpen,   color: '#818cf8' },
            { label: 'Average Score',   value: `${stats?.averageScore || 0}%`,     icon: FiTrendingUp, color: '#a78bfa' },
            { label: 'Best Score',      value: `${stats?.bestScore || 0}%`,        icon: FiAward,      color: '#34d399' },
            { label: 'Subjects Covered',value: stats?.subjectStats?.length || 0,  icon: FiBarChart2,  color: '#fbbf24' },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 24 }}>

          {/* Subject Performance */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Performance Overview</p>

            {/* Average Score Donut */}
            {stats && (
              <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '24px 20px', marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <DonutChart
                  percentage={stats.averageScore || 0}
                  size={100}
                  strokeWidth={9}
                  color={stats.averageScore >= 70 ? '#34d399' : stats.averageScore >= 40 ? '#fbbf24' : '#f87171'}
                  label="Average Score"
                />
                <p style={{ fontSize: 12, color: '#3d4a6b' }}>{stats.totalQuizzes || 0} quizzes taken</p>
              </div>
            )}

            {/* Subject Performance Bar Chart */}
            {stats?.subjectStats?.length > 0 ? (
              <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '20px 20px' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#a8b2d8', marginBottom: 16 }}>By Subject</p>
                <BarChart
                  height={160}
                  barWidth={Math.min(40, Math.max(24, 220 / (stats.subjectStats.length || 1)))}
                  data={stats.subjectStats.map((s) => ({
                    label: s.subject.length > 6 ? s.subject.slice(0, 6) + '…' : s.subject,
                    value: s.average,
                    color: s.average >= 70 ? '#34d399' : s.average >= 40 ? '#fbbf24' : '#f87171',
                  }))}
                />
              </div>
            ) : (
              <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: 40, textAlign: 'center' }}>
                <FiBarChart2 size={32} color="#3d4a6b" style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 13, color: '#3d4a6b' }}>Take quizzes to see your data</p>
              </div>
            )}
          </motion.div>

          {/* Recent Results */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff' }}>Recent Results</p>
              <Link to="/student/browse" style={{ textDecoration: 'none' }}>
                <AnimatedButton variant="secondary" size="sm" icon={FiArrowRight}>Browse Quizzes</AnimatedButton>
              </Link>
            </div>

            {stats?.recentResults?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.recentResults.map((r, i) => {
                  const pct = r.percentage;
                  const c = pct >= 70 ? '#34d399' : pct >= 40 ? '#fbbf24' : '#f87171';
                  return (
                    <motion.div key={r._id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link to={`/student/result/${r._id}`} style={{ textDecoration: 'none' }}>
                        <div
                          style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, cursor: 'pointer', transition: 'border-color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(79,99,255,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(79,99,255,0.08)'}
                        >
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ff', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {r.quiz?.title || 'Quiz'}
                            </p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <span className="badge badge-indigo" style={{ fontSize: 11 }}>{r.quiz?.subject}</span>
                              {r.quiz?.difficulty && (
                                <span className={`badge diff-${r.quiz.difficulty}`} style={{ fontSize: 11 }}>{r.quiz.difficulty}</span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: 22, fontWeight: 700, color: c, letterSpacing: '-0.02em' }}>{pct}%</p>
                              <p style={{ fontSize: 11, color: '#3d4a6b' }}>{r.score}/{r.totalPoints} pts</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: 13, color: '#a8b2d8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <FiClock size={12} />
                                {Math.floor(r.timeTaken / 60)}:{String(r.timeTaken % 60).padStart(2, '0')}
                              </p>
                              <p style={{ fontSize: 11, color: '#3d4a6b' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '56px 32px', textAlign: 'center' }}>
                <FiBookOpen size={40} color="#3d4a6b" style={{ marginBottom: 14 }} />
                <p style={{ fontSize: 16, fontWeight: 600, color: '#6b7b9e', marginBottom: 8 }}>No quizzes taken yet</p>
                <p style={{ fontSize: 13, color: '#3d4a6b', marginBottom: 24 }}>Explore and take your first quiz</p>
                <Link to="/student/browse" style={{ textDecoration: 'none' }}>
                  <AnimatedButton icon={FiArrowRight}>Browse Quizzes</AnimatedButton>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
