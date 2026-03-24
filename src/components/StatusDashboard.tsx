import { ServiceRequest } from '../types';
import { formatDate, getStatusCounts } from '../data/workflow';

interface StatusDashboardProps {
  requests: ServiceRequest[];
  selectedRequestId: string | null;
  onSelectRequest: (requestId: string) => void;
  onOpenAdmin: () => void;
  onOpenAudit: () => void;
}

const statusOrder = [
  'Submitted',
  'In Review',
  'Approved',
  'Rejected',
  'In Progress',
  'Completed',
] as const;

export function StatusDashboard({
  requests,
  selectedRequestId,
  onSelectRequest,
  onOpenAdmin,
  onOpenAudit,
}: StatusDashboardProps) {
  function toStatusClass(status: ServiceRequest['status']) {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  const statusCounts = getStatusCounts(requests);
  const sortedRequests = [...requests].sort(
    (left, right) =>
      new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
  );

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Operational View</p>
          <h2>Service request status dashboard</h2>
        </div>
        <p className="panel-intro">
          A simple workload view showing queue volume, priority, ownership, and
          current status for internal service requests.
        </p>
      </div>

      <div className="summary-grid">
        {statusOrder.map((status) => (
          <article key={status} className="summary-card">
            <span className="summary-label">{status}</span>
            <strong className="summary-value">{statusCounts[status]}</strong>
          </article>
        ))}
      </div>

      <div className="table-toolbar">
        <div>
          <h3>Current requests</h3>
          <p>{requests.length} total items across the demo workflow.</p>
        </div>
        <div className="toolbar-actions">
          <button className="button subtle" type="button" onClick={onOpenAdmin}>
            Open admin review
          </button>
          <button className="button subtle" type="button" onClick={onOpenAudit}>
            Open audit history
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Team</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {sortedRequests.map((request) => (
              <tr
                key={request.id}
                className={request.id === selectedRequestId ? 'is-selected' : ''}
                onClick={() => onSelectRequest(request.id)}
              >
                <td>
                  <div className="request-cell">
                    <strong>{request.id}</strong>
                    <span>{request.title}</span>
                  </div>
                </td>
                <td>{request.department}</td>
                <td>
                  <span className={`badge priority-${request.priority.toLowerCase()}`}>
                    {request.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge status-${toStatusClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td>{request.assignedTeam}</td>
                <td>{formatDate(request.submittedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
