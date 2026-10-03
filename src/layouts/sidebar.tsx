import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { SIDEBAR_NAV } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
} from 'lucide-react'

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const pathname = location.pathname

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'flex flex-col h-screen glass-dark transition-all duration-300 z-50 flex-shrink-0',
          'fixed lg:relative',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed
            ? 'w-[280px] lg:w-[68px]'
            : 'w-[280px] lg:w-[260px]',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="truncate text-sm font-semibold text-white">
                ERP System
              </span>
            )}
          </div>
          <button
            onClick={onMobileClose}
            className="rounded-lg p-1 text-white/60 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-6">
            {SIDEBAR_NAV.map((section) => (
              <div key={section.label}>
                {!sidebarCollapsed && (
                  <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-white/40">
                    {section.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <button
                        key={item.href}
                        onClick={() => navigate(item.href)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          active
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:bg-white/5 hover:text-white',
                          sidebarCollapsed && 'justify-center px-2',
                        )}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                        {!sidebarCollapsed && item.badge && (
                          <span className="ml-auto rounded-full bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => navigate('/settings')}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white',
              sidebarCollapsed && 'justify-center px-2',
            )}
            title={sidebarCollapsed ? 'Settings' : undefined}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
          <button
            onClick={() => logout()}
            className={cn(
              'mt-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-red-400',
              sidebarCollapsed && 'justify-center px-2',
            )}
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>

          <button
            onClick={toggleSidebar}
            className="mt-2 hidden w-full items-center justify-center rounded-lg px-3 py-2 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
