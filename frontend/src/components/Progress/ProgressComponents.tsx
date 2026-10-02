import './ProgressComponents.css';

interface ProgressCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export function ProgressCard({ title, value, icon, color = '#f97316' }: ProgressCardProps) {
  return (
    <div className="progress-card">
      <div className="progress-card-icon" style={{ background: color }}>{icon}</div>
      <div className="progress-card-info">
        <span className="progress-card-value">{value}</span>
        <span className="progress-card-title">{title}</span>
      </div>
    </div>
  );
}

interface TopicProgressProps {
  topic: string;
  percentage: number;
  status: 'completed' | 'in-progress' | 'not-started';
}

export function TopicProgress({ topic, percentage, status }: TopicProgressProps) {
  return (
    <div className="topic-progress">
      <div className="topic-progress-header">
        <span className="topic-progress-name">{topic}</span>
        <span className={`topic-progress-status status-${status}`}>
          {status === 'completed' ? '✓' : status === 'in-progress' ? '◐' : '○'}
        </span>
      </div>
      <div className="topic-progress-bar">
        <div className="topic-progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="topic-progress-pct">{percentage}%</span>
    </div>
  );
}

interface ProgressChartProps {
  data: { label: string; value: number; color: string }[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;

  return (
    <div className="progress-chart">
      <div className="progress-chart-bar">
        {data.map((d, i) => {
          const pct = total > 0 ? (d.value / total) * 100 : 0;
          cumulative += pct;
          return (
            <div
              key={i}
              className="progress-chart-segment"
              style={{ width: `${pct}%`, background: d.color }}
              title={`${d.label}: ${d.value}`}
            />
          );
        })}
      </div>
      <div className="progress-chart-legend">
        {data.map((d, i) => (
          <div key={i} className="progress-chart-legend-item">
            <span className="legend-dot" style={{ background: d.color }} />
            <span>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
