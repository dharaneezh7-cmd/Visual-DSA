import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import type { DashboardData } from '../../types';
import Loader from '../../components/Common/Loader';
import { ProgressCard, ProgressChart, TopicProgress } from '../../components/Progress/ProgressComponents';
import CertificateModal from '../../components/Certificate/CertificateModal';
import './Progress.css';

const ALL_TOPICS = [
  'Basics',
  'Array',
  'LinkedList',
  'Stack',
  'Queue',
  'CircularQueue',
  'Searching',
  'Sorting',
];

export default function Progress() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { progress, activities } = useProgress();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);

  // Fallback local calculation when unauthenticated or backend fails
  const localDashboard = useMemo<DashboardData>(() => {
    const topicStats: Record<string, { count: number; sumPct: number; completed: number; time: number }> = {};
    for (const t of ALL_TOPICS) {
      topicStats[t] = { count: 0, sumPct: 0, completed: 0, time: 0 };
    }

    for (const p of progress) {
      if (!topicStats[p.topic]) {
        topicStats[p.topic] = { count: 0, sumPct: 0, completed: 0, time: 0 };
      }
      topicStats[p.topic].count += 1;
      topicStats[p.topic].sumPct += p.completionPercentage || 0;
      if (p.completed) topicStats[p.topic].completed += 1;
      topicStats[p.topic].time += p.timeSpent || 0;
    }

    let overallSum = 0;
    let completedTopicsCount = 0;
    let totalSeconds = 0;
    const strong: string[] = [];
    const weak: string[] = [];
    const recommended: string[] = [];

    const perTopic = ALL_TOPICS.map(topic => {
      const stat = topicStats[topic];
      const avg = stat.count > 0 ? Math.round(stat.sumPct / stat.count) : 0;
      overallSum += avg;
      totalSeconds += stat.time;
      if (stat.completed > 0 || avg >= 100) completedTopicsCount += 1;

      if (avg >= 70) strong.push(topic);
      else if (avg > 0 && avg < 40) weak.push(topic);

      if (avg < 70) recommended.push(topic);

      return {
        topic,
        sectionsCompleted: stat.completed,
        completion: avg,
        practiceAccuracy: 0,
        timeSpent: stat.time,
      };
    });

    const overallPct = Math.round(overallSum / ALL_TOPICS.length);
    const mins = Math.round(totalSeconds / 60);
    const timeStr = mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
    const level = overallPct >= 80 ? 'Advanced' : overallPct >= 50 ? 'Intermediate' : overallPct >= 20 ? 'Beginner' : 'Getting Started';

    return {
      overallProgress: overallPct,
      topicsCompleted: completedTopicsCount,
      totalTopics: ALL_TOPICS.length,
      practiceAccuracy: activities.length > 0 ? 100 : 0,
      learningTime: timeStr,
      strongTopics: strong,
      weakTopics: weak,
      recommendedTopics: recommended.slice(0, 3),
      learningLevel: level,
      perTopicAnalysis: perTopic,
    };
  }, [progress, activities]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setDashboard(localDashboard);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await dashboardAPI.get();
        if (isMounted && res.success && res.dashboard) {
          setDashboard(res.dashboard);
        } else if (isMounted) {
          setDashboard(localDashboard);
        }
      } catch (err) {
        if (isMounted) {
          setError(String((err as Error).message || 'Failed to load cloud progress'));
          setDashboard(localDashboard);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, localDashboard]);

  if (isLoading || loading) return <Loader text="Loading your progress..." />;

  if (error && !dashboard) {
    return (
      <div className="progress-error">
        <p>{error}</p>
        <Link to="/" className="progress-err-link">Go home</Link>
      </div>
    );
  }

  const activeDashboard = dashboard || localDashboard;

  const chartData = [
    { label: 'Theory', value: 25, color: '#3b82f6' },
    { label: 'Visualization', value: 35, color: '#8b5cf6' },
    { label: 'Operations', value: 20, color: '#f59e0b' },
    { label: 'Practice', value: 20, color: '#10b981' },
  ];

  // Topics progress list
  const topicBreakdown = activeDashboard.perTopicAnalysis || ALL_TOPICS.map(topic => {
    const isCompleted = activeDashboard.strongTopics.includes(topic);
    return {
      topic,
      completion: isCompleted ? 80 : 0,
      sectionsCompleted: 0,
      practiceAccuracy: 0,
      timeSpent: 0,
    };
  });

  return (
    <div className="progress-page">
      <div className="progress-header-row">
        <div>
          <h1 className="progress-title">My Learning Progress</h1>
          <p className="progress-subtitle">Track your interactive visualizations, operations, and mastery across DSA topics.</p>
        </div>
        {!isAuthenticated && (
          <div className="progress-guest-banner">
            <span>💡 <strong>Guest Mode:</strong> Progress saved locally in this browser. <Link to="/auth/login" className="guest-login-link">Log in</Link> to sync across devices!</span>
          </div>
        )}
      </div>

      <div className="progress-cards">
        <ProgressCard title="Overall Progress" value={`${activeDashboard.overallProgress}%`} icon="📈" />
        <ProgressCard title="Topics Completed" value={`${activeDashboard.topicsCompleted} / ${activeDashboard.totalTopics}`} icon="✅" color="#10b981" />
        <ProgressCard title="Practice Accuracy" value={`${activeDashboard.practiceAccuracy}%`} icon="🎯" color="#8b5cf6" />
        <ProgressCard title="Learning Time" value={activeDashboard.learningTime} icon="⏱️" color="#f59e0b" />
      </div>

      <div className="progress-grid">
        <div className="progress-block">
          <h2>Overall Progress</h2>
          <div className="progress-bar-large">
            <div className="progress-bar-fill" style={{ width: `${activeDashboard.overallProgress}%` }}></div>
          </div>
          <span className="progress-bar-text">{activeDashboard.overallProgress}% complete</span>
        </div>

        <div className="progress-block">
          <h2>Learning Composition</h2>
          <ProgressChart data={chartData} />
        </div>
      </div>

      <div className="progress-block">
        <h2>Topic Mastery Breakdown</h2>
        <div className="topic-progress-grid">
          {topicBreakdown.map(item => {
            const status = item.completion >= 100 ? 'completed' : item.completion > 0 ? 'in-progress' : 'not-started';
            return (
              <TopicProgress
                key={item.topic}
                topic={item.topic}
                percentage={item.completion}
                status={status}
              />
            );
          })}
        </div>
      </div>

      <div className="progress-block">
        <h2>Learning Level</h2>
        <div className={`level-badge level-${(activeDashboard.learningLevel || 'Beginner').toLowerCase()}`}>
          {activeDashboard.learningLevel || 'Beginner'}
        </div>
      </div>

      <div className="progress-grid">
        <div className="progress-block">
          <h2>Strong Topics</h2>
          {activeDashboard.strongTopics.length > 0 ? (
            <ul className="topic-list strong-list">
              {activeDashboard.strongTopics.map(t => <li key={t}>✓ {t}</li>)}
            </ul>
          ) : (
            <p className="progress-empty">No strong topics yet. Complete more operations and practice questions!</p>
          )}
        </div>

        <div className="progress-block">
          <h2>Needs Improvement</h2>
          {activeDashboard.weakTopics.length > 0 ? (
            <ul className="topic-list weak-list">
              {activeDashboard.weakTopics.map(t => <li key={t}>⚠ {t}</li>)}
            </ul>
          ) : (
            <p className="progress-empty">Great job! No weak topics detected.</p>
          )}
        </div>
      </div>

      <div className="progress-block">
        <h2>Recommended Next Steps</h2>
        {activeDashboard.recommendedTopics.length > 0 ? (
          <ul className="topic-list recommended-list">
            {activeDashboard.recommendedTopics.map(t => <li key={t}>→ {t}</li>)}
          </ul>
        ) : (
          <p className="progress-empty">All covered. Keep practicing to retain mastery!</p>
        )}
      </div>

      <div className="progress-certificate-card">
        <div className="cert-card-left">
          <div className="cert-card-badge">🎓</div>
          <div>
            <h3>Official Visual DSA Certification</h3>
            <p>
              Download or print your personalized Certificate of Completion in Data Structures &amp; Algorithms to showcase on LinkedIn or your portfolio.
            </p>
          </div>
        </div>
        <button
          className="cert-claim-btn"
          onClick={() => setShowCertModal(true)}
        >
          <span>📜</span> Get Certificate
        </button>
      </div>

      <div className="progress-actions">
        <Link to="/practice" className="progress-action-btn">Practice More</Link>
        <Link to="/basics" className="progress-action-btn outline">Continue Learning</Link>
      </div>

      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        defaultName={user?.username || ''}
        completionPercentage={activeDashboard.overallProgress}
        topicsCompleted={activeDashboard.topicsCompleted}
        totalTopics={activeDashboard.totalTopics}
        learningLevel={activeDashboard.learningLevel || 'Intermediate'}
      />
    </div>
  );
}