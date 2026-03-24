import seedRequestsJson from './seed-requests.json';
import {
  AdminAction,
  RequestFormValues,
  RequestStatus,
  ServiceRequest,
} from '../types';

const STORAGE_KEY = 'council-request-workflow-demo.requests';

const seedRequests = seedRequestsJson as ServiceRequest[];

const actionConfig: Record<
  AdminAction,
  { action: string; status: RequestStatus; defaultNote: string }
> = {
  review: {
    action: 'Moved to review',
    status: 'In Review',
    defaultNote: 'Queued for assessment by the Applications and Automation team.',
  },
  approve: {
    action: 'Request approved',
    status: 'Approved',
    defaultNote: 'Approved to proceed under standard delivery controls.',
  },
  reject: {
    action: 'Request rejected',
    status: 'Rejected',
    defaultNote: 'Returned to the requester pending scope clarification.',
  },
  start: {
    action: 'Work started',
    status: 'In Progress',
    defaultNote: 'Implementation work has started.',
  },
  complete: {
    action: 'Request completed',
    status: 'Completed',
    defaultNote: 'Request has been delivered and closed.',
  },
  reopen: {
    action: 'Request reopened',
    status: 'In Review',
    defaultNote: 'Request reopened for further assessment.',
  },
};

function cloneSeedRequests() {
  return JSON.parse(JSON.stringify(seedRequests)) as ServiceRequest[];
}

export function loadRequests(): ServiceRequest[] {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return cloneSeedRequests();
  }

  try {
    return JSON.parse(stored) as ServiceRequest[];
  } catch {
    return cloneSeedRequests();
  }
}

export function saveRequests(requests: ServiceRequest[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function resetRequests() {
  const nextRequests = cloneSeedRequests();
  saveRequests(nextRequests);
  return nextRequests;
}

function createId(existingRequests: ServiceRequest[]) {
  const nextNumber = existingRequests.length + 1;
  return `REQ-2026-${String(nextNumber).padStart(3, '0')}`;
}

function createAuditId(requestId: string, historyLength: number) {
  return `AUD-${requestId}-${historyLength + 1}`;
}

export function buildRequest(
  existingRequests: ServiceRequest[],
  values: RequestFormValues,
): ServiceRequest {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + (values.priority === 'High' ? 5 : 10));

  const requestId = createId(existingRequests);

  return {
    id: requestId,
    title: values.title,
    category: values.category,
    description: values.description,
    department: values.department,
    location: values.location,
    priority: values.priority,
    requesterName: values.requesterName,
    requesterEmail: values.requesterEmail,
    submittedAt: now.toISOString(),
    status: 'Submitted',
    assignedTeam: 'ICT Service Desk',
    targetDate: targetDate.toISOString(),
    history: [
      {
        id: createAuditId(requestId, 0),
        timestamp: now.toISOString(),
        actor: values.requesterName,
        action: 'Request submitted',
        note: 'New service request lodged through the internal workflow form.',
      },
    ],
  };
}

export function applyAdminAction(
  requests: ServiceRequest[],
  requestId: string,
  adminAction: AdminAction,
  note: string,
  actor: string,
): ServiceRequest[] {
  const config = actionConfig[adminAction];

  return requests.map((request) => {
    if (request.id !== requestId) {
      return request;
    }

    const nextHistory = [
      {
        id: createAuditId(request.id, request.history.length),
        timestamp: new Date().toISOString(),
        actor,
        action: config.action,
        note: note.trim() || config.defaultNote,
      },
      ...request.history,
    ];

    return {
      ...request,
      status: config.status,
      assignedTeam:
        adminAction === 'approve' || adminAction === 'start'
          ? 'Applications and Automation'
          : request.assignedTeam,
      history: nextHistory,
    };
  });
}

export function getActionOptions(status: RequestStatus): AdminAction[] {
  switch (status) {
    case 'Submitted':
      return ['review', 'approve', 'reject'];
    case 'In Review':
      return ['approve', 'reject'];
    case 'Approved':
      return ['start', 'reject'];
    case 'In Progress':
      return ['complete'];
    case 'Rejected':
      return ['reopen'];
    case 'Completed':
      return ['reopen'];
    default:
      return [];
  }
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getStatusCounts(requests: ServiceRequest[]) {
  return requests.reduce<Record<RequestStatus, number>>(
    (counts, request) => {
      counts[request.status] += 1;
      return counts;
    },
    {
      Submitted: 0,
      'In Review': 0,
      Approved: 0,
      Rejected: 0,
      'In Progress': 0,
      Completed: 0,
    },
  );
}

export function getRecentActivity(requests: ServiceRequest[]) {
  return requests
    .flatMap((request) =>
      request.history.map((entry) => ({
        ...entry,
        requestId: request.id,
        requestTitle: request.title,
      })),
    )
    .sort(
      (left, right) =>
        new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
    )
    .slice(0, 10);
}

