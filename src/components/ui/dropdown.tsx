import { useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'end'
  className?: string
}

export function Dropdown({
  trigger,
  children,
  align = 'start',
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[12rem] animate-scale-in rounded-xl border border-slate-200 bg-white py-1 shadow-lg',
            align === 'end' ? 'right-0' : 'left-0',
            className,
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export interface DropdownItemProps {
  icon?: ReactNode
  children: ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
  className?: string
}

export function DropdownItem({
  icon,
  children,
  onClick,
  danger,
  disabled,
  className,
}: DropdownItemProps) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-700 hover:bg-slate-50',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
    >
      {icon && <span className="flex-shrink-0 text-slate-400">{icon}</span>}
      {children}
    </button>
  )
}

export interface DropdownSeparatorProps {
  className?: string
}

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return <div className={cn('my-1 border-t border-slate-100', className)} />
}
