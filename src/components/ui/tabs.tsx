import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

const listVariants = {
  underline:
    'border-b border-slate-200 gap-0',
  pills: 'gap-1',
  glass: 'glass rounded-xl p-1 gap-1',
}

const triggerVariants = {
  underline:
    'border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 data-[state=active]:border-primary-600 data-[state=active]:text-primary-700',
  pills:
    'rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm',
  glass:
    'rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 data-[state=active]:bg-white/60 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm',
}

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  variant: keyof typeof listVariants
}

const TabsContext = createContext<TabsContextValue | null>(null)

export interface TabsProps {
  variant?: keyof typeof listVariants
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  children: ReactNode
}

export function Tabs({
  variant = 'underline',
  value: controlledValue,
  defaultValue,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) setUncontrolledValue(newValue)
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange],
  )

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, variant }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps {
  className?: string
  children: ReactNode
}

export function TabsList({ className, children }: TabsListProps) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsList must be used within Tabs')

  return (
    <div
      className={cn(
        'flex',
        listVariants[ctx.variant],
        className,
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps {
  value: string
  className?: string
  children: ReactNode
  disabled?: boolean
}

export function TabsTrigger({
  value,
  className,
  children,
  disabled,
}: TabsTriggerProps) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs')

  const isActive = ctx.value === value

  return (
    <button
      className={cn(
        triggerVariants[ctx.variant],
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => ctx.onValueChange(value)}
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps {
  value: string
  className?: string
  children: ReactNode
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent must be used within Tabs')

  if (ctx.value !== value) return null

  return (
    <div className={cn('mt-4', className)} role="tabpanel">
      {children}
    </div>
  )
}
