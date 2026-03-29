import { ServiceRequest } from '../types';
import { formatDate, getRecentActivity } from '../data/workflow';

interface AuditHistoryViewProps {
  requests: ServiceRequest[];
  selectedRequestId: string | null;
  onSelectRequest: (requestId: string) => void;
}

export function AuditHistoryView({
  requests,
  selectedRequestId,
  onSelectRequest,
}: AuditHistoryViewProps) {
  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ?? requests[0];
  const recentActivity = getRecentActivity(requests);
  const selectedHistory = selectedRequest
    ? [...selectedRequest.history].sort(
        (left, right) =>
          new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
      )
    : [];

  if (!requests.length) {
    return (
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Recent Activity</p>
            <h2>Cross-request audit feed</h2>
          </div>
        </div>
        <div className="empty-state">
          <h3>No audit history available</h3>
          <p>The audit feed will appear once sample data is restored or a request is submitted.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="audit-layout">
      <article className="panel recent-panel">
        <div className="panel-header compact">
          <div>
            <p className="eyebrow">Recent Activity</p>
            <h2>Cross-request audit feed</h2>
          </div>
        </div>

        <div className="timeline">
          {recentActivity.length ? (
            recentActivity.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="timeline-item"
                onClick={() => onSelectRequest(entry.requestId)}
              >
                <div className="timeline-marker" />
                <div>
                  <strong>{entry.action}</strong>
                  <p>
                    {entry.requestId} • {entry.requestTitle}
                  </p>
                  <span>
                    {entry.actor} • {formatDate(entry.timestamp)}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="empty-state compact">
              <h3>No recent activity</h3>
              <p>Workflow actions will appear here as records move through the process.</p>
            </div>
          )}
        </div>
      </article>

      <article className="panel detail-panel">
        {selectedRequest ? (
          <>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Selected Audit</p>
                <h2>{selectedRequest.id}</h2>
              </div>
              <div className="request-meta">
                <strong>{selectedRequest.title}</strong>
                <span>{selectedRequest.department}</span>
              </div>
            </div>

            <div className="timeline">
              {selectedHistory.length ? (
                selectedHistory.map((entry) => (
                  <div key={entry.id} className="timeline-item static">
                    <div className="timeline-marker" />
                    <div>
                      <strong>{entry.action}</strong>
                      <p>{entry.note}</p>
                      <span>
                        {entry.actor} • {formatDate(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state compact">
                  <h3>No request history</h3>
                  <p>This request does not have any audit entries yet.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <p>No audit data available.</p>
        )}
      </article>
    </section>
  );
}
