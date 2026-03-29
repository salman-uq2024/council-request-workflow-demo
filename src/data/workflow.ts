import sampleRequestRecordsJson from './sample-request-records.json';
import {
  AdminAction,
  AuditEntry,
  RequestFormValues,
  RequestPriority,
  RequestCategory,
  RequestStatus,
  ServiceRequest,
} from '../types';
import {
  requestCategories,
  requestPriorities,
  requestStatusOrder,
} from './requestOptions';

const STORAGE_KEY = 'council-request-workflow-demo.requests';

const sampleRequestRecords = sampleRequestRecordsJson as ServiceRequest[];

interface RequestLoadResult {
  requests: ServiceRequest[];
  warningMessage?: string;
}

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

function cloneSampleRequestRecords() {
  return JSON.parse(JSON.stringify(sampleRequestRecords)) as ServiceRequest[];
}

// Lightweight runtime guards keep the demo usable if localStorage is edited or corrupted.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRequestCategory(value: unknown): value is RequestCategory {
  return requestCategories.includes(value as RequestCategory);
}

function isRequestPriority(value: unknown): value is RequestPriority {
  return requestPriorities.includes(value as RequestPriority);
}

function isRequestStatus(value: unknown): value is RequestStatus {
  return requestStatusOrder.includes(value as RequestStatus);
}

function isAuditEntry(value: unknown): value is AuditEntry {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.timestamp === 'string' &&
    typeof value.actor === 'string' &&
    typeof value.action === 'string' &&
    typeof value.note === 'string'
  );
}

function isServiceRequest(value: unknown): value is ServiceRequest {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    isRequestCategory(value.category) &&
    typeof value.description === 'string' &&
    typeof value.department === 'string' &&
    typeof value.location === 'string' &&
    isRequestPriority(value.priority) &&
    typeof value.requesterName === 'string' &&
    typeof value.requesterEmail === 'string' &&
    typeof value.submittedAt === 'string' &&
    isRequestStatus(value.status) &&
    typeof value.assignedTeam === 'string' &&
    typeof value.targetDate === 'string' &&
    Array.isArray(value.history) &&
    value.history.every(isAuditEntry)
  );
}

export function loadRequests(): RequestLoadResult {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return { requests: cloneSampleRequestRecords() };
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed) || !parsed.every(isServiceRequest)) {
      return {
        requests: cloneSampleRequestRecords(),
        warningMessage:
          'Saved demo data was invalid and has been reset to the sample request records.',
      };
    }

    return { requests: parsed };
  } catch {
    return {
      requests: cloneSampleRequestRecords(),
      warningMessage:
        'Saved demo data could not be read and has been reset to the sample request records.',
    };
  }
}

export function saveRequests(requests: ServiceRequest[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    return null;
  } catch {
    return 'Browser storage is unavailable, so changes could not be saved locally.';
  }
}

export function resetRequests() {
  const nextRequests = cloneSampleRequestRecords();
  const warningMessage = saveRequests(nextRequests) ?? undefined;
  return {
    requests: nextRequests,
    warningMessage,
  };
}

function createId(existingRequests: ServiceRequest[]) {
  const nextNumber =
    existingRequests.reduce((highestNumber, request) => {
      const requestParts = request.id.split('-');
      const requestNumber = Number(requestParts[requestParts.length - 1]);
      return Number.isNaN(requestNumber)
        ? highestNumber
        : Math.max(highestNumber, requestNumber);
    }, 0) + 1;

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
  const counts = requestStatusOrder.reduce<Record<RequestStatus, number>>(
    (nextCounts, status) => {
      nextCounts[status] = 0;
      return nextCounts;
    },
    {} as Record<RequestStatus, number>,
  );

  for (const request of requests) {
    counts[request.status] += 1;
  }

  return counts;
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
