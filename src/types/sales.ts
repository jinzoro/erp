import { DocumentStatus } from './index';

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  score: number;
  assignedTo: string;
  notes: string;
  companyId: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  leadId?: string;
  title: string;
  customerId: string;
  customerName: string;
  amount: number;
  probability: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  assignedTo: string;
  expectedCloseDate: string;
  notes: string;
  companyId: string;
}

export interface Quotation {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string;
  validUntil: string;
  status: DocumentStatus;
  lines: SalesLine[];
  subtotal: number;
  taxTotal: number;
  total: number;
  notes: string;
  companyId: string;
}

export interface SalesOrder {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string;
  deliveryDate: string;
  status: DocumentStatus;
  lines: SalesLine[];
  subtotal: number;
  taxTotal: number;
  total: number;
  paid: number;
  balance: number;
  notes: string;
  companyId: string;
}

export interface SalesLine {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  description: string;
  quantity: number;
  delivered: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface Ticket {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  assignedTo: string;
  companyId: string;
  createdAt: string;
}
