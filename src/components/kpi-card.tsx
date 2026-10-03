import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface KpiCardProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: ReactNode
  subtitle?: string
  variant?: 'default' | 'glass'
  onClick?: () => void
  className?: string
}

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  down: { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
  neutral: { icon: Minus, color: 'text-slate-500', bg: 'bg-slate-50' },
}

export function KpiCard({
  label,
  value,
  trend,
  trendValue,
  icon,
  subtitle,
  variant = 'default',
  onClick,
  className,
}: KpiCardProps) {
  const trendInfo = trend ? trendConfig[trend] : null
  const TrendIcon = trendInfo?.icon ?? null

  return (
    <div
      className={cn(
        'rounded-xl border p-5 transition-all duration-200',
        variant === 'default' && 'border-slate-200 bg-white shadow-sm',
        variant === 'glass' && 'glass-card',
        onClick && 'cursor-pointer hover:shadow-md',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {trend && TrendIcon && trendInfo && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  trendInfo.bg,
                  trendInfo.color,
                )}
              >
                <TrendIcon className="h-3 w-3" />
                {trendValue}
              </span>
            </div>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 rounded-lg bg-primary-50 p-3 text-primary-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
