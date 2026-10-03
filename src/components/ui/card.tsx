import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

export interface CardProps {
  variant?: 'default' | 'glass'
  padding?: keyof typeof paddingStyles
  className?: string
  children: ReactNode
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border',
        variant === 'default' && 'border-slate-200 bg-white shadow-sm',
        variant === 'glass' && 'glass-card',
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps {
  className?: string
  children: ReactNode
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div
      className={cn(
        '-m-5 mb-0 border-b border-slate-100 px-5 py-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface CardContentProps {
  className?: string
  children: ReactNode
}

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn('', className)}>{children}</div>
}

export interface CardFooterProps {
  className?: string
  children: ReactNode
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div
      className={cn(
        '-m-5 mt-0 flex items-center gap-3 border-t border-slate-100 px-5 py-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
