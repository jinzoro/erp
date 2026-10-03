export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roleId: string;
  companyId: string;
  branchIds: string[];
  departmentId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  taxId: string;
  currency: string;
  language: string;
  timezone: string;
  logo?: string;
  isActive: boolean;
  modules: string[];
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  code: string;
  address: Address;
  isActive: boolean;
}

export interface Department {
  id: string;
  companyId: string;
  branchId: string;
  name: string;
  code: string;
  managerId?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, { old: unknown; new: unknown }>;
  ip: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedBy: string;
  requestedByName: string;
  approverId?: string;
  approverName?: string;
  targetType: string;
  targetId: string;
  targetNumber: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  entityType: string;
  entityId: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  mobile: string;
  role: string;
}

export type DocumentStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterState {
  search: string;
  status: string[];
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
