import { cn } from '../../utils/cn'

export default function Input({
  label, error, hint,
  className, ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium
          text-slate-600 mb-1.5">
          {label}
        </label>
      )}
      <input
        {...props}
        className={cn(
          'w-full px-3 py-2.5 rounded-xl border',
          'text-sm text-slate-700 bg-white outline-none',
          'placeholder-slate-300 transition-all',
          'focus:ring-2 focus:ring-blue-500/20',
          'focus:border-blue-400',
          error
            ? 'border-red-300 focus:border-red-400'
            : 'border-slate-200',
          className
        )}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-slate-400 text-xs mt-1">
          {hint}
        </p>
      )}
    </div>
  )
}