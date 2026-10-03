import { Outlet, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Package, Warehouse, ArrowRightLeft, Truck, FlaskConical, RefreshCw } from 'lucide-react'

const navItems = [
  { label: 'Items', href: '/inventory/items', icon: Package },
  { label: 'Warehouses', href: '/inventory/warehouses', icon: Warehouse },
  { label: 'Stock Movements', href: '/inventory/movements', icon: ArrowRightLeft },
  { label: 'Transfers', href: '/inventory/transfers', icon: Truck },
  { label: 'Batches', href: '/inventory/batches', icon: FlaskConical },
  { label: 'Reorder', href: '/inventory/reorder', icon: RefreshCw },
]

export function InventoryLayout() {
  return (
    <div className="flex h-full flex-col">
      <div className="glass border-b border-slate-200/60 px-6">
        <nav className="flex gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  )
}
