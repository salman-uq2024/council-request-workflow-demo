import { useEffect, useState } from 'react';
import { AdminReviewPanel } from './components/AdminReviewPanel';
import { AuditHistoryView } from './components/AuditHistoryView';
import { RequestForm } from './components/RequestForm';
import { StatusDashboard } from './components/StatusDashboard';
import { ViewTabs } from './components/ViewTabs';
import {
  applyAdminAction,
  buildRequest,
  loadRequests,
  resetRequests,
  saveRequests,
} from './data/workflow';
import { AdminAction, RequestFormValues, ServiceRequest, ViewKey } from './types';

export default function App() {
  const [requests, setRequests] = useState<ServiceRequest[]>(() => loadRequests());
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    requests[0]?.id ?? null,
  );
  const [bannerMessage, setBannerMessage] = useState<string>(
    'Demo data is stored locally in your browser for simple portfolio review.',
  );

  useEffect(() => {
    saveRequests(requests);
  }, [requests]);

  useEffect(() => {
    if (!requests.length) {
      setSelectedRequestId(null);
      return;
    }

    const hasSelection = requests.some((request) => request.id === selectedRequestId);
    if (!hasSelection) {
      setSelectedRequestId(requests[0].id);
    }
  }, [requests, selectedRequestId]);

  function handleSubmit(values: RequestFormValues) {
    const nextRequest = buildRequest(requests, values);
    setRequests((current) => {
      return [nextRequest, ...current];
    });
    setSelectedRequestId(nextRequest.id);
    setBannerMessage('New request submitted and added to the dashboard queue.');
    setActiveView('dashboard');
  }

  function handleAdminAction(requestId: string, action: AdminAction, note: string) {
    setRequests((current) =>
      applyAdminAction(current, requestId, action, note, 'Applications Team Lead'),
    );
    setBannerMessage(`Request ${requestId} updated via the admin review workflow.`);
  }

  function handleResetDemo() {
    const nextRequests = resetRequests();
    setRequests(nextRequests);
    setSelectedRequestId(nextRequests[0]?.id ?? null);
    setBannerMessage('Demo data reset to the seeded council workflow examples.');
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Portfolio Demo</p>
          <h1>Internal Service Request Workflow</h1>
          <p className="hero-copy">
            A realistic council-style workflow showing request intake, operational
            visibility, review controls, and audit history in a compact local-first app.
          </p>
        </div>

        <div className="hero-actions">
          <div className="stat-block">
            <span>Total Requests</span>
            <strong>{requests.length}</strong>
          </div>
          <button className="button subtle" type="button" onClick={handleResetDemo}>
            Reset demo data
          </button>
        </div>
      </header>

      <div className="banner" role="status">
        {bannerMessage}
      </div>

      <ViewTabs activeView={activeView} onChange={setActiveView} />

      <main className="workspace">
        {activeView === 'submit' && <RequestForm onSubmit={handleSubmit} />}

        {activeView === 'dashboard' && (
          <StatusDashboard
            requests={requests}
            selectedRequestId={selectedRequestId}
            onSelectRequest={setSelectedRequestId}
            onOpenAdmin={() => setActiveView('admin')}
            onOpenAudit={() => setActiveView('audit')}
          />
        )}

        {activeView === 'admin' && (
          <AdminReviewPanel
            requests={requests}
            selectedRequestId={selectedRequestId}
            onSelectRequest={setSelectedRequestId}
            onAction={handleAdminAction}
            onOpenAudit={() => setActiveView('audit')}
          />
        )}

        {activeView === 'audit' && (
          <AuditHistoryView
            requests={requests}
            selectedRequestId={selectedRequestId}
            onSelectRequest={setSelectedRequestId}
          />
        )}
      </main>
    </div>
  );
}
