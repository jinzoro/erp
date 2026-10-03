import { useAuthStore } from '@/store/authStore'
import { ExecutiveDashboard } from './executive-dashboard'
import { FinanceDashboard } from './finance-dashboard'
import { SalesDashboard } from './sales-dashboard'

export function DashboardRouter() {
  const user = useAuthStore((s) => s.user)
  const role = user?.roleId ?? 'admin'

  switch (role) {
    case 'finance':
      return <FinanceDashboard />
    case 'sales':
      return <SalesDashboard />
    case 'admin':
    case 'procurement':
    case 'inventory':
    case 'hr':
    default:
      return <ExecutiveDashboard />
  }
}
