import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiBarChart2, FiAward, FiTarget } from 'react-icons/fi';
import useQuizStore from '../../store/quizStore';
import useResultStore from '../../store/resultStore';
import { DonutChart, BarChart, AnimatedCounter } from '../../components/ui/Charts';

const P = { fontFamily: "'Poppins',sans-serif" };

export default function QuizAnalytics() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, fetchQuizById } = useQuizStore();
  const { quizResults, fetchQuizResults, isLoading } = useResultStore();

  useEffect(() => {
    if (quizId) { fetchQuizById(quizId); fetchQuizResults(quizId); }
  }, [quizId]);

  const summary = quizResults?.summary;
  const results  = quizResults?.results  || [];
  const qStats   = quizResults?.questionStats || [];

  if (isLoading) return (
    <div className="page" style={{ ...P, paddingTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#6b7b9e' }}>Loading analytics…</p>
    </div>
  );

  return (
    <div className="page" style={{ ...P, paddingTop: 64 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 36 }}>
          <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(79,99,255,0.1)', background: 'transparent', cursor: 'pointer', color: '#6b7b9e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
            <FiArrowLeft size={16} />
          </button>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#4f63ff', marginBottom: 6 }}>Analytics</p>
            <h1 style={{ fontSize: 'clamp(20px,3vw,30px)', fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>{currentQuiz?.title || 'Quiz Analytics'}</h1>
            {currentQuiz?.subject && <span style={{ fontSize: 12, color: '#6b7b9e' }}>{currentQuiz.subject}</span>}
          </div>
        </div>

        {/* Summary stats */}
        {summary && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ gap: 16, marginBottom: 40 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          >
            {[
              { label: 'Total Attempts', value: summary.totalAttempts ?? 0,          icon: FiUsers,    color: '#818cf8' },
              { label: 'Highest Score',  value: `${summary.highestScore ?? 0}%`,      icon: FiAward,    color: '#34d399' },
              { label: 'Lowest Score',   value: `${summary.lowestScore ?? 0}%`,       icon: FiBarChart2,color: '#f87171' },
              { label: 'Total Questions',value: currentQuiz?.questions?.length ?? 0,  icon: FiTarget,   color: '#fbbf24' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '22px 20px' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <s.icon size={17} color={s.color} />
                </div>
                <AnimatedCounter value={s.value} size={28} color="#f0f4ff" />
                <div style={{ fontSize: 12, color: '#6b7b9e', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24, marginBottom: 32 }}>

          {/* Average Score Donut */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28 }}
          >
            <DonutChart
              percentage={summary?.averageScore ?? 0}
              size={110}
              strokeWidth={10}
              color="#38bdf8"
              label="Average Score"
            />
            <div>
              <p style={{ fontSize: 13, color: '#6b7b9e', marginBottom: 4 }}>Students average</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#f0f4ff', letterSpacing: '-0.02em' }}>{summary?.averageScore ?? 0}%</p>
              <p style={{ fontSize: 12, color: '#3d4a6b' }}>across {summary?.totalAttempts ?? 0} attempts</p>
            </div>
          </motion.div>

          {/* Pass Rate Donut */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28 }}
          >
            <DonutChart
              percentage={summary?.passRate ?? 0}
              size={110}
              strokeWidth={10}
              color="#34d399"
              label="Pass Rate"
            />
            <div>
              <p style={{ fontSize: 13, color: '#6b7b9e', marginBottom: 4 }}>Students passing (≥70%)</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#f0f4ff', letterSpacing: '-0.02em' }}>{summary?.passRate ?? 0}%</p>
              <p style={{ fontSize: 12, color: '#3d4a6b' }}>highest: {summary?.highestScore ?? 0}%</p>
            </div>
          </motion.div>
        </div>

        {/* Score Distribution Bar Chart */}
        {qStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '24px 20px', marginBottom: 32 }}
          >
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff', marginBottom: 20 }}>Question Performance Overview</p>
            <BarChart
              height={200}
              barWidth={Math.min(48, Math.max(24, 600 / (qStats.length || 1)))}
              data={qStats.map((qs, i) => ({
                label: `Q${i + 1}`,
                value: Math.round(qs.accuracy ?? 0),
                color: (qs.accuracy ?? 0) >= 70 ? '#34d399' : (qs.accuracy ?? 0) >= 40 ? '#fbbf24' : '#f87171',
              }))}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          {/* Per-question accuracy */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Question Accuracy</p>
            {qStats.length === 0 ? (
              <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '42px 24px', textAlign: 'center' }}>
                <p style={{ color: '#6b7b9e', fontSize: 14 }}>No attempts yet</p>
              </div>
            ) : (
              <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                {qStats.map((qs, i) => {
                  const acc = Math.round(qs.accuracy ?? 0);
                  const c = acc >= 70 ? '#34d399' : acc >= 40 ? '#fbbf24' : '#f87171';
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: '#a8b2d8', maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Q{i+1}: {qs.questionText || `Question ${i+1}`}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: c, flexShrink: 0, marginLeft: 8 }}>{acc}%</span>
                      </div>
                      <div style={{ height: 5, background: '#111326', borderRadius: 4, overflow: 'hidden' }}>
                        <motion.div style={{ height: '100%', background: c, borderRadius: 4 }}
                          initial={{ width: 0 }} animate={{ width: `${acc}%` }} transition={{ duration: 0.7, delay: i * 0.06 }} />
                      </div>
                      <p style={{ fontSize: 11, color: '#3d4a6b', marginTop: 4 }}>{qs.correctCount}/{qs.totalAnswered} correct</p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Student Results Table */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Student Results</p>
            {results.length === 0 ? (
              <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '42px 24px', textAlign: 'center' }}>
                <p style={{ color: '#6b7b9e', fontSize: 14 }}>No student attempts yet</p>
              </div>
            ) : (
              <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(79,99,255,0.06)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3d4a6b' }}>Student</span>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3d4a6b', textAlign: 'center' }}>Score</span>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3d4a6b', textAlign: 'center' }}>Time</span>
                </div>
                <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                  {results.map((r, i) => {
                    const livePct = r.totalPoints > 0 ? Math.round((r.score / r.totalPoints) * 100) : (r.percentage || 0);
                    const c = livePct >= 70 ? '#34d399' : livePct >= 40 ? '#fbbf24' : '#f87171';
                    return (
                      <div key={r._id || i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', padding: '14px 20px', borderBottom: '1px solid rgba(79,99,255,0.04)', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f4ff' }}>{r.student?.name || 'Unknown'}</p>
                          <p style={{ fontSize: 11, color: '#6b7b9e' }}>{r.student?.email}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: c }}>{livePct}%</span>
                          <p style={{ fontSize: 11, color: '#3d4a6b' }}>{r.score}/{r.totalPoints}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: 12, color: '#6b7b9e' }}>{Math.floor((r.timeTaken||0)/60)}:{String((r.timeTaken||0)%60).padStart(2,'0')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
