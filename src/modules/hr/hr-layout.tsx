import { Outlet, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Users, CalendarCheck, LogOut, Wallet, Receipt, UserPlus } from 'lucide-react'

const navItems = [
  { label: 'Employees', href: '/hr/employees', icon: Users },
  { label: 'Attendance', href: '/hr/attendance', icon: CalendarCheck },
  { label: 'Leave', href: '/hr/leaves', icon: LogOut },
  { label: 'Payroll', href: '/hr/payroll', icon: Wallet },
  { label: 'Expenses', href: '/hr/expenses', icon: Receipt },
  { label: 'Recruitment', href: '/hr/recruitment', icon: UserPlus },
]

export function HRLayout() {
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
