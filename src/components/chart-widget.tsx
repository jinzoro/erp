import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export interface ChartWidgetProps {
  title: string
  filters?: ReactNode
  children: ReactNode
  className?: string
  variant?: 'default' | 'glass'
}

export function ChartWidget({
  title,
  filters,
  children,
  className,
  variant = 'default',
}: ChartWidgetProps) {
  return (
    <Card variant={variant} padding="none" className={cn('overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {filters && <div className="flex items-center gap-2">{filters}</div>}
      </div>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  )
}
