export default function EmptyState({
  icon: Icon, title,
  description, action,
}) {
  return (
    <div className="flex flex-col items-center
      justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl
          bg-slate-100 flex items-center
          justify-center mb-4">
          <Icon size={32}
            className="text-slate-300" />
        </div>
      )}
      <h3 className="text-base font-semibold
        text-slate-700">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400
          mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  )
}