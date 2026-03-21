import {
  Users, UserCheck, ClipboardCheck,
  CreditCard, TrendingUp, BookOpen,
  GraduationCap, AlertCircle,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { ROLES } from '../../utils/constants'
import { formatCurrency } from '../../utils/helpers'

const StatCard = ({ icon, label, value, sub, color, bg }) => {
  const IconComponent = icon
  return (
    <div className="bg-white rounded-2xl p-5
      border border-slate-100 shadow-sm
      hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500
            font-medium">{label}</p>
          <p className="text-3xl font-bold
            text-slate-800 mt-1">{value}</p>
          {sub && (
            <p className="text-xs text-slate-400
              mt-1">{sub}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${bg} rounded-xl
          flex items-center justify-center`}>
          <IconComponent size={22} className={color} />
        </div>
      </div>
    </div>
  )
}

const QuickAction = ({ icon, label,
  description, onClick, color }) => {
  const IconComponent = icon
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-5
        border border-slate-100 shadow-sm
        hover:shadow-md hover:border-blue-200
        transition-all text-left w-full group">
      <div className={`w-10 h-10 ${color}
        rounded-xl flex items-center
        justify-center mb-3 group-hover:scale-110
        transition-transform`}>
        <IconComponent size={20} className="text-white" />
      </div>
      <p className="font-semibold text-slate-700
        text-sm">{label}</p>
      <p className="text-xs text-slate-400
        mt-1">{description}</p>
    </button>
  )
}

export default function DashboardHome() {
  const { user } = useAuthStore()
  const isAdmin  = user?.role === ROLES.ADMIN
  const isStudent = user?.role === ROLES.STUDENT
  const isFaculty = user?.role === ROLES.FACULTY

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Good morning, {user?.fullName}! 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Here's what's happening at Apex Institute today.
        </p>
      </div>

      {/* Stats Grid */}
      {(isAdmin || isFaculty) && (
        <div className="grid grid-cols-1 sm:grid-cols-2
          xl:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Students"
            value="2,500"
            sub="Across all departments"
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            icon={UserCheck}
            label="Faculty Members"
            value="150"
            sub="Active this semester"
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            icon={ClipboardCheck}
            label="Avg Attendance"
            value="82%"
            sub="This semester"
            color="text-violet-600"
            bg="bg-violet-50"
          />
          <StatCard
            icon={CreditCard}
            label="Fee Collected"
            value={formatCurrency(18500000)}
            sub="This academic year"
            color="text-orange-600"
            bg="bg-orange-50"
          />
        </div>
      )}

      {/* Student Stats */}
      {isStudent && (
        <div className="grid grid-cols-1 sm:grid-cols-2
          xl:grid-cols-4 gap-4">
          <StatCard
            icon={ClipboardCheck}
            label="My Attendance"
            value="100%"
            sub="Data Structures"
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            icon={BookOpen}
            label="CGPA"
            value="—"
            sub="Results pending"
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            icon={CreditCard}
            label="Fee Balance"
            value="₹0"
            sub="All paid"
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <StatCard
            icon={AlertCircle}
            label="Grievances"
            value="0"
            sub="No open issues"
            color="text-violet-600"
            bg="bg-violet-50"
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="xl:col-span-2">
          <h2 className="text-base font-semibold
            text-slate-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2
            sm:grid-cols-3 gap-4">
            {(isAdmin || isFaculty) && (
              <QuickAction
                icon={ClipboardCheck}
                label="Mark Attendance"
                description="Record today's attendance"
                color="bg-blue-500"
                onClick={() =>
                  window.location.href = '/attendance'}
              />
            )}
            {(isAdmin || isFaculty) && (
              <QuickAction
                icon={BookOpen}
                label="Enter Marks"
                description="Upload exam results"
                color="bg-violet-500"
                onClick={() =>
                  window.location.href = '/exam'}
              />
            )}
            {(isAdmin) && (
              <QuickAction
                icon={Users}
                label="Add Student"
                description="Enroll new student"
                color="bg-emerald-500"
                onClick={() =>
                  window.location.href = '/students'}
              />
            )}
            {(isAdmin) && (
              <QuickAction
                icon={CreditCard}
                label="Fee Payment"
                description="Record fee payment"
                color="bg-orange-500"
                onClick={() =>
                  window.location.href = '/fee'}
              />
            )}
            {isStudent && (
              <QuickAction
                icon={ClipboardCheck}
                label="My Attendance"
                description="View attendance summary"
                color="bg-blue-500"
                onClick={() =>
                  window.location.href = '/attendance'}
              />
            )}
            {isStudent && (
              <QuickAction
                icon={BookOpen}
                label="My Results"
                description="View exam results"
                color="bg-violet-500"
                onClick={() =>
                  window.location.href = '/exam'}
              />
            )}
            {isStudent && (
              <QuickAction
                icon={AlertCircle}
                label="Grievance"
                description="Submit a complaint"
                color="bg-red-500"
                onClick={() =>
                  window.location.href = '/grievance'}
              />
            )}
          </div>
        </div>

        {/* Notice Board */}
        <div>
          <h2 className="text-base font-semibold
            text-slate-700 mb-4">Notice Board</h2>
          <div className="bg-white rounded-2xl
            border border-slate-100 shadow-sm
            divide-y divide-slate-50">
            {[
              {
                title: 'Semester Exam Schedule',
                time:  '2 hours ago',
                type:  'info',
              },
              {
                title: 'Fee Payment Deadline',
                time:  'Yesterday',
                type:  'warning',
              },
              {
                title: 'New Library Books Added',
                time:  '2 days ago',
                type:  'success',
              },
              {
                title: 'College Holiday — March 25',
                time:  '3 days ago',
                type:  'info',
              },
            ].map((n, i) => (
              <div key={i}
                className="flex items-start gap-3
                  p-4 hover:bg-slate-50 transition-colors
                  cursor-pointer">
                <div className={`w-2 h-2 rounded-full mt-1.5
                  flex-shrink-0
                  ${n.type === 'warning'
                    ? 'bg-yellow-400'
                    : n.type === 'success'
                    ? 'bg-emerald-400'
                    : 'bg-blue-400'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium
                    text-slate-700 truncate">
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {n.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r
        from-blue-600 to-indigo-600
        rounded-2xl p-6 flex items-center
        justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">
            Academic Year 2025-26
          </h3>
          <p className="text-blue-200 text-sm mt-1">
            Semester 2 • Odd Semester •
            Exam period: April 2026
          </p>
        </div>
        <GraduationCap
          size={48} className="text-white/20" />
      </div>
    </div>
  )
}