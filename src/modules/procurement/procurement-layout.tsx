import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Building2, FileText, ShoppingCart, Warehouse, FileSignature } from 'lucide-react'

const navItems = [
  { label: 'Vendors', href: '/procurement/vendors', icon: Building2 },
  { label: 'Purchase Requisitions', href: '/procurement/requisitions', icon: FileText },
  { label: 'Purchase Orders', href: '/procurement/orders', icon: ShoppingCart },
  { label: 'Goods Receipt', href: '/procurement/goods-receipt', icon: Warehouse },
  { label: 'Contracts', href: '/procurement/contracts', icon: FileSignature },
]

export function ProcurementLayout() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}
