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
import {
  AdminAction,
  AppNotice,
  RequestFormValues,
  ServiceRequest,
  ViewKey,
} from './types';

export default function App() {
  const [initialLoad] = useState(() => loadRequests());
  const [requests, setRequests] = useState<ServiceRequest[]>(initialLoad.requests);
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    initialLoad.requests[0]?.id ?? null,
  );
  const [notice, setNotice] = useState<AppNotice>(() =>
    initialLoad.warningMessage
      ? { tone: 'error', message: initialLoad.warningMessage }
      : {
          tone: 'info',
          message: 'Sample request data is stored locally in your browser for simple portfolio review.',
        },
  );

  useEffect(() => {
    const saveError = saveRequests(requests);

    if (saveError) {
      setNotice({ tone: 'error', message: saveError });
    }
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
    setNotice({
      tone: 'success',
      message: 'New request submitted and added to the dashboard queue.',
    });
    setActiveView('dashboard');
  }

  function handleAdminAction(requestId: string, action: AdminAction, note: string) {
    const requestExists = requests.some((request) => request.id === requestId);

    if (!requestExists) {
      setNotice({
        tone: 'error',
        message: 'The selected request record could not be found. Reset the demo data and try again.',
      });
      return;
    }

    setRequests((current) =>
      applyAdminAction(current, requestId, action, note, 'Applications Team Lead'),
    );
    setNotice({
      tone: 'success',
      message: `Request ${requestId} updated via the admin review workflow.`,
    });
  }

  function handleResetDemo() {
    const { requests: nextRequests, warningMessage } = resetRequests();
    setRequests(nextRequests);
    setSelectedRequestId(nextRequests[0]?.id ?? null);
    setNotice(
      warningMessage
        ? { tone: 'error', message: warningMessage }
        : {
            tone: 'success',
            message: 'Demo data reset to the sample council workflow records.',
          },
    );
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

      <div className={`banner banner-${notice.tone}`} role="status">
        {notice.message}
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
