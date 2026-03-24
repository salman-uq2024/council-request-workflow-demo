import { useState } from 'react';
import { AdminAction, ServiceRequest } from '../types';
import { formatDate, getActionOptions } from '../data/workflow';

interface AdminReviewPanelProps {
  requests: ServiceRequest[];
  selectedRequestId: string | null;
  onSelectRequest: (requestId: string) => void;
  onAction: (requestId: string, action: AdminAction, note: string) => void;
  onOpenAudit: () => void;
}

const actionLabels: Record<AdminAction, string> = {
  review: 'Move to review',
  approve: 'Approve',
  reject: 'Reject',
  start: 'Start work',
  complete: 'Mark complete',
  reopen: 'Reopen request',
};

export function AdminReviewPanel({
  requests,
  selectedRequestId,
  onSelectRequest,
  onAction,
  onOpenAudit,
}: AdminReviewPanelProps) {
  function toStatusClass(status: ServiceRequest['status']) {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ?? requests[0];
  const [note, setNote] = useState('');

  const queue = [...requests].sort(
    (left, right) =>
      new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
  );

  const actions = selectedRequest ? getActionOptions(selectedRequest.status) : [];

  return (
    <section className="admin-layout">
      <article className="panel queue-panel">
        <div className="panel-header compact">
          <div>
            <p className="eyebrow">Queue</p>
            <h2>Admin review worklist</h2>
          </div>
        </div>
        <div className="queue-list">
          {queue.map((request) => (
            <button
              key={request.id}
              type="button"
              className={
                request.id === selectedRequest?.id ? 'queue-item active' : 'queue-item'
              }
              onClick={() => onSelectRequest(request.id)}
            >
              <div>
                <strong>{request.id}</strong>
                <p>{request.title}</p>
              </div>
              <span className={`badge status-${toStatusClass(request.status)}`}>
                {request.status}
              </span>
            </button>
          ))}
        </div>
      </article>

      <article className="panel review-panel">
        {selectedRequest ? (
          <>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Selected Request</p>
                <h2>{selectedRequest.title}</h2>
              </div>
              <button className="button subtle" type="button" onClick={onOpenAudit}>
                View audit trail
              </button>
            </div>

            <div className="detail-grid">
              <div>
                <span className="detail-label">Request ID</span>
                <strong>{selectedRequest.id}</strong>
              </div>
              <div>
                <span className="detail-label">Status</span>
                <strong>{selectedRequest.status}</strong>
              </div>
              <div>
                <span className="detail-label">Department</span>
                <strong>{selectedRequest.department}</strong>
              </div>
              <div>
                <span className="detail-label">Assigned team</span>
                <strong>{selectedRequest.assignedTeam}</strong>
              </div>
              <div>
                <span className="detail-label">Requester</span>
                <strong>{selectedRequest.requesterName}</strong>
              </div>
              <div>
                <span className="detail-label">Target date</span>
                <strong>{formatDate(selectedRequest.targetDate)}</strong>
              </div>
            </div>

            <div className="content-block">
              <h3>Business need</h3>
              <p>{selectedRequest.description}</p>
            </div>

            <label className="full-width">
              Reviewer note
              <textarea
                rows={4}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Capture the decision, scope note, or governance rationale."
              />
            </label>

            <div className="toolbar-actions">
              {actions.map((action) => (
                <button
                  key={action}
                  className={action === 'reject' ? 'button danger' : 'button primary'}
                  type="button"
                  onClick={() => {
                    onAction(selectedRequest.id, action, note);
                    setNote('');
                  }}
                >
                  {actionLabels[action]}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p>No request selected.</p>
        )}
      </article>
    </section>
  );
}
