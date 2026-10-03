import { DocumentStatus, Address } from './index';

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  unit: string;
  price: number;
  cost: number;
  taxRate: number;
  isActive: boolean;
  image?: string;
  barcode?: string;
  sku: string;
  weight?: number;
  volume?: number;
  attributes: Record<string, string>;
  companyId: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  parentId?: string;
  description: string;
  isActive: boolean;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  branchId: string;
  isActive: boolean;
  companyId: string;
}

export interface StockMovement {
  id: string;
  date: string;
  type: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return';
  productId: string;
  productName: string;
  productCode: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  reference: string;
  referenceType: string;
  notes: string;
  companyId: string;
}

export interface StockLevel {
  productId: string;
  productName: string;
  productCode: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  reorderQuantity: number;
}

export interface Batch {
  id: string;
  code: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  expiryDate?: string;
  manufacturingDate?: string;
  status: 'active' | 'expired' | 'blocked';
}

export interface Transfer {
  id: string;
  number: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  status: DocumentStatus;
  lines: TransferLine[];
  companyId: string;
}

export interface TransferLine {
  productId: string;
  productName: string;
  quantity: number;
}

export interface CycleCount {
  id: string;
  number: string;
  warehouseId: string;
  status: 'planned' | 'in-progress' | 'completed';
  lines: CycleCountLine[];
  companyId: string;
}

export interface CycleCountLine {
  productId: string;
  productName: string;
  expectedQuantity: number;
  actualQuantity: number;
  variance: number;
}
