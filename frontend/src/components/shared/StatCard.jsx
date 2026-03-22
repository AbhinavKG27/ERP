import { cn } from '../../utils/cn'

export default function StatCard({
  icon: Icon, label, value,
  sub, color, bg, trend,
}) {
  return (
    <div className="bg-white rounded-2xl p-5
      border border-slate-100 shadow-sm
      hover:shadow-md transition-shadow">
      <div className="flex items-start
        justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500
            font-medium truncate">
            {label}
          </p>
          <p className="text-3xl font-bold
            text-slate-800 mt-1">
            {value}
          </p>
          {sub && (
            <p className="text-xs text-slate-400
              mt-1 truncate">
              {sub}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'w-12 h-12 rounded-xl flex',
            'items-center justify-center',
            'flex-shrink-0 ml-3', bg
          )}>
            <Icon size={22} className={color} />
          </div>
        )}
      </div>
    </div>
  )
}