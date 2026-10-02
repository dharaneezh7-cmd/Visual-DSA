import { useState, useRef } from 'react';
import './CertificateModal.css';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
  completionPercentage?: number;
  topicsCompleted?: number;
  totalTopics?: number;
  learningLevel?: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  defaultName = 'Learner',
  completionPercentage = 100,
  topicsCompleted = 8,
  totalTopics = 8,
  learningLevel = 'Mastery',
}: CertificateModalProps) {
  const [recipientName, setRecipientName] = useState(defaultName || 'Learner');
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const certId = `VDSA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Handle direct print/save as PDF using browser's native print engine
  const handlePrint = () => {
    window.print();
  };

  // Handle image download via HTML Canvas rendering
  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 810;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Double Border
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // Header Logo Icon
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 25, 75, 50, 50, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V', width / 2, 100);

    // Brand Name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('Visual DSA', width / 2, 145);

    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('INTERACTIVE DATA STRUCTURES & ALGORITHMS', width / 2, 168);

    // Subtitle
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('CERTIFICATE OF ACCOMPLISHMENT', width / 2, 220);

    // Main Certificate Heading
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 42px Georgia, serif';
    ctx.fillText('Data Structures & Algorithms', width / 2, 270);

    // Presented To
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillText('This certificate is proudly awarded to', width / 2, 325);

    // Recipient Name
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText(recipientName || 'Learner', width / 2, 380);

    // Underline for name
    ctx.strokeStyle = '#fdba74';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 220, 395);
    ctx.lineTo(width / 2 + 220, 395);
    ctx.stroke();

    // Description text
    ctx.fillStyle = '#334155';
    ctx.font = '18px sans-serif';
    ctx.fillText(
      'for successfully mastering and demonstrating conceptual understanding of core Data Structures,',
      width / 2,
      440
    );
    ctx.fillText(
      'step-by-step memory operations, and algorithmic runtime complexities on the Visual DSA platform.',
      width / 2,
      470
    );

    // Stats Box
    ctx.fillStyle = '#fff7ed';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 280, 505, 560, 60, 8);
    ctx.fill();
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#c2410c';
    ctx.fillText(`${completionPercentage}%`, width / 2 - 180, 532);
    ctx.fillText(`${topicsCompleted} / ${totalTopics}`, width / 2, 532);
    ctx.fillText(learningLevel, width / 2 + 180, 532);

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#7c2d12';
    ctx.fillText('COMPLETION', width / 2 - 180, 552);
    ctx.fillText('TOPICS MASTERED', width / 2, 552);
    ctx.fillText('PROFICIENCY', width / 2 + 180, 552);

    // Seal in Center
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.arc(width / 2, 650, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#9a3412';
    ctx.fillText('⭐', width / 2, 642);
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('VERIFIED', width / 2, 665);

    // Issue Date Left
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(issueDate, 120, 650);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(120, 660);
    ctx.lineTo(280, 660);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('DATE OF ISSUANCE', 120, 680);

    // Instructor / Platform Signature Right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic bold 22px Georgia, cursive';
    ctx.fillText('Visual DSA Academic Team', width - 120, 648);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width - 320, 660);
    ctx.lineTo(width - 120, 660);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('AUTHORIZED INSTRUCTION TEAM', width - 120, 680);

    // Verification ID Bottom
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText(`Certificate ID: ${certId} • Validated at visualdsa.app`, width / 2, 735);

    // Trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Visual_DSA_Certificate_${recipientName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="certificate-modal-overlay" onClick={onClose}>
      <div className="certificate-modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="certificate-modal-header">
          <div className="certificate-modal-title">
            <span>🎓</span> Visual DSA Certificate of Completion
          </div>
          <button className="certificate-modal-close" onClick={onClose} title="Close window">
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="certificate-modal-body">
          {/* Customizer */}
          <div className="certificate-customizer">
            <div className="customizer-field">
              <label htmlFor="recipient-name">Recipient Name:</label>
              <input
                id="recipient-name"
                type="text"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                placeholder="Enter your name"
                maxLength={40}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Tip: You can edit the name above before downloading or printing.
            </div>
          </div>

          {/* Certificate Paper */}
          <div className="certificate-paper-wrapper">
            <div className="certificate-paper" ref={certificateRef}>
              {/* Decorative Corners */}
              <div className="cert-corner cert-corner-tl"></div>
              <div className="cert-corner cert-corner-tr"></div>
              <div className="cert-corner cert-corner-bl"></div>
              <div className="cert-corner cert-corner-br"></div>

              {/* Brand Header */}
              <div className="cert-header">
                <div className="cert-logo">V</div>
                <div className="cert-brand-text">
                  <div className="cert-brand-name">Visual DSA</div>
                  <div className="cert-brand-tagline">Interactive Learning Platform</div>
                </div>
              </div>

              {/* Title Area */}
              <div className="cert-title-area">
                <div className="cert-super-title">Certificate of Accomplishment</div>
                <h1 className="cert-main-title">Data Structures &amp; Algorithms</h1>
              </div>

              <div className="cert-presented-to">This is proudly awarded to</div>
              <div className="cert-recipient-name">{recipientName || 'Learner'}</div>

              <p className="cert-description">
                for demonstrating dedication and proficiency in understanding core Data Structures,
                animating memory state transformations, and mastering algorithm complexity analysis on the Visual DSA platform.
              </p>

              {/* Achievement Stats */}
              <div className="cert-stats-row">
                <div className="cert-stat-item">
                  <span className="cert-stat-val">{completionPercentage}%</span>
                  <span className="cert-stat-lbl">Mastery</span>
                </div>
                <div className="cert-stat-item">
                  <span className="cert-stat-val">{topicsCompleted} / {totalTopics}</span>
                  <span className="cert-stat-lbl">Topics Explored</span>
                </div>
                <div className="cert-stat-item">
                  <span className="cert-stat-val">{learningLevel}</span>
                  <span className="cert-stat-lbl">Level</span>
                </div>
              </div>

              {/* Footer with Signatures and Seal */}
              <div className="cert-footer">
                <div className="cert-footer-col">
                  <div className="cert-sig-line"></div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{issueDate}</div>
                  <div className="cert-sig-subtitle">Date of Issue</div>
                </div>

                <div className="cert-seal-badge">
                  <span className="cert-seal-icon">🏆</span>
                  <span className="cert-seal-text">Verified</span>
                </div>

                <div className="cert-footer-col">
                  <div className="cert-sig-line"></div>
                  <div className="cert-sig-cursive">Visual DSA</div>
                  <div className="cert-sig-title">Instruction Team</div>
                </div>
              </div>

              {/* Certificate ID */}
              <div className="cert-id-strip">
                ID: {certId} • Verified by Visual DSA Learning Certification
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="certificate-modal-actions">
          <button className="cert-btn cert-btn-secondary" onClick={onClose}>
            Back to Progress
          </button>
          <div className="cert-download-btns">
            <button className="cert-btn cert-btn-secondary" onClick={handlePrint}>
              <span>🖨️</span> Print / Save as PDF
            </button>
            <button className="cert-btn cert-btn-primary" onClick={handleDownloadPNG}>
              <span>📥</span> Download Image (PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
