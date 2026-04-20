import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiBookOpen, FiUsers, FiStar } from 'react-icons/fi';
import useQuizStore from '../../store/quizStore';

const P = { fontFamily: "'Poppins',sans-serif" };

const diffStyle = {
  easy:   { background: 'rgba(16,185,129,0.1)', color: '#34d399',  border: '1px solid rgba(16,185,129,0.2)' },
  medium: { background: 'rgba(245,158,11,0.1)', color: '#fbbf24',  border: '1px solid rgba(245,158,11,0.2)' },
  hard:   { background: 'rgba(239,68,68,0.1)',  color: '#f87171',  border: '1px solid rgba(239,68,68,0.2)' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function BrowseQuizzes() {
  const { quizzes, pagination, fetchQuizzes, isLoading } = useQuizStore();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (search.trim()) params.search = search.trim();
    if (subject) params.subject = subject;
    if (difficulty) params.difficulty = difficulty;
    fetchQuizzes(params);
  }, [page, subject, difficulty]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = { page: 1, limit: 12 };
    if (search.trim()) params.search = search.trim();
    if (subject) params.subject = subject;
    if (difficulty) params.difficulty = difficulty;
    fetchQuizzes(params);
  };

  const subjects = ['Mathematics','Science','History','English','Geography','Computer Science','Physics','Chemistry','Biology','Other'];

  const inputStyle = {
    height: 42, padding: '0 12px 0 40px',
    background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.12)', borderRadius: 10,
    color: '#f0f4ff', fontFamily: "'Poppins',sans-serif", fontSize: 14,
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div className="page" style={{ ...P, paddingTop: 64 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#4f63ff', marginBottom: 8 }}>Explore</p>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,34px)', fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>Browse Quizzes</h1>
          <p style={{ fontSize: 14, color: '#6b7b9e' }}>Find quizzes by subject, difficulty, or keyword</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <FiSearch size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3d4a6b', pointerEvents: 'none' }} />
            <input
              style={{ ...inputStyle, width: '100%' }}
              placeholder="Search quizzes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={e => e.target.style.borderColor = 'rgba(79,99,255,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(79,99,255,0.12)'}
            />
          </form>
          <select
            style={{ ...inputStyle, padding: '0 12px', width: 'auto', minWidth: 160, cursor: 'pointer' }}
            value={subject} onChange={e => { setSubject(e.target.value); setPage(1); }}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 6 }}>
            {['','easy','medium','hard'].map(d => (
              <button key={d} type="button" onClick={() => { setDifficulty(d); setPage(1); }}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 500, textTransform: 'capitalize',
                  background: difficulty === d ? 'rgba(79,99,255,0.12)' : 'transparent',
                  color: difficulty === d ? '#818cf8' : '#6b7b9e',
                  border: `1px solid ${difficulty === d ? 'rgba(79,99,255,0.2)' : 'rgba(79,99,255,0.06)'}`,
                  transition: 'all 0.15s',
                }}
              >
                {d || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton" style={{ height: 200, borderRadius: 14 }} />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 16, padding: '72px 32px', textAlign: 'center' }}>
            <FiBookOpen size={40} color="#3d4a6b" style={{ marginBottom: 14 }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: '#6b7b9e', marginBottom: 8 }}>No quizzes found</p>
            <p style={{ fontSize: 13, color: '#3d4a6b' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 16 }}
            variants={stagger} initial="hidden" animate="show"
          >
            {quizzes.map((quiz) => (
              <motion.div key={quiz._id} variants={fadeUp}>
                <Link to={`/student/quiz/${quiz._id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{ background: '#0c0e1a', border: '1px solid rgba(79,99,255,0.08)', borderRadius: 14, padding: '24px 20px', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,99,255,0.22)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(79,99,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* badges */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                      {quiz.subject && <span style={{ ...diffStyle.medium, background: 'rgba(79,99,255,0.1)', color: '#818cf8', border: '1px solid rgba(79,99,255,0.15)', padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500 }}>{quiz.subject}</span>}
                      {quiz.difficulty && <span style={{ ...diffStyle[quiz.difficulty], padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500 }}>{quiz.difficulty}</span>}
                    </div>

                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff', marginBottom: 8, lineHeight: 1.4 }}>{quiz.title}</h3>
                    <p style={{ fontSize: 12, color: '#6b7b9e', marginBottom: 16, lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {quiz.description || 'No description'}
                    </p>

                    <div style={{ display: 'flex', gap: 16, borderTop: '1px solid rgba(79,99,255,0.06)', paddingTop: 14 }}>
                      <span style={{ fontSize: 12, color: '#6b7b9e', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiBookOpen size={12} color="#4f63ff" /> {quiz.questions?.length || 0} Qs
                      </span>
                      <span style={{ fontSize: 12, color: '#6b7b9e', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiClock size={12} color="#4f63ff" /> {quiz.timeLimit || 30} min
                      </span>
                      {quiz.createdBy?.name && (
                        <span style={{ fontSize: 12, color: '#6b7b9e', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FiUsers size={12} color="#4f63ff" /> {quiz.createdBy.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600,
                  background: page === i + 1 ? '#4f63ff' : 'rgba(79,99,255,0.06)',
                  color: page === i + 1 ? '#fff' : '#6b7b9e',
                  transition: 'all 0.15s',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
