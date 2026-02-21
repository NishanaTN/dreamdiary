import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const MOOD_KEYWORDS = {
  happy: ['happy', 'joy', 'glad', 'pleased', 'cheerful'],
  sad: ['sad', 'unhappy', 'sorrow', 'cry', 'tears'],
  calm: ['calm', 'peaceful', 'relaxed'],
  love: ['love', 'loved', 'loving', 'affection'],
  romantic: ['romantic', 'romance', 'date', 'kiss'],
  angry: ['angry', 'anger', 'mad', 'furious'],
  depression: ['depressed', 'depression', 'hopeless'],
  pressure: ['pressure', 'pressured', 'burdened'],
  stress: ['stress', 'stressed', 'anxious']
};

const COLORS = {
  happy: '#60a5fa', sad: '#93c5fd', calm: '#34d399', love: '#f472b6', romantic: '#fb7185', angry: '#fb923c', depression: '#a78bfa', pressure: '#facc15', stress: '#fda4af'
};

const detectMoodsCounts = (text) => {
  const lc = (text || '').toLowerCase();
  const counts = {};
  for (const [mood, words] of Object.entries(MOOD_KEYWORDS)) {
    counts[mood] = 0;
    for (const w of words) {
      const re = new RegExp(`\\b${w}\\b`, 'gi');
      const matches = lc.match(re);
      if (matches) counts[mood] += matches.length;
    }
  }
  return counts;
};

const Analytics = () => {
  const navigate = useNavigate();

  const { moodCounts, pieData, bestDay } = useMemo(() => {
    const raw = JSON.parse(localStorage.getItem('journalData') || '{}');
    const moodCounts = {};
    for (const k of Object.keys(MOOD_KEYWORDS)) moodCounts[k] = 0;

    const perDayHappy = {};
    for (const [dateKey, val] of Object.entries(raw)) {
      const text = (val && val.text) || '';
      const counts = detectMoodsCounts(text);
      for (const [m, c] of Object.entries(counts)) moodCounts[m] += c;
      perDayHappy[dateKey] = counts.happy || 0;
    }

    let bestDay = null;
    let bestHappyScore = -1;
    for (const [d, s] of Object.entries(perDayHappy)) {
      if (s > bestHappyScore) { bestHappyScore = s; bestDay = { date: d, happyScore: s }; }
    }

    const total = Object.values(moodCounts).reduce((a, b) => a + b, 0);
    const pieData = total > 0 ? Object.entries(moodCounts).filter(([, v]) => v > 0).map(([k, v]) => ({ key: k, value: v, color: COLORS[k] || '#cbd5e1', pct: (v / total) * 100 })) : [];

    return { moodCounts, pieData, bestDay };
  }, []);

  // simple svg pie rendering
  const radius = 80; const cx = 100; const cy = 100;
  let currentAngle = 0;
  const segments = pieData.map((seg) => {
    const angle = (seg.value / Math.max(1, Object.values(moodCounts).reduce((a, b) => a + b, 0))) * 360;
    const start = currentAngle; const end = currentAngle + angle; currentAngle = end;
    return { ...seg, start, end };
  });

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const angleRad = (angleDeg - 90) * Math.PI / 180.0;
    return { x: cx + (r * Math.cos(angleRad)), y: cy + (r * Math.sin(angleRad)) };
  };
  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${cx} ${cy}`;
  };

  const bestDayLabel = bestDay ? new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'No data';

  return (
    <div className="page-container animate-fade-in">
      <header className="header-nav">
        <div>
          <h1 className="title-gradient" style={{ marginBottom: '0.25rem' }}>Mood Analytics</h1>
          <p>Aggregated from your saved diary entries</p>
        </div>
        <div>
          <button onClick={() => navigate('/home')} className="btn btn-glass">Back</button>
        </div>
      </header>

      <main className="glass-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: '220px' }}>
          <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
            <g>
              {segments.map((s, i) => (
                <path key={i} d={describeArc(cx, cy, radius, s.start, s.end)} fill={s.color} stroke="transparent" />
              ))}
              <circle cx={cx} cy={cy} r={radius * 0.5} fill="rgba(0,0,0,0.04)" />
            </g>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: '260px' }}>
          <h3 style={{ marginTop: 0 }}>Mood distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(moodCounts).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '12px', height: '12px', background: COLORS[k] || '#cbd5e1', borderRadius: '2px' }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span style={{ textTransform: 'capitalize' }}>{k}</span>
                  <span>{v}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>Best day for happiness:</strong>
            <div style={{ marginTop: '0.25rem' }}>{bestDayLabel}{bestDay && bestDay.happyScore > 0 ? ` — ${bestDay.happyScore} happy word(s)` : ''}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
