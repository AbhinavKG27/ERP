export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center gap-3 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}