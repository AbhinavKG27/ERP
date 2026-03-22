import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Modal({
  open, onClose, title,
  subtitle, children, footer,
  size = 'md', icon: Icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const sizes = {
    sm:  'max-w-md',
    md:  'max-w-lg',
    lg:  'max-w-2xl',
    xl:  'max-w-3xl',
    full:'max-w-5xl',
  }

  return (
    <div className="fixed inset-0 z-50
      flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0
          bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        'relative bg-white rounded-2xl w-full',
        'shadow-2xl flex flex-col',
        'max-h-[90vh] overflow-hidden',
        sizes[size]
      )}>
        {/* Header */}
        <div className="flex items-center
          justify-between p-5
          border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn(
                'w-10 h-10 rounded-xl flex',
                'items-center justify-center',
                iconBg
              )}>
                <Icon size={20}
                  className={iconColor} />
              </div>
            )}
            <div>
              {title && (
                <h2 className="text-base font-bold
                  text-slate-800">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100
              rounded-lg transition-colors">
            <X size={18}
              className="text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center
            justify-end gap-3 p-5
            border-t border-slate-100
            bg-slate-50/50 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}