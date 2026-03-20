import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}