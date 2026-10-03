import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  AlertTriangle,
  X,
} from 'lucide-react'

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  finance: 'bg-emerald-100 text-emerald-700',
  procurement: 'bg-blue-100 text-blue-700',
  sales: 'bg-amber-100 text-amber-700',
  inventory: 'bg-cyan-100 text-cyan-700',
  hr: 'bg-rose-100 text-rose-700',
}

export function UserMenu() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { addNotification } = useUIStore()
  const [open, setOpen] = useState(false)
  const [confirmingLogout, setConfirmingLogout] = useState(false)

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const roleBadge = user.roleId.charAt(0).toUpperCase() + user.roleId.slice(1)

  const handleLogout = () => {
    addNotification({
      userId: user.id,
      title: 'Logged out',
      message: 'You have been logged out successfully.',
      type: 'info',
      read: false,
    })
    logout()
    navigate('/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
          {initials}
        </div>
        <div className="hidden text-left md:block">
          <p className="text-sm font-medium leading-tight text-slate-900">
            {user.name}
          </p>
          <p className="text-xs leading-tight text-slate-500">{user.email}</p>
        </div>
        <ChevronDown
          className={cn(
            'hidden h-4 w-4 text-slate-400 transition-transform md:block',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpen(false)
              setConfirmingLogout(false)
            }}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 animate-scale-in rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
            <div className="border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-2">
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                    roleColors[user.roleId] || 'bg-slate-100 text-slate-700',
                  )}
                >
                  {roleBadge}
                </span>
              </div>
            </div>

            <div className="py-1">
              <button
                onClick={() => {
                  setOpen(false)
                  navigate('/profile')
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <User className="h-4 w-4 text-slate-400" />
                My Profile
              </button>
              <button
                onClick={() => {
                  setOpen(false)
                  navigate('/settings')
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                Settings
              </button>
              <button
                onClick={() => {
                  setOpen(false)
                  navigate('/help')
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <HelpCircle className="h-4 w-4 text-slate-400" />
                Help & Support
              </button>
            </div>

            <div className="border-t border-slate-100 py-1">
              {confirmingLogout ? (
                <div className="px-4 py-2">
                  <p className="mb-2 flex items-center gap-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    Are you sure?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleLogout}
                      className="flex-1 rounded-lg bg-error px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => setConfirmingLogout(false)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingLogout(true)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
