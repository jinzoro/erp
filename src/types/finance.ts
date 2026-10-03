import { DocumentStatus } from './index';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  subtype: string;
  parentId?: string;
  isActive: boolean;
  balance: number;
  currency: string;
  companyId: string;
}

export interface JournalEntry {
  id: string;
  number: string;
  date: string;
  description: string;
  reference: string;
  lines: JournalLine[];
  status: DocumentStatus;
  createdBy: string;
  approvedBy?: string;
  companyId: string;
  createdAt: string;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  costCenterId?: string;
}

export interface Vendor {
  id: string;
  code: string;
  name: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  currency: string;
  isActive: boolean;
  balance: number;
  companyId: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  currency: string;
  creditLimit: number;
  isActive: boolean;
  balance: number;
  companyId: string;
}

export interface Bill {
  id: string;
  number: string;
  vendorId: string;
  vendorName: string;
  date: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: DocumentStatus;
  lines: BillLine[];
  companyId: string;
}

export interface BillLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  accountId: string;
  taxRate: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: DocumentStatus;
  lines: InvoiceLine[];
  companyId: string;
}

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  accountId: string;
  taxRate: number;
}

export interface Payment {
  id: string;
  number: string;
  date: string;
  amount: number;
  type: 'incoming' | 'outgoing';
  method: string;
  reference: string;
  status: DocumentStatus;
  companyId: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: 'sales' | 'purchase' | 'both';
  isActive: boolean;
  companyId: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  managerId?: string;
  isActive: boolean;
  companyId: string;
}

export interface Budget {
  id: string;
  fiscalYear: number;
  accountId: string;
  costCenterId?: string;
  amount: number;
  spent: number;
  remaining: number;
}
