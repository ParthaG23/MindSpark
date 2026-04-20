const LoadingSkeleton = ({ style = {}, count = 1 }) => {
  if (count > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 20, borderRadius: 8, ...style }} />
        ))}
      </div>
    );
  }
  return <div className="skeleton" style={{ height: 20, borderRadius: 8, ...style }} />;
};

export const QuizCardSkeleton = () => (
  <div className="card" style={{ padding: 28 }}>
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 100 }} />
      <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 100 }} />
    </div>
    <div className="skeleton" style={{ height: 22, marginBottom: 10, borderRadius: 6 }} />
    <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 20, borderRadius: 6 }} />
    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
      <div className="skeleton" style={{ width: 60, height: 14, borderRadius: 6 }} />
      <div className="skeleton" style={{ width: 60, height: 14, borderRadius: 6 }} />
    </div>
    <div style={{ borderTop: '1px solid rgba(79,99,255,0.06)', paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
      <div className="skeleton" style={{ width: 100, height: 14, borderRadius: 6 }} />
      <div className="skeleton" style={{ width: 70, height: 14, borderRadius: 6 }} />
    </div>
  </div>
);

export default LoadingSkeleton;
