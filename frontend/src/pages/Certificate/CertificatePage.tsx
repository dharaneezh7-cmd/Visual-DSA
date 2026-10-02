import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import CertificateModal from '../../components/Certificate/CertificateModal';
import './CertificatePage.css';

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

export default function CertificatePage() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const [showModal, setShowModal] = useState(false);

  // Compute live progress stats
  const stats = useMemo(() => {
    let completedTopics = 0;
    let sumPct = 0;

    const topicMap: Record<string, { completed: boolean; maxPct: number }> = {};
    for (const t of ALL_TOPICS) {
      topicMap[t] = { completed: false, maxPct: 0 };
    }

    for (const p of progress) {
      if (topicMap[p.topic]) {
        if (p.completed) topicMap[p.topic].completed = true;
        topicMap[p.topic].maxPct = Math.max(topicMap[p.topic].maxPct, p.completionPercentage || 0);
      }
    }

    for (const t of ALL_TOPICS) {
      if (topicMap[t].completed || topicMap[t].maxPct >= 100) {
        completedTopics += 1;
      }
      sumPct += topicMap[t].maxPct;
    }

    const overall = Math.min(100, Math.round(sumPct / ALL_TOPICS.length));
    const level = overall >= 80 ? 'Mastery' : overall >= 50 ? 'Intermediate' : overall >= 20 ? 'Practitioner' : 'Explorer';

    return {
      overall,
      completedTopics,
      totalTopics: ALL_TOPICS.length,
      level,
    };
  }, [progress]);

  return (
    <div className="cert-page-container">
      {/* Hero Showcase */}
      <div className="cert-page-hero">
        <div className="cert-hero-badge">🎓 OFFICIAL RECOGNITION</div>
        <h1 className="cert-page-title">Visual DSA Certification</h1>
        <p className="cert-page-subtitle">
          Earn, customize, and download your verified Certificate of Completion. Showcase your algorithmic thinking and data structure mastery on your resume and LinkedIn.
        </p>
      </div>

      {/* Main Grid */}
      <div className="cert-page-grid">
        {/* Certificate Mini Preview Card */}
        <div className="cert-preview-card">
          <div className="cert-preview-frame">
            <div className="cert-preview-inner">
              <div className="preview-logo">V</div>
              <div className="preview-title">Certificate of Accomplishment</div>
              <div className="preview-subject">Data Structures &amp; Algorithms</div>
              <div className="preview-for">Awarded to:</div>
              <div className="preview-name">{user?.username || 'Your Name'}</div>
              <div className="preview-stats">
                <span>{stats.overall}% Complete</span> • <span>{stats.completedTopics}/{stats.totalTopics} Topics</span>
              </div>
              <div className="preview-stamp">🏆 VERIFIED</div>
            </div>
          </div>

          <div className="cert-preview-cta">
            <button
              className="cert-page-btn-primary"
              onClick={() => setShowModal(true)}
            >
              <span></span> View &amp; Download Full Certificate
            </button>
            <p className="cert-preview-hint">
              Available instantly in high-resolution PNG or printable PDF.
            </p>
          </div>
        </div>

        {/* Benefits & Verification */}
        <div className="cert-info-card">
          <h2>Why get certified with Visual DSA?</h2>

          <div className="cert-features-list">
            <div className="cert-feature-item">
              <span className="cert-feat-icon">🔍</span>
              <div>
                <h4>Interactive &amp; Visual Verification</h4>
                <p>Confirms practical understanding of step-by-step memory pointer mutations and animations, not just passive rote theory.</p>
              </div>
            </div>

            <div className="cert-feature-item">
              <span className="cert-feat-icon">💼</span>
              <div>
                <h4>Portfolio &amp; LinkedIn Ready</h4>
                <p>Comes with a unique validation serial ID and date stamp that you can attach to job applications and portfolio repositories.</p>
              </div>
            </div>

            <div className="cert-feature-item">
              <span className="cert-feat-icon">⚡</span>
              <div>
                <h4>Instant High-Res Export</h4>
                <p>One-click PDF print styling or direct PNG image download with customizable recipient name.</p>
              </div>
            </div>
          </div>

          <div className="cert-progress-status-box">
            <div className="cert-status-header">
              <span>Your Current Completion</span>
              <strong>{stats.overall}%</strong>
            </div>
            <div className="cert-progress-bar">
              <div className="cert-progress-fill" style={{ width: `${Math.max(8, stats.overall)}%` }}></div>
            </div>
            <div className="cert-status-footer">
              <span>Topics mastered: {stats.completedTopics} of {stats.totalTopics}</span>
              <Link to="/progress" className="cert-check-link">View Detailed Progress &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      <CertificateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        defaultName={user?.username || ''}
        completionPercentage={stats.overall}
        topicsCompleted={stats.completedTopics}
        totalTopics={stats.totalTopics}
        learningLevel={stats.level}
      />
    </div>
  );
}