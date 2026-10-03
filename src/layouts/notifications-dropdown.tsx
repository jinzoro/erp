import { useNavigate } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import type { Notification } from '@/types'

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
}

const typeColors = {
  info: 'bg-blue-100 text-blue-600',
  warning: 'bg-amber-100 text-amber-600',
  error: 'bg-red-100 text-red-600',
  success: 'bg-emerald-100 text-emerald-600',
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const Icon = typeIcons[notification.type]

  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50',
        !notification.read && 'bg-primary-50/50',
      )}
    >
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          typeColors[notification.type],
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm',
              !notification.read ? 'font-semibold text-slate-900' : 'text-slate-700',
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
          {notification.message}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {new Date(notification.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {!notification.read && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              <CheckCheck className="h-3 w-3" />
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function NotificationsDropdown() {
  const navigate = useNavigate()
  const { notifications, markAsRead } = useUIStore()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative group">
      <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <div className="absolute right-0 top-full z-50 mt-2 w-[360px] origin-top-right animate-scale-in rounded-xl border border-slate-200 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8">
              <EmptyState
                icon={<Bell className="h-10 w-10" />}
                title="No notifications"
                description="You're all caught up!"
              />
            </div>
          ) : (
            notifications.slice(0, 10).map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={markAsRead}
              />
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-2.5">
            <button
              onClick={() => navigate('/notifications')}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all notifications
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
