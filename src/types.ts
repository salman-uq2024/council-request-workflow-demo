export type RequestStatus =
  | 'Submitted'
  | 'In Review'
  | 'Approved'
  | 'Rejected'
  | 'In Progress'
  | 'Completed';

export type RequestPriority = 'Low' | 'Medium' | 'High';

export type RequestCategory =
  | 'Access / Permissions'
  | 'Application Support'
  | 'Business Process Automation'
  | 'Data / Reporting'
  | 'Infrastructure'
  | 'Service Desk';

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  note: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  category: RequestCategory;
  description: string;
  department: string;
  location: string;
  priority: RequestPriority;
  requesterName: string;
  requesterEmail: string;
  submittedAt: string;
  status: RequestStatus;
  assignedTeam: string;
  targetDate: string;
  history: AuditEntry[];
}

export interface RequestFormValues {
  title: string;
  category: RequestCategory;
  description: string;
  department: string;
  location: string;
  priority: RequestPriority;
  requesterName: string;
  requesterEmail: string;
}

export type NoticeTone = 'info' | 'success' | 'error';

export interface AppNotice {
  tone: NoticeTone;
  message: string;
}

export type AdminAction =
  | 'review'
  | 'approve'
  | 'reject'
  | 'start'
  | 'complete'
  | 'reopen';

export type ViewKey = 'submit' | 'dashboard' | 'admin' | 'audit';
