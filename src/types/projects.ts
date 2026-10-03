import { DocumentStatus } from './index';

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  customerId?: string;
  customerName?: string;
  managerId: string;
  managerName: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  companyId: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  actualHours: number;
  dueDate: string;
  parentId?: string;
}

export interface Timesheet {
  id: string;
  employeeId: string;
  employeeName: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  date: string;
  hours: number;
  description: string;
  status: DocumentStatus;
  approvedBy?: string;
}
