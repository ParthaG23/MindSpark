import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiSave, FiChevronUp, FiChevronDown, FiCheck, FiChevronRight, FiMinus } from 'react-icons/fi';
import useQuizStore from '../../store/quizStore';
import toast from 'react-hot-toast';

const P = { fontFamily: "'Poppins', sans-serif" };

/* ── Categorized subjects ──────────────────────────────────── */
const SUBJECT_CATEGORIES = [
  {
    category: 'Arts & Humanities',
    color: '#a78bfa',
    subjects: ['History', 'English', 'Geography', 'Literature', 'Philosophy', 'Political Science', 'Economics', 'Sociology'],
  },
  {
    category: 'Science',
    color: '#34d399',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Astronomy'],
  },
  {
    category: 'Computer Science',
    color: '#38bdf8',
    subjects: ['Programming', 'Data Structures', 'Algorithms', 'Web Development', 'Database Systems', 'AI & Machine Learning', 'Cybersecurity', 'Networking'],
  },
  {
    category: 'Other',
    color: '#fbbf24',
    subjects: ['General Knowledge', 'Current Affairs', 'Sports', 'Music', 'Art', 'Other'],
  },
];

/* ── Custom Subject Dropdown ─────────────────────────────────── */
function SubjectDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedLabel = value || 'Select subject';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', height: 42, padding: '0 36px 0 12px',
          background: '#0a0b16', border: `1px solid ${open ? 'rgba(79,99,255,0.4)' : 'rgba(79,99,255,0.12)'}`,
          borderRadius: 10, cursor: 'pointer', textAlign: 'left',
          color: value ? '#f0f4ff' : '#3d4a6b',
          fontFamily: "'Poppins',sans-serif", fontSize: 14,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: open ? '0 0 0 3px rgba(79,99,255,0.07)' : 'none',
          position: 'relative',
        }}
      >
        {selectedLabel}
        <FiChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, color: '#6b7b9e', transition: 'transform 0.2s' }} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
              background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.15)',
              borderRadius: 14, padding: '8px', marginTop: 4,
              boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,99,255,0.05)',
              maxHeight: 340, overflowY: 'auto',
            }}
          >
            {SUBJECT_CATEGORIES.map((cat) => (
              <div key={cat.category} style={{ marginBottom: 4 }}>
                {/* Category header */}
                <button
                  type="button"
                  onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 10px', border: 'none', borderRadius: 8, cursor: 'pointer',
                    background: expandedCat === cat.category ? 'rgba(79,99,255,0.06)' : 'transparent',
                    fontFamily: "'Poppins',sans-serif", transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#a8b2d8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.category}</span>
                  </div>
                  <FiChevronRight size={14} style={{ color: '#3d4a6b', transform: `rotate(${expandedCat === cat.category ? 90 : 0}deg)`, transition: 'transform 0.2s' }} />
                </button>

                {/* Subject items */}
                <AnimatePresence>
                  {expandedCat === cat.category && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ overflow: 'hidden', paddingLeft: 16 }}
                    >
                      {cat.subjects.map((subj) => {
                        const isSelected = value === subj;
                        return (
                          <button
                            key={subj}
                            type="button"
                            onClick={() => { onChange(subj); setOpen(false); }}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                              padding: '7px 10px', border: 'none', borderRadius: 8, cursor: 'pointer',
                              background: isSelected ? 'rgba(79,99,255,0.12)' : 'transparent',
                              fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: isSelected ? 600 : 400,
                              color: isSelected ? '#818cf8' : '#a8b2d8',
                              transition: 'all 0.1s', textAlign: 'left',
                            }}
                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(79,99,255,0.06)'; }}
                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {isSelected && <FiCheck size={13} color="#818cf8" />}
                            {subj}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Points Stepper ─────────────────────────────────────────── */
function PointsStepper({ value, onChange, min = 1, max = 100 }) {
  const val = Number(value) || min;
  const dec = () => onChange(Math.max(min, val - 5));
  const inc = () => onChange(Math.min(max, val + 5));

  const btnStyle = (disabled) => ({
    width: 36, height: 36, borderRadius: 8, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? 'rgba(79,99,255,0.03)' : 'rgba(79,99,255,0.08)',
    color: disabled ? '#2d3552' : '#818cf8',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s', flexShrink: 0,
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button type="button" onClick={dec} disabled={val <= min} style={btnStyle(val <= min)}><FiMinus size={15} /></button>
      <input
        type="text"
        value={val}
        onChange={e => {
          const raw = e.target.value.replace(/[^0-9]/g, '');
          if (raw === '') { onChange(min); return; }
          const n = Math.min(max, Math.max(min, parseInt(raw, 10)));
          onChange(n);
        }}
        onFocus={e => e.target.select()}
        style={{
          width: 64, height: 36, textAlign: 'center', border: '1px solid rgba(79,99,255,0.12)',
          borderRadius: 8, background: '#0a0b16', color: '#f0f4ff',
          fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 700,
          transition: 'border-color 0.2s',
        }}
      />
      <button type="button" onClick={inc} disabled={val >= max} style={btnStyle(val >= max)}><FiPlus size={15} /></button>
      <span style={{ fontSize: 12, color: '#3d4a6b', marginLeft: 4 }}>pts</span>
    </div>
  );
}

/* ── Time Limit Stepper ─────────────────────────────────────── */
function TimeStepper({ value, onChange }) {
  const val = Number(value) || 5;
  const dec = () => onChange(Math.max(5, val - 5));
  const inc = () => onChange(Math.min(180, val + 5));

  const btnStyle = (disabled) => ({
    width: 36, height: 36, borderRadius: 8, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? 'rgba(79,99,255,0.03)' : 'rgba(79,99,255,0.08)',
    color: disabled ? '#2d3552' : '#818cf8',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s', flexShrink: 0,
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button type="button" onClick={dec} disabled={val <= 5} style={btnStyle(val <= 5)}><FiMinus size={15} /></button>
      <input
        type="text"
        value={val}
        onChange={e => {
          const raw = e.target.value.replace(/[^0-9]/g, '');
          if (raw === '') { onChange(5); return; }
          const n = Math.min(180, Math.max(5, parseInt(raw, 10)));
          onChange(n);
        }}
        onFocus={e => e.target.select()}
        style={{
          width: 64, height: 36, textAlign: 'center', border: '1px solid rgba(79,99,255,0.12)',
          borderRadius: 8, background: '#0a0b16', color: '#f0f4ff',
          fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 700,
        }}
      />
      <button type="button" onClick={inc} disabled={val >= 180} style={btnStyle(val >= 180)}><FiPlus size={15} /></button>
      <span style={{ fontSize: 12, color: '#3d4a6b', marginLeft: 4 }}>min</span>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
const defaultQuestion = (type = 'mcq') => ({
  id: Date.now() + Math.random(),
  type,
  text: '',
  points: 10,
  options: type === 'mcq'
    ? [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]
    : [{ text: 'True', isCorrect: false }, { text: 'False', isCorrect: false }],
});

const inputStyle = {
  width: '100%', height: 42, padding: '0 12px',
  background: '#0a0b16', border: '1px solid rgba(79,99,255,0.12)', borderRadius: 10,
  color: '#f0f4ff', fontFamily: "'Poppins',sans-serif", fontSize: 14, transition: 'border-color 0.2s',
};

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7b9e', marginBottom: 6 };

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createQuiz, updateQuiz, fetchQuizById, isLoading } = useQuizStore();

  const [details, setDetails] = useState({ title: '', description: '', subject: '', difficulty: 'medium', timeLimit: 30 });
  const [questions, setQuestions] = useState([defaultQuestion('mcq')]);
  const [activeQ, setActiveQ] = useState(0);

  useEffect(() => {
    if (id) {
      fetchQuizById(id).then(quiz => {
        setDetails({ title: quiz.title, description: quiz.description, subject: quiz.subject, difficulty: quiz.difficulty, timeLimit: quiz.timeLimit || 30 });
        setQuestions(quiz.questions);
      }).catch(err => toast.error('Failed to load quiz data'));
    }
  }, [id, fetchQuizById]);

  const addQuestion = (type) => {
    const q = defaultQuestion(type);
    setQuestions(prev => [...prev, q]);
    setActiveQ(questions.length);
  };

  const removeQuestion = (idx) => {
    if (questions.length === 1) { toast.error('Quiz must have at least 1 question'); return; }
    setQuestions(prev => prev.filter((_, i) => i !== idx));
    setActiveQ(Math.max(0, activeQ - 1));
  };

  const updateQuestion = (idx, field, value) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const updateOption = (qIdx, oIdx, field, value) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      return {
        ...q,
        options: q.options.map((o, j) => {
          if (field === 'isCorrect') return { ...o, isCorrect: j === oIdx };
          return j === oIdx ? { ...o, [field]: value } : o;
        }),
      };
    }));
  };

  const moveQuestion = (idx, dir) => {
    const arr = [...questions];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    setQuestions(arr);
    setActiveQ(ni);
  };

  const handleSave = async (publish = false) => {
    if (!details.title.trim()) { toast.error('Quiz title is required'); return; }
    if (!details.subject) { toast.error('Please select a subject'); return; }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) { toast.error(`Question ${i+1} is empty`); setActiveQ(i); return; }
      const hasCorrect = questions[i].options.some(o => o.isCorrect);
      if (!hasCorrect) { toast.error(`Mark a correct answer for Q${i+1}`); setActiveQ(i); return; }
      if (questions[i].type === 'mcq') {
        const filled = questions[i].options.filter(o => o.text.trim());
        if (filled.length < 2) { toast.error(`Q${i+1} needs at least 2 options`); setActiveQ(i); return; }
      }
    }
    try {
      const payload = {
        ...details,
        timeLimit: Number(details.timeLimit),
        isPublished: publish,
        questions: questions.map(q => ({
          type: q.type,
          text: q.text,
          points: Number(q.points),
          options: q.options.filter(o => o.text.trim() || q.type === 'tf'),
        })),
      };
      if (id) {
        await updateQuiz(id, payload);
        toast.success(publish ? 'Quiz updated and published!' : 'Quiz updated successfully!');
      } else {
        await createQuiz(payload);
        toast.success(publish ? 'Quiz published!' : 'Quiz saved as draft!');
      }
      navigate('/teacher/dashboard');
    } catch (err) { toast.error(err.message); }
  };

  const q = questions[activeQ];
  const inputFocus = e => e.target.style.borderColor = 'rgba(79,99,255,0.4)';
  const inputBlur  = e => e.target.style.borderColor = 'rgba(79,99,255,0.12)';

  return (
    <div className="page" style={{ ...P, paddingTop: 64 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#4f63ff', marginBottom: 8 }}>Teacher Tools</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f0f4ff' }}>
            {id ? 'Edit Quiz' : 'Create a New Quiz'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]" style={{ gap: 24, alignItems: 'start' }}>

          {/* ── LEFT PANEL ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Quiz details */}
            <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 16, padding: '24px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4f63ff', marginBottom: 18 }}>Quiz Details</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} placeholder="e.g. JavaScript Fundamentals" value={details.title}
                    onChange={e => setDetails({ ...details, title: e.target.value })} onFocus={inputFocus} onBlur={inputBlur} />
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea style={{ ...inputStyle, height: 76, padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 }}
                    placeholder="Brief description..." value={details.description}
                    onChange={e => setDetails({ ...details, description: e.target.value })} onFocus={inputFocus} onBlur={inputBlur} />
                </div>

                <div>
                  <label style={labelStyle}>Subject *</label>
                  <SubjectDropdown value={details.subject} onChange={s => setDetails({ ...details, subject: s })} />
                </div>

                <div>
                  <label style={{ ...labelStyle, marginBottom: 8 }}>Difficulty</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['easy','medium','hard'].map(d => (
                      <button key={d} type="button" onClick={() => setDetails({ ...details, difficulty: d })}
                        style={{
                          flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                          fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif", textTransform: 'capitalize',
                          background: details.difficulty === d ? (d==='easy'?'rgba(16,185,129,0.15)':d==='medium'?'rgba(245,158,11,0.15)':'rgba(239,68,68,0.15)') : 'rgba(79,99,255,0.04)',
                          color: details.difficulty === d ? (d==='easy'?'#34d399':d==='medium'?'#fbbf24':'#f87171') : '#6b7b9e',
                          border: `1px solid ${details.difficulty === d ? (d==='easy'?'rgba(16,185,129,0.25)':d==='medium'?'rgba(245,158,11,0.25)':'rgba(239,68,68,0.25)') : 'rgba(79,99,255,0.08)'}`,
                          transition: 'all 0.15s',
                        }}
                      >{d}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Time Limit</label>
                  <TimeStepper value={details.timeLimit} onChange={v => setDetails({ ...details, timeLimit: v })} />
                </div>
              </div>
            </div>

            {/* Question list */}
            <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 16, padding: '20px 16px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4f63ff', marginBottom: 14 }}>
                Questions ({questions.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                {questions.map((qItem, i) => (
                  <button key={qItem.id} type="button" onClick={() => setActiveQ(i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, border: 'none',
                      cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontSize: 13,
                      background: activeQ === i ? 'rgba(79,99,255,0.12)' : 'transparent',
                      color: activeQ === i ? '#818cf8' : '#6b7b9e',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontWeight: 600, marginRight: 8 }}>Q{i+1}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: 200, verticalAlign: 'bottom' }}>
                      {qItem.text || 'Untitled question'}
                    </span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => addQuestion('mcq')} className="btn btn-ghost" style={{ flex: 1, fontSize: 12, padding: '8px' }}>
                  <FiPlus size={13} /> MCQ
                </button>
                <button type="button" onClick={() => addQuestion('tf')} className="btn btn-ghost" style={{ flex: 1, fontSize: 12, padding: '8px' }}>
                  <FiPlus size={13} /> T/F
                </button>
              </div>
            </div>

            {/* Save buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button type="button" onClick={() => handleSave(true)} disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
                <FiSave size={15} /> Publish Quiz
              </button>
              <button type="button" onClick={() => handleSave(false)} disabled={isLoading} className="btn btn-ghost" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
                Save as Draft
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL: Question Editor ── */}
          <AnimatePresence mode="wait">
            <motion.div key={activeQ}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
              style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 16, padding: '28px 24px' }}
            >
              {/* Q header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#f0f4ff' }}>Question {activeQ + 1}</span>
                  <span style={{ fontSize: 12, color: '#6b7b9e', background: 'rgba(79,99,255,0.08)', border: '1px solid rgba(79,99,255,0.12)', padding: '2px 10px', borderRadius: 100 }}>
                    {q?.type === 'tf' ? 'True / False' : 'Multiple Choice'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" onClick={() => moveQuestion(activeQ, -1)} className="btn btn-ghost" style={{ padding: '7px', fontSize: 12 }} title="Move up"><FiChevronUp size={15} /></button>
                  <button type="button" onClick={() => moveQuestion(activeQ, 1)} className="btn btn-ghost" style={{ padding: '7px', fontSize: 12 }} title="Move down"><FiChevronDown size={15} /></button>
                  <button type="button" onClick={() => removeQuestion(activeQ)} style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Delete">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Question text */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Question Text *</label>
                <textarea
                  style={{ ...inputStyle, height: 100, padding: '12px', resize: 'vertical', lineHeight: 1.6 }}
                  placeholder="Type your question here..."
                  value={q?.text || ''}
                  onChange={e => updateQuestion(activeQ, 'text', e.target.value)}
                  onFocus={inputFocus} onBlur={inputBlur}
                />
              </div>

              {/* Points */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Points</label>
                <PointsStepper value={q?.points || 10} onChange={v => updateQuestion(activeQ, 'points', v)} />
              </div>

              {/* Options */}
              <div>
                <label style={{ ...labelStyle, marginBottom: 10 }}>
                  Options — click letter to mark correct answer
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {q?.options?.map((opt, oi) => {
                    const letters = ['A','B','C','D'];
                    return (
                      <div key={oi} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <button type="button" onClick={() => updateOption(activeQ, oi, 'isCorrect', true)}
                          style={{
                            width: 36, height: 36, flexShrink: 0, borderRadius: 8, border: 'none', cursor: 'pointer',
                            fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                            background: opt.isCorrect ? '#4f63ff' : '#111326',
                            color: opt.isCorrect ? '#fff' : '#6b7b9e',
                            transition: 'all 0.15s',
                            boxShadow: opt.isCorrect ? '0 2px 12px rgba(79,99,255,0.35)' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          {opt.isCorrect ? <FiCheck size={15} /> : letters[oi]}
                        </button>
                        {q.type === 'tf' ? (
                          <div style={{
                            flex: 1, padding: '10px 14px', background: '#111326',
                            border: `1px solid ${opt.isCorrect ? 'rgba(79,99,255,0.3)' : 'rgba(79,99,255,0.08)'}`,
                            borderRadius: 10, fontSize: 14,
                            color: opt.isCorrect ? '#f0f4ff' : '#6b7b9e',
                            fontWeight: opt.isCorrect ? 600 : 400,
                          }}>
                            {opt.text}
                          </div>
                        ) : (
                          <input
                            style={{ ...inputStyle, flex: 1, border: `1px solid ${opt.isCorrect ? 'rgba(79,99,255,0.35)' : 'rgba(79,99,255,0.12)'}` }}
                            placeholder={`Option ${letters[oi]}`}
                            value={opt.text}
                            onChange={e => updateOption(activeQ, oi, 'text', e.target.value)}
                            onFocus={inputFocus}
                            onBlur={e => { e.target.style.borderColor = opt.isCorrect ? 'rgba(79,99,255,0.35)' : 'rgba(79,99,255,0.12)'; }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
