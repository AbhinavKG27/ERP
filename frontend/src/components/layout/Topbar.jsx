import { Menu, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { notificationApi }
  from '../../api/notificationApi'
import useAuthStore from '../../store/authStore'
import { getRoleLabel, getInitials }
  from '../../utils/helpers'

export default function Topbar({ onMenuClick }) {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-count',
      user?.id, user?.role],
    queryFn:  () =>
      notificationApi.getUnreadCount(
        user?.id, user?.role)
        .then(r => r.data?.unreadCount || 0),
    refetchInterval: 30000,
    enabled: !!user?.id,
  })

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

        {/* Breadcrumb — page title */}
        <div className="hidden sm:block">
          <p className="text-sm font-semibold
            text-slate-700">
            {user?.fullName}
          </p>
          <p className="text-xs text-slate-400">
            {getRoleLabel(user?.role)}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Notifications Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl
            text-slate-500 hover:bg-slate-100
            transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1
              right-1 w-4 h-4 bg-red-500
              rounded-full text-white text-xs
              flex items-center justify-center
              font-bold leading-none">
              {unreadCount > 9
                ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2
          bg-slate-50 border border-slate-200
          rounded-xl px-3 py-2">
          <div className="w-7 h-7 rounded-lg
            bg-blue-600 flex items-center
            justify-center text-xs font-bold
            text-white">
            {getInitials(user?.fullName)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium
              text-slate-700 leading-none">
              {user?.fullName?.split(' ')[0]}
            </p>
            <p className="text-xs text-slate-400
              mt-0.5">
              {getRoleLabel(user?.role)}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}