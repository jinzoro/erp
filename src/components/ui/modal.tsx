import { useEffect, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] mx-4',
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  size?: keyof typeof sizeStyles
  className?: string
  children: ReactNode
}

export function Modal({
  open,
  onClose,
  size = 'md',
  className,
  children,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full animate-scale-in rounded-2xl border border-slate-200 bg-white shadow-xl',
          sizeStyles[size],
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export interface ModalHeaderProps {
  className?: string
  children: ReactNode
  onClose?: () => void
}

export function ModalHeader({ className, children, onClose }: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-slate-100 px-6 py-4',
        className,
      )}
    >
      <div className="text-lg font-semibold text-slate-900">{children}</div>
      {onClose && (
        <button
          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export interface ModalBodyProps {
  className?: string
  children: ReactNode
}

export function ModalBody({ className, children }: ModalBodyProps) {
  return (
    <div className={cn('overflow-y-auto px-6 py-4', className)}>
      {children}
    </div>
  )
}

export interface ModalFooterProps {
  className?: string
  children: ReactNode
}

export function ModalFooter({ className, children }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
