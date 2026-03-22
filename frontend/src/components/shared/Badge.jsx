import { cn } from '../../utils/cn'

const variants = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger:  'bg-red-50 text-red-700 border-red-200',
  info:    'bg-blue-50 text-blue-700 border-blue-200',
  default: 'bg-slate-100 text-slate-600 border-slate-200',
  purple:  'bg-violet-50 text-violet-700 border-violet-200',
}

export default function Badge({
  children, variant = 'default', className,
}) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5',
      'rounded-lg text-xs font-medium border',
      variants[variant], className
    )}>
      {children}
    </span>
  )
}