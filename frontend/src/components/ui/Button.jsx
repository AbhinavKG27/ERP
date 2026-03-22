import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary:   'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  ghost:     'hover:bg-slate-100 text-slate-600',
  outline:   'border border-slate-200 hover:bg-slate-50 text-slate-600',
}

const sizes = {
  sm:  'px-3 py-1.5 text-xs rounded-lg',
  md:  'px-4 py-2 text-sm rounded-xl',
  lg:  'px-5 py-2.5 text-sm rounded-xl',
}

export default function Button({
  children, variant = 'primary',
  size = 'md', loading = false,
  icon: Icon, className, ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        'font-semibold transition-all duration-150',
        'flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}>
      {loading
        ? <Loader2 size={15}
            className="animate-spin" />
        : Icon && <Icon size={15} />}
      {children}
    </button>
  )
}