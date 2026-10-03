import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useSetupStore } from '@/store/setupStore'
import { DashboardLayout } from '@/layouts'
import { LoginPage } from '@/modules/core/auth/login-page'
import { SetupPage } from '@/modules/core/setup/setup-page'
import { DashboardRouter } from '@/modules/core/dashboard'
import { FinanceLayout } from '@/modules/finance'
import { ProcurementLayout } from '@/modules/procurement'
import { SalesLayout } from '@/modules/sales'
import { InventoryLayout } from '@/modules/inventory'
import { HRLayout } from '@/modules/hr'
import { VendorList } from '@/modules/procurement/vendors/vendor-list'
import { PurchaseRequisitionList } from '@/modules/procurement/purchase-requisitions/pr-list'
import { PurchaseOrderList } from '@/modules/procurement/purchase-orders/po-list'
import { GoodsReceiptList } from '@/modules/procurement/receipts/goods-receipt-list'
import { LeadList } from '@/modules/sales/leads/lead-list'
import { OpportunityList } from '@/modules/sales/opportunities/opportunity-list'
import { SalesOrderList } from '@/modules/sales/orders/sales-order-list'
import { TicketList } from '@/modules/sales/tickets/ticket-list'
import { ItemList } from '@/modules/inventory/items/item-list'
import { ItemDetail } from '@/modules/inventory/items/item-detail'
import { WarehouseList } from '@/modules/inventory/warehouses/warehouse-list'
import { StockMovementList } from '@/modules/inventory/movements/stock-movement-list'
import { TransferList } from '@/modules/inventory/transfers/transfer-list'
import { EmployeeList } from '@/modules/hr/employees/employee-list'
import { EmployeeDetail } from '@/modules/hr/employees/employee-detail'
import { AttendanceList } from '@/modules/hr/attendance/attendance-list'
import { LeaveList } from '@/modules/hr/leave/leave-list'
import { PayrollList } from '@/modules/hr/payroll/payroll-list'

function SetupGuard({ children }: { children: React.ReactNode }) {
  const isSetupComplete = useSetupStore((s) => s.isSetupComplete)
  if (!isSetupComplete()) return <Navigate to="/setup" replace />
  return <>{children}</>
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isSetupComplete = useSetupStore((s) => s.isSetupComplete)
  if (!isSetupComplete()) return <Navigate to="/setup" replace />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isSetupComplete = useSetupStore((s) => s.isSetupComplete)
  if (!isSetupComplete()) return <Navigate to="/setup" replace />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function SetupRedirect() {
  const navigate = useNavigate()
  const isSetupComplete = useSetupStore((s) => s.isSetupComplete)

  useEffect(() => {
    if (isSetupComplete()) {
      navigate('/login', { replace: true })
    }
  }, [isSetupComplete, navigate])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Finance */}
          <Route path="/finance" element={<SetupGuard><FinanceLayout /></SetupGuard>} />

          {/* Procurement */}
          <Route path="/procurement" element={<ProcurementLayout />}>
            <Route index element={<Navigate to="/procurement/vendors" replace />} />
            <Route path="vendors" element={<VendorList />} />
            <Route path="requisitions" element={<PurchaseRequisitionList />} />
            <Route path="orders" element={<PurchaseOrderList />} />
            <Route path="goods-receipt" element={<GoodsReceiptList />} />
            <Route path="contracts" element={<PlaceholderPage title="Vendor Contracts" />} />
          </Route>

          {/* Sales */}
          <Route path="/sales" element={<SalesLayout />}>
            <Route index element={<Navigate to="/sales/leads" replace />} />
            <Route path="leads" element={<LeadList />} />
            <Route path="opportunities" element={<OpportunityList />} />
            <Route path="quotations" element={<PlaceholderPage title="Quotations" />} />
            <Route path="orders" element={<SalesOrderList />} />
            <Route path="invoices" element={<PlaceholderPage title="Sales Invoices" />} />
            <Route path="tickets" element={<TicketList />} />
          </Route>

          {/* Inventory */}
          <Route path="/inventory" element={<InventoryLayout />}>
            <Route index element={<Navigate to="/inventory/items" replace />} />
            <Route path="items" element={<ItemList />} />
            <Route path="items/:id" element={<ItemDetail />} />
            <Route path="warehouses" element={<WarehouseList />} />
            <Route path="movements" element={<StockMovementList />} />
            <Route path="transfers" element={<TransferList />} />
            <Route path="batches" element={<PlaceholderPage title="Batch & Serial Tracking" />} />
            <Route path="reorder" element={<PlaceholderPage title="Reorder Rules" />} />
          </Route>

          {/* HR */}
          <Route path="/hr" element={<HRLayout />}>
            <Route index element={<Navigate to="/hr/employees" replace />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="attendance" element={<AttendanceList />} />
            <Route path="leaves" element={<LeaveList />} />
            <Route path="payroll" element={<PayrollList />} />
            <Route path="expenses" element={<PlaceholderPage title="Expense Claims" />} />
            <Route path="recruitment" element={<PlaceholderPage title="Recruitment" />} />
          </Route>

          {/* Placeholder modules */}
          <Route path="/manufacturing/*" element={<PlaceholderPage title="Manufacturing" />} />
          <Route path="/projects/*" element={<PlaceholderPage title="Project Management" />} />
          <Route path="/supply-chain/*" element={<PlaceholderPage title="Supply Chain" />} />
          <Route path="/reports/*" element={<PlaceholderPage title="Reports & Analytics" />} />
          <Route path="/settings/*" element={<PlaceholderPage title="Settings" />} />
        </Route>

        <Route path="*" element={<SetupRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="glass-panel flex flex-col items-center gap-4 px-12 py-16 text-center">
        <div className="rounded-full bg-primary-50 p-4">
          <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="max-w-md text-sm text-slate-500">
          This module is being built. Full implementation with CRUD operations, workflows, permissions, and reporting will be available in the next release.
        </p>
        <div className="mt-2 flex gap-2">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  )
}
