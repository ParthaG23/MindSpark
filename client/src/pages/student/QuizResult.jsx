import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiClock, FiTarget, FiChevronDown, FiChevronUp, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';
import useResultStore from '../../store/resultStore';
import { DonutChart, AnimatedCounter } from '../../components/ui/Charts';
import confetti from 'canvas-confetti';

const P = { fontFamily: "'Poppins',sans-serif" };

export default function QuizResult() {
  const { id: resultId } = useParams();
  const { currentResult, fetchResultById, leaderboard, fetchLeaderboard, isLoading } = useResultStore();
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    if (resultId) {
      fetchResultById(resultId).then((result) => {
        if (result?.quiz?._id) fetchLeaderboard(result.quiz._id);
        if (result?.percentage >= 70) {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }
      }).catch(() => {});
    }
  }, [resultId]);

  if (isLoading || !currentResult) return (
    <div className="page" style={{ ...P, paddingTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#6b7b9e' }}>Loading result…</p>
    </div>
  );

  const r = currentResult;
  const pct = r.percentage || 0;
  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';
  const gradeColor = pct >= 70 ? '#34d399' : pct >= 40 ? '#fbbf24' : '#f87171';

  return (
    <div className="page" style={{ ...P, paddingTop: 64 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* Back */}
        <Link to="/student/dashboard" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7b9e', marginBottom: 28, transition: 'color 0.15s' }}>
          <FiArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Score header */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.1)', borderRadius: 20, padding: '48px 36px', textAlign: 'center', marginBottom: 32 }}
        >
          {/* Grade Circle - Animated Donut */}
          <div style={{ marginBottom: 20 }}>
            <DonutChart percentage={pct} size={120} strokeWidth={10} color={gradeColor} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: gradeColor, marginBottom: 8 }}>{grade}</div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>{r.quiz?.title || 'Quiz Result'}</h1>
          <p style={{ fontSize: 14, color: '#6b7b9e', marginBottom: 28 }}>
            {pct >= 70 ? '🎉 Great job!' : pct >= 40 ? 'Good effort, keep practicing!' : 'Keep studying, you\'ll get there!'}
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {[
              { label: 'Score',    value: `${pct}%`,                              icon: FiTarget, color: gradeColor },
              { label: 'Points',   value: `${r.score}/${r.totalPoints}`,          icon: FiAward,  color: '#818cf8' },
              { label: 'Time',     value: `${Math.floor((r.timeTaken||0)/60)}:${String((r.timeTaken||0)%60).padStart(2,'0')}`, icon: FiClock, color: '#38bdf8' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <s.icon size={18} color={s.color} style={{ marginBottom: 6 }} />
                <AnimatedCounter value={s.value} size={22} color={s.color} />
                <p style={{ fontSize: 12, color: '#6b7b9e', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]" style={{ gap: 24, alignItems: 'start' }}>

          {/* Answer Review */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Answer Review</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {r.answers?.map((ans, i) => {
                const question = r.quiz?.questions?.[i];
                if (!question) return null;
                const isCorrect = ans.isCorrect;
                const isExpanded = expandedQ === i;
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    style={{ background: '#0c0e1a', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`, borderRadius: 14, overflow: 'hidden' }}
                  >
                    {/* Header row */}
                    <button onClick={() => setExpandedQ(isExpanded ? null : i)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 18px', border: 'none', cursor: 'pointer',
                        background: 'transparent', fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <span style={{
                          width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: isCorrect ? '#34d399' : '#f87171',
                        }}>
                          {isCorrect ? <FiCheck size={14} /> : <FiX size={14} />}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f4ff', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Q{i+1}: {question.text}
                        </span>
                      </div>
                      <span style={{ color: '#6b7b9e', flexShrink: 0, marginLeft: 8 }}>
                        {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </span>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div style={{ padding: '4px 18px 18px', borderTop: '1px solid rgba(79,99,255,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                          {question.options?.map((opt, oi) => {
                            const isSelected = ans.selectedOption === oi;
                            const isAnswer = opt.isCorrect;
                            let bg = '#111326';
                            let border = '1px solid rgba(79,99,255,0.06)';
                            let color = '#6b7b9e';
                            if (isAnswer) { bg = 'rgba(16,185,129,0.08)'; border = '1px solid rgba(16,185,129,0.2)'; color = '#34d399'; }
                            if (isSelected && !isAnswer) { bg = 'rgba(239,68,68,0.08)'; border = '1px solid rgba(239,68,68,0.2)'; color = '#f87171'; }
                            return (
                              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: bg, border }}>
                                <span style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, background: isAnswer ? 'rgba(16,185,129,0.2)' : isSelected ? 'rgba(239,68,68,0.2)' : 'rgba(79,99,255,0.06)', color }}>
                                  {isAnswer ? <FiCheck size={12} /> : isSelected ? <FiX size={12} /> : String.fromCharCode(65 + oi)}
                                </span>
                                <span style={{ fontSize: 13, color: isAnswer ? '#34d399' : isSelected && !isAnswer ? '#f87171' : '#a8b2d8' }}>
                                  {opt.text}
                                </span>
                                {isSelected && <span style={{ fontSize: 10, fontWeight: 600, color, marginLeft: 'auto' }}>Your answer</span>}
                                {isAnswer && !isSelected && <span style={{ fontSize: 10, fontWeight: 600, color: '#34d399', marginLeft: 'auto' }}>Correct</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Leaderboard</h2>
            <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
              {leaderboard.length === 0 ? (
                <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: '#3d4a6b' }}>No rankings yet</p>
                </div>
              ) : (
                <div>
                  {/* Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 70px 70px', padding: '10px 16px', borderBottom: '1px solid rgba(79,99,255,0.06)' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#3d4a6b' }}>#</span>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#3d4a6b' }}>Student</span>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#3d4a6b', textAlign: 'right' }}>Score</span>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#3d4a6b', textAlign: 'right' }}>Time</span>
                  </div>
                  {leaderboard.slice(0, 10).map((entry, i) => {
                    const medalColors = ['#fbbf24', '#94a3b8', '#cd7f32'];
                    const c = entry.percentage >= 70 ? '#34d399' : entry.percentage >= 40 ? '#fbbf24' : '#f87171';
                    return (
                      <div key={entry._id || i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 70px 70px', padding: '12px 16px', borderBottom: '1px solid rgba(79,99,255,0.03)', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: i < 3 ? medalColors[i] : '#3d4a6b' }}>
                          {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#a8b2d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.student?.name || 'Unknown'}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: c, textAlign: 'right' }}>{entry.percentage}%</span>
                        <span style={{ fontSize: 12, color: '#6b7b9e', textAlign: 'right' }}>
                          {Math.floor((entry.timeTaken||0)/60)}:{String((entry.timeTaken||0)%60).padStart(2,'0')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              <Link to="/student/browse" style={{ textDecoration: 'none' }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Take Another Quiz</button>
              </Link>
              <Link to="/student/dashboard" style={{ textDecoration: 'none' }}>
                <button className="btn btn-ghost" style={{ width: '100%', padding: '12px' }}>Back to Dashboard</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
