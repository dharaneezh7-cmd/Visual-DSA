import type { ReactNode } from 'react';
import './LearningComponents.css';

interface TheoryPanelProps {
  title: string;
  children: ReactNode;
}

export function TheoryPanel({ title, children }: TheoryPanelProps) {
  return (
    <div className="theory-panel">
      <h2 className="theory-title">{title}</h2>
      <div className="theory-content">{children}</div>
    </div>
  );
}

interface ConceptSectionProps {
  heading: string;
  children: ReactNode;
}

export function ConceptSection({ heading, children }: ConceptSectionProps) {
  return (
    <div className="concept-section">
      <h3>{heading}</h3>
      <div>{children}</div>
    </div>
  );
}

interface ExampleSectionProps {
  title?: string;
  children: ReactNode;
}

export function ExampleSection({ title = 'Example', children }: ExampleSectionProps) {
  return (
    <div className="example-section">
      <h4 className="example-heading">{title}</h4>
      <div className="example-content">{children}</div>
    </div>
  );
}

interface StepExplanationProps {
  steps: { step: number; description: string; highlight?: string }[];
}

export function StepExplanation({ steps }: StepExplanationProps) {
  if (steps.length === 0) return null;
  return (
    <div className="step-explanation">
      <h4>Step-by-Step</h4>
      <ol className="step-list">
        {steps.map(s => (
          <li key={s.step} className="step-item">
            <span className="step-number">{s.step}</span>
            <div>
              <p className="step-desc">{s.description}</p>
              {s.highlight && <span className="step-highlight">{s.highlight}</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface ComplexityCardProps {
  complexities: { operation: string; time: string; space?: string }[];
}

export function ComplexityCard({ complexities }: ComplexityCardProps) {
  return (
    <div className="complexity-card">
      <h4>Time Complexity</h4>
      <div className="complexity-table">
        {complexities.map(c => (
          <div key={c.operation} className="complexity-row">
            <span className="complexity-op">{c.operation}</span>
            <span className="complexity-val">{c.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
