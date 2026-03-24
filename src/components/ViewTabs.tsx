import { ViewKey } from '../types';

interface ViewTabsProps {
  activeView: ViewKey;
  onChange: (view: ViewKey) => void;
}

const views: Array<{ key: ViewKey; label: string; description: string }> = [
  {
    key: 'submit',
    label: 'Request Submission',
    description: 'Capture a new internal request',
  },
  {
    key: 'dashboard',
    label: 'Status Dashboard',
    description: 'Track workload and service health',
  },
  {
    key: 'admin',
    label: 'Admin Review',
    description: 'Assess, approve, or reject requests',
  },
  {
    key: 'audit',
    label: 'Audit History',
    description: 'Review end-to-end request activity',
  },
];

export function ViewTabs({ activeView, onChange }: ViewTabsProps) {
  return (
    <nav className="tab-grid" aria-label="Workflow views">
      {views.map((view) => (
        <button
          key={view.key}
          type="button"
          className={view.key === activeView ? 'tab-card active' : 'tab-card'}
          onClick={() => onChange(view.key)}
        >
          <span className="tab-label">{view.label}</span>
          <span className="tab-description">{view.description}</span>
        </button>
      ))}
    </nav>
  );
}

