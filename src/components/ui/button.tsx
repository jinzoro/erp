import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const variantStyles = {
  default: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm',
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm disabled:bg-primary-400',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 shadow-sm disabled:bg-secondary-400',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900',
  danger: 'bg-error text-white hover:bg-red-600 shadow-sm disabled:bg-red-400',
  glass: 'glass text-slate-800 hover:bg-white/40 dark:text-slate-200',
}

const sizeStyles = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
      variantStyles[variant],
      sizeStyles[size],
      className,
    )

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'
