import { Address, DocumentStatus } from './index';

export interface Employee {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  position: string;
  managerId?: string;
  hireDate: string;
  salary: number;
  currency: string;
  status: 'active' | 'inactive' | 'terminated';
  address: Address;
  companyId: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'holiday';
  hours: number;
}

export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'other';
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: DocumentStatus;
  approvedBy?: string;
}

export interface Payroll {
  id: string;
  number: string;
  period: string;
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: DocumentStatus;
  paymentDate?: string;
}

export interface ExpenseClaim {
  id: string;
  number: string;
  employeeId: string;
  employeeName: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: DocumentStatus;
  approvedBy?: string;
  receipt?: string;
}

export interface RecruitmentRequest {
  id: string;
  number: string;
  position: string;
  department: string;
  headcount: number;
  type: 'new' | 'replacement';
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'filled' | 'cancelled';
  description: string;
  requirements: string;
}
