import type { Company, Branch, Department, Role, User, AuditLog, Notification, Approval } from '@/types'
import type { Account, JournalEntry, Customer, Bill, Invoice } from '@/types/finance'
import type { Product, Warehouse, StockMovement, StockLevel } from '@/types/inventory'
import type { Employee, Attendance, Leave, Payroll } from '@/types/hr'
import type { PurchaseRequisition, PurchaseOrder, GoodsReceipt, Vendor } from '@/types/procurement'
import type { Lead, Opportunity, Quotation, SalesOrder, Ticket } from '@/types/sales'
import type { Project, Task, Timesheet } from '@/types/projects'

export const companies: Company[] = []
export const branches: Branch[] = []
export const departments: Department[] = []
export const roles: Role[] = []
export const users: User[] = []
export const accounts: Account[] = []
export const journalEntries: JournalEntry[] = []
export const vendors: Vendor[] = []
export const customers: Customer[] = []
export const bills: Bill[] = []
export const invoices: Invoice[] = []
export const products: Product[] = []
export const warehouses: Warehouse[] = []
export const stockMovements: StockMovement[] = []
export const stockLevels: StockLevel[] = []
export const employees: Employee[] = []
export const attendanceRecords: Attendance[] = []
export const leaveRequests: Leave[] = []
export const payrollRecords: Payroll[] = []
export const purchaseRequisitions: PurchaseRequisition[] = []
export const purchaseOrders: PurchaseOrder[] = []
export const goodsReceipts: GoodsReceipt[] = []
export const leads: Lead[] = []
export const opportunities: Opportunity[] = []
export const quotations: Quotation[] = []
export const salesOrders: SalesOrder[] = []
export const supportTickets: Ticket[] = []
export const projects: Project[] = []
export const tasks: Task[] = []
export const timesheets: Timesheet[] = []
export const notifications: Notification[] = []
export const approvals: Approval[] = []
export const auditLogs: AuditLog[] = []

export const mockData = {
  companies, branches, departments, roles, users,
  accounts, journalEntries, vendors, customers, bills, invoices,
  products, warehouses, stockMovements, stockLevels,
  employees, attendanceRecords, leaveRequests, payrollRecords,
  purchaseRequisitions, purchaseOrders, goodsReceipts,
  leads, opportunities, quotations, salesOrders, supportTickets,
  projects, tasks, timesheets, notifications, approvals, auditLogs,
}
