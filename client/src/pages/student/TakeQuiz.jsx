import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiBookOpen, FiAlertCircle, FiArrowRight, FiCheck } from 'react-icons/fi';
import useQuizStore from '../../store/quizStore';
import useAuthStore from '../../store/authStore';
import Timer from '../../components/ui/Timer';
import toast from 'react-hot-toast';

const P = { fontFamily: "'Poppins',sans-serif" };

export default function TakeQuiz() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, fetchQuizById, submitQuiz, clearCurrentQuiz, isLoading } = useQuizStore();
  const { user } = useAuthStore();

  const [phase, setPhase] = useState('intro'); // intro | quiz | confirming
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState(new Set([0]));
  const [marked, setMarked] = useState(new Set());
  const startTimeRef = useRef(null);

  const toggleMark = () => {
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(currentQ)) next.delete(currentQ);
      else next.add(currentQ);
      return next;
    });
  };

  const clearResponse = () => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[currentQ];
      return next;
    });
  };

  useEffect(() => {
    setVisited(prev => {
      const next = new Set(prev);
      next.add(currentQ);
      return next;
    });
  }, [currentQ]);

  useEffect(() => {
    if (quizId) fetchQuizById(quizId).catch(() => { toast.error('Quiz not found'); navigate('/student/browse'); });
    return () => clearCurrentQuiz();
  }, [quizId]);

  const startQuiz = () => { startTimeRef.current = Date.now(); setPhase('quiz'); };

  const selectAnswer = (qIdx, optIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = async () => {
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const payload = {
      quizId: quizId,
      answers: currentQuiz.questions.map((q, i) => ({
        questionId: q._id,
        selectedOption: answers[i] ?? -1,
      })),
      timeTaken,
    };
    try {
      const result = await submitQuiz(payload);
      toast.success('Quiz submitted!');
      navigate(`/student/result/${result._id}`);
    } catch (err) { toast.error('Failed to submit quiz'); }
  };

  const onTimerEnd = useCallback(() => { handleSubmit(); }, [answers, currentQuiz]);

  const quiz = currentQuiz;
  const questions = quiz?.questions || [];
  const q = questions[currentQ];
  const totalAnswered = Object.keys(answers).length;

  if (isLoading || !quiz) return (
    <div className="page" style={{ ...P, paddingTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#6b7b9e' }}>Loading quiz…</p>
    </div>
  );

  /* ── INTRO screen ── */
  if (phase === 'intro') return (
    <div className="page" style={{ ...P, paddingTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 520, width: '100%', margin: '0 24px', background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.1)', borderRadius: 20, padding: '48px 36px', textAlign: 'center' }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden', margin: '0 auto 24px', boxShadow: '0 4px 20px rgba(79,99,255,0.3)' }}>
          <img src="/logo.png" alt="MindSpark" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff', marginBottom: 8 }}>{quiz.title}</h1>
        {quiz.description && <p style={{ fontSize: 14, color: '#6b7b9e', marginBottom: 24, lineHeight: 1.6 }}>{quiz.description}</p>}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#818cf8' }}>{questions.length}</p>
            <p style={{ fontSize: 12, color: '#6b7b9e' }}>Questions</p>
          </div>
          <div style={{ width: 1, background: 'rgba(79,99,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#818cf8' }}>{quiz.timeLimit || 30}</p>
            <p style={{ fontSize: 12, color: '#6b7b9e' }}>Minutes</p>
          </div>
          <div style={{ width: 1, background: 'rgba(79,99,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#818cf8' }}>{questions.reduce((a, q) => a + (q.points || 10), 0)}</p>
            <p style={{ fontSize: 12, color: '#6b7b9e' }}>Points</p>
          </div>
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={startQuiz}>
          Start Quiz <FiArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );

  /* ── QUIZ screen ── */
  return (
    <div className="page" style={{ ...P, paddingTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, alignItems: 'start' }}>
          
          {/* LEFT: MAIN QUIZ AREA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Top Info Bar */}
            <div style={{ background: '#0a0b16', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 12, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff' }}>{quiz.title}</h2>
                <span style={{ fontSize: 13, background: 'rgba(79,99,255,0.1)', color: '#818cf8', padding: '2px 8px', borderRadius: 6 }}>Q {currentQ + 1}/{questions.length}</span>
              </div>
              <Timer totalSeconds={(quiz.timeLimit || 30) * 60} onTimerEnd={onTimerEnd} />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div key={currentQ}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 12, padding: '32px 28px', minHeight: 400, display: 'flex', flexDirection: 'column' }}
              >
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <span style={{ background: 'rgba(79,99,255,0.1)', color: '#818cf8', border: '1px solid rgba(79,99,255,0.15)', padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500 }}>
                {q?.type === 'tf' ? 'True/False' : 'MCQ'}
              </span>
              <span style={{ background: 'rgba(79,99,255,0.06)', color: '#6b7b9e', padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500 }}>
                {q?.points || 10} pts
              </span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0f4ff', marginBottom: 24, lineHeight: 1.5 }}>
              {q?.text}
            </h3>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q?.options?.map((opt, oi) => {
                const selected = answers[currentQ] === oi;
                return (
                  <motion.button key={oi} type="button" onClick={() => selectAnswer(currentQ, oi)}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 18px', borderRadius: 12, border: 'none', width: '100%',
                      cursor: 'pointer', textAlign: 'left',
                      fontFamily: "'Poppins',sans-serif", fontSize: 14,
                      background: selected ? 'rgba(79,99,255,0.12)' : '#111326',
                      color: selected ? '#f0f4ff' : '#a8b2d8',
                      border: `1.5px solid ${selected ? 'rgba(79,99,255,0.4)' : 'rgba(79,99,255,0.06)'}`,
                      boxShadow: selected ? '0 0 16px rgba(79,99,255,0.08)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                      background: selected ? '#4f63ff' : 'rgba(79,99,255,0.06)',
                      color: selected ? '#fff' : '#6b7b9e',
                      transition: 'all 0.15s',
                    }}>
                      {selected ? <FiCheck size={14} /> : String.fromCharCode(65 + oi)}
                    </span>
                    {opt.text}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Bottom Bar */}
        <div style={{ background: '#0a0b16', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 12, padding: '16px', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={() => { toggleMark(); if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1); }} style={{ fontSize: 13, padding: '10px 16px' }}>
              Mark {marked.has(currentQ) && answers[currentQ] !== undefined ? '& Save' : 'For Review'}
            </button>
            <button className="btn btn-ghost" onClick={clearResponse} style={{ fontSize: 13, color: '#ef4444', padding: '10px 16px' }}>
              Clear Response
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)} style={{ padding: '10px 24px' }}>
              Previous
            </button>
            {currentQ < questions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrentQ(currentQ + 1)} style={{ padding: '10px 24px' }}>
                Save & Next <FiArrowRight size={14} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setPhase('confirming')} style={{ padding: '10px 24px', background: '#10b981', borderColor: '#10b981' }}>
                Review & Submit <FiCheck size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: EXAM SIDEBAR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Candidate Profile (TCS style) */}
        <div style={{ background: '#0a0b16', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: 8, background: 'linear-gradient(135deg, #4f63ff, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff' }}>
            {user?.name?.[0]}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: 11, color: '#4f63ff', fontWeight: 600 }}>CANDIDATE</p>
          </div>
        </div>

        {/* Status Header */}
        <div style={{ background: '#0a0b16', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 12, padding: '20px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Exam Status</h3>
          <div className="grid grid-cols-2" style={{ gap: 12, fontSize: 12, color: '#a8b2d8' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, background: '#10b981', borderTopRightRadius: 6 }} /> Answered
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, background: '#ef4444', borderBottomRightRadius: 6 }} /> Not Answered
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, background: '#a855f7', borderRadius: '50%' }} /> Marked
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, background: '#a855f7', borderRadius: '50%', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} />
              </div> Marked (Ans)
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, background: '#1e293b', borderRadius: 4 }} /> Not Visited
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, background: '#4f63ff', borderRadius: 4 }} /> Current
            </div>
          </div>
        </div>

        {/* Navigator Grid */}
        <div style={{ background: '#0a0b16', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 12, padding: '20px', flex: 1 }}>
          <p style={{ fontSize: 12, color: '#6b7b9e', marginBottom: 16 }}>QUESTIONS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, maxHeight: 400, overflowY: 'auto', paddingRight: 4 }}>
            {questions.map((_, i) => {
              const isCurrent = currentQ === i;
              const isAnswered = answers[i] !== undefined;
              const isVisited = visited.has(i);
              const isMarked = marked.has(i);

              let bg = '#1e293b'; // Not visited
              let radius = '6px';
              let color = '#a8b2d8';
              let border = '2px solid transparent';
              let clip = 'none';

              if (isMarked) {
                bg = '#a855f7';
                radius = '50%';
                color = '#fff';
              } else if (isAnswered) {
                bg = '#10b981';
                radius = '8px 8px 0 8px'; // angled right flag
                color = '#fff';
              } else if (isVisited) {
                bg = '#ef4444';
                radius = '0 8px 8px 8px'; // angled left flag (downward cut)
                color = '#fff';
              }

              if (isCurrent) {
                border = '2px solid #4f63ff';
                if (!isMarked && !isAnswered && !isVisited) {
                  bg = '#2d3748';
                  color = '#fff';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  style={{
                    width: '100%', aspectRatio: '1/1', border, borderRadius: radius,
                    background: bg, color, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    position: 'relative', outline: 'none'
                  }}
                >
                  {i + 1}
                  {isMarked && isAnswered && (
                    <div style={{ position: 'absolute', bottom: 2, right: 2, width: 8, height: 8, background: '#10b981', borderRadius: '50%', border: '1.5px solid #0a0b16' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button className="btn btn-primary" onClick={() => setPhase('confirming')} style={{ background: 'linear-gradient(135deg,#38bdf8,#4f63ff)', border: 'none', padding: '16px' }}>
          Evaluate Details & Submit
        </button>

      </div>
    </div>
  </div>
</div>
  );
}
