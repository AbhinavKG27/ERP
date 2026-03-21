import { Menu, Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { getRoleLabel } from '../../utils/helpers'

export default function Topbar({ onMenuClick }) {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="h-16 bg-white border-b
      border-slate-100 flex items-center
      justify-between px-4 lg:px-6
      flex-shrink-0">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-500
            hover:bg-slate-100 transition-colors">
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2
          bg-slate-50 border border-slate-200
          rounded-xl px-3 py-2 w-64">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm
              text-slate-600 placeholder-slate-400
              outline-none w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl
            text-slate-500 hover:bg-slate-100
            transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5
            w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2
          bg-slate-50 border border-slate-200
          rounded-xl px-3 py-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600
            flex items-center justify-center
            text-xs font-bold text-white">
            {user?.fullName?.[0] || '?'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium
              text-slate-700 leading-none">
              {user?.fullName?.split(' ')[0]}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {getRoleLabel(user?.role)}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}