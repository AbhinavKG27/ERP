import { NavLink, useNavigate } from 'react-router-dom'
import {
  GraduationCap, LayoutDashboard, Users, UserCheck,
  ClipboardCheck, BookOpen, CreditCard, Home,
  Library, MessageSquare, Bell, ChevronLeft, LogOut,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { authApi } from '../../api/authApi'
import { getRoleLabel, getInitials } from '../../utils/helpers'
import { ROLES } from '../../utils/constants'
import toast from 'react-hot-toast'

const allNavItems = [
  {
    path: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    roles: Object.values(ROLES),
  },
  {
    path: '/students',
    icon: Users,
    label: 'Students',
    roles: [ROLES.ADMIN, ROLES.HOD, ROLES.FACULTY],
  },
  {
    path: '/faculty',
    icon: UserCheck,
    label: 'Faculty',
    roles: [ROLES.ADMIN, ROLES.HOD],
  },
  {
    path: '/attendance',
    icon: ClipboardCheck,
    label: 'Attendance',
    roles: [ROLES.ADMIN, ROLES.HOD,
            ROLES.FACULTY, ROLES.STUDENT],
  },
  {
    path: '/exam',
    icon: BookOpen,
    label: 'Exams & Marks',
    roles: [ROLES.ADMIN, ROLES.HOD,
            ROLES.FACULTY, ROLES.STUDENT, ROLES.COE],
  },
  {
    path: '/fee',
    icon: CreditCard,
    label: 'Fee',
    roles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.STUDENT],
  },
  {
    path: '/hostel',
    icon: Home,
    label: 'Hostel',
    roles: [ROLES.ADMIN, ROLES.HOSTEL_WARDEN,
            ROLES.STUDENT],
  },
  {
    path: '/library',
    icon: Library,
    label: 'Library',
    roles: [ROLES.ADMIN, ROLES.LIBRARIAN,
            ROLES.STUDENT, ROLES.FACULTY],
  },
  {
    path: '/grievance',
    icon: MessageSquare,
    label: 'Grievances',
    roles: [ROLES.ADMIN, ROLES.HOD,
            ROLES.FACULTY, ROLES.STUDENT],
  },
  {
    path: '/notifications',
    icon: Bell,
    label: 'Notifications',
    roles: Object.values(ROLES),
  },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const navItems = allNavItems.filter(item =>
    item.roles.includes(user?.role))

  const handleLogout = async () => {
    try {
      if (user?.id) await authApi.logout(user.id)
    } catch {
      // Ignore API logout failures and clear local auth state.
    }
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40
            backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        flex flex-col
        bg-slate-900 text-white
        transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-0 lg:w-16'}
        overflow-hidden
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3 p-4
          border-b border-slate-700/50 min-h-[64px]">
          <div className="w-9 h-9 rounded-xl bg-blue-600
            flex items-center justify-center flex-shrink-0">
            <GraduationCap size={20} className="text-white" />
          </div>
          {open && (
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm truncate">
                Apex ERP
              </p>
              <p className="text-xs text-slate-400 truncate">
                Institute Portal
              </p>
            </div>
          )}
          {open && (
            <button onClick={onClose}
              className="text-slate-400 hover:text-white
                lg:hidden">
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2
          space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5
                  rounded-xl text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800\
                       hover:text-white'}
                `}
              >
                <Icon size={18} className="flex-shrink-0" />
                {open && (
                  <span className="truncate">
                    {item.label}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-slate-700/50">
          <div className="flex items-center gap-3
            px-2 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-lg
              bg-blue-600 flex items-center justify-center
              text-xs font-bold text-white flex-shrink-0">
              {getInitials(user?.fullName)}
            </div>
            {open && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium
                  text-white truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            )}
            {open && (
              <button
                onClick={handleLogout}
                className="text-slate-400
                  hover:text-red-400 transition-colors"
                title="Logout">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}