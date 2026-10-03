import { DocumentStatus, Address } from './index';

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
  rating: number;
  balance: number;
  companyId: string;
}

export interface PurchaseRequisition {
  id: string;
  number: string;
  date: string;
  requestedBy: string;
  department: string;
  notes: string;
  status: DocumentStatus;
  lines: PurchaseLine[];
  companyId: string;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  vendorId: string;
  vendorName: string;
  date: string;
  expectedDate: string;
  status: DocumentStatus;
  lines: PurchaseLine[];
  notes: string;
  total: number;
  approvedBy?: string;
  companyId: string;
}

export interface PurchaseLine {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  description: string;
  quantity: number;
  received: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface GoodsReceipt {
  id: string;
  number: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  date: string;
  status: DocumentStatus;
  lines: GoodsReceiptLine[];
  companyId: string;
}

export interface GoodsReceiptLine {
  productId: string;
  productName: string;
  orderQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unitPrice: number;
}

export interface VendorContract {
  id: string;
  number: string;
  vendorId: string;
  vendorName: string;
  title: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'active' | 'expired' | 'terminated' | 'draft';
  terms: string;
  companyId: string;
}
