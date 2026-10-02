import type { ReactNode } from 'react';
import './TopicLayout.css';

interface TopicLayoutProps {
  theory: ReactNode;
  visualization: ReactNode;
  photo?: ReactNode;
}

export function TopicLayout({ theory, visualization, photo }: TopicLayoutProps) {
  return (
    <div className="topic-layout">
      <div className="topic-theory">
        {theory}
      </div>
      <div className="topic-visualization">
        {visualization}
      </div>
      {photo && (
        <div>
          {photo}
        </div>
      )}
    </div>
  );
}
