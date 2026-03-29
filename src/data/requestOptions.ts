import { RequestCategory, RequestPriority, RequestStatus } from '../types';

export const requestCategories: RequestCategory[] = [
  'Access / Permissions',
  'Application Support',
  'Business Process Automation',
  'Data / Reporting',
  'Infrastructure',
  'Service Desk',
];

export const requestPriorities: RequestPriority[] = ['Low', 'Medium', 'High'];

export const requestStatusOrder: RequestStatus[] = [
  'Submitted',
  'In Review',
  'Approved',
  'Rejected',
  'In Progress',
  'Completed',
];
