import { cn } from '@/lib/utils'

export interface SkeletonProps {
  variant?: 'text' | 'card' | 'table-row' | 'avatar'
  className?: string
}

export function Skeleton({ variant = 'text', className }: SkeletonProps) {
  switch (variant) {
    case 'text':
      return (
        <div className={cn('h-4 w-full animate-pulse rounded bg-slate-200', className)} />
      )
    case 'card':
      return (
        <div
          className={cn(
            'h-48 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-100 p-5',
            className,
          )}
        >
          <div className="mb-4 h-4 w-1/3 rounded bg-slate-200" />
          <div className="mb-3 h-8 w-1/2 rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-200" />
        </div>
      )
    case 'table-row':
      return (
        <div className={cn('flex items-center gap-4 px-4 py-3', className)}>
          <div className="h-4 w-4 rounded bg-slate-200" />
          <div className="h-4 flex-1 rounded bg-slate-200" />
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-200" />
        </div>
      )
    case 'avatar':
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-3 w-16 rounded bg-slate-200" />
          </div>
        </div>
      )
    default:
      return (
        <div className={cn('animate-pulse rounded bg-slate-200', className)} />
      )
  }
}
