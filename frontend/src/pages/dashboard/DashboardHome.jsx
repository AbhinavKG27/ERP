import { useNavigate } from 'react-router-dom'
import {
  Users, UserCheck, ClipboardCheck,
  CreditCard, BookOpen, GraduationCap,
  AlertCircle, TrendingUp, Bell,
  MessageSquare, Home, Library,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart,
  Area, CartesianGrid, XAxis,
  Tooltip, BarChart, Bar, YAxis
} from 'recharts'
import useAuthStore from '../../store/authStore'
import { ROLES } from '../../utils/constants'
import { formatCurrency } from '../../utils/helpers'

const StatCard = ({
  icon: Icon, label, value,
  sub, color, bg
}) => (
  <div className="bg-white rounded-2xl p-5
    border border-slate-100 shadow-sm
    hover:shadow-md transition-shadow">
    <div className="flex items-start
      justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500
          font-medium">{label}</p>
        <p className="text-3xl font-bold
          text-slate-800 mt-1">{value}</p>
        {sub && (
          <p className="text-xs text-slate-400
            mt-1 truncate">{sub}</p>
        )}
      </div>
      <div className={`w-12 h-12 ${bg}
        rounded-xl flex items-center
        justify-center flex-shrink-0 ml-3`}>
        <Icon size={22} className={color} />
      </div>
    </div>
  </div>
)

const QuickAction = ({
  icon: Icon, label,
  description, path, color
}) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(path)}
      className="bg-white rounded-2xl p-5
        border border-slate-100 shadow-sm
        hover:shadow-md hover:border-blue-200
        transition-all text-left w-full group">
      <div className={`w-10 h-10 ${color}
        rounded-xl flex items-center
        justify-center mb-3
        group-hover:scale-110
        transition-transform`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="font-semibold
        text-slate-700 text-sm">
        {label}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {description}
      </p>
    </button>
  )
}

export default function DashboardHome() {
  const { user } = useAuthStore()
  const isAdmin   = user?.role === ROLES.ADMIN
  const isStudent = user?.role === ROLES.STUDENT
  const isFaculty = user?.role === ROLES.FACULTY
  const isHod     = user?.role === ROLES.HOD
  const isFinance = user?.role === ROLES.FINANCE
  const isLibrarian =
    user?.role === ROLES.LIBRARIAN
  const isWarden  =
    user?.role === ROLES.HOSTEL_WARDEN
  const attendanceTrend = [
    { month: 'Oct', attendance: 76 },
    { month: 'Nov', attendance: 79 },
    { month: 'Dec', attendance: 81 },
    { month: 'Jan', attendance: 83 },
    { month: 'Feb', attendance: 82 },
    { month: 'Mar', attendance: 85 },
  ]
  const feeTrend = [
    { month: 'Oct', collected: 28 },
    { month: 'Nov', collected: 36 },
    { month: 'Dec', collected: 24 },
    { month: 'Jan', collected: 42 },
    { month: 'Feb', collected: 38 },
    { month: 'Mar', collected: 45 },
  ]

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div className="flex items-start
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">
            Good morning,{' '}
            {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500
            text-sm mt-1">
            Welcome to Apex ERP —
            {' '}Academic Year 2025-26
          </p>
        </div>
      </div>

      {/* Admin / HOD Stats */}
      {(isAdmin || isHod) && (
        <div className="grid grid-cols-1
          sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Students"
            value="2,500+"
            sub="Across all departments"
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            icon={UserCheck}
            label="Faculty Members"
            value="150+"
            sub="Active this semester"
            color="text-violet-600"
            bg="bg-violet-50"
          />
          <StatCard
            icon={ClipboardCheck}
            label="Avg Attendance"
            value="82%"
            sub="This semester"
            color="text-emerald-600"
            bg="bg-emerald-50"
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
        <div className="grid grid-cols-2
          sm:grid-cols-4 gap-4">
          <StatCard
            icon={ClipboardCheck}
            label="Attendance"
            value="100%"
            sub="Data Structures"
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            icon={BookOpen}
            label="CGPA"
            value="5.0"
            sub="Semester 3"
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

      {/* Faculty Stats */}
      {isFaculty && (
        <div className="grid grid-cols-2
          sm:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="My Students"
            value="60"
            sub="This semester"
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            icon={ClipboardCheck}
            label="Sessions Today"
            value="3"
            sub="Pending attendance"
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            icon={MessageSquare}
            label="Grievances"
            value="0"
            sub="Assigned to you"
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Rating"
            value="4.2"
            sub="Student feedback"
            color="text-violet-600"
            bg="bg-violet-50"
          />
        </div>
      )}

      <div className="grid grid-cols-1
        xl:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="xl:col-span-2">
          <h2 className="text-base font-semibold
            text-slate-700 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2
            sm:grid-cols-3 gap-4">

            {(isAdmin || isFaculty) && (
              <QuickAction
                icon={ClipboardCheck}
                label="Mark Attendance"
                description="Record today's sessions"
                path="/attendance"
                color="bg-blue-500"
              />
            )}
            {(isAdmin || isFaculty
              || user?.role === ROLES.COE) && (
              <QuickAction
                icon={BookOpen}
                label="Enter Marks"
                description="Upload exam results"
                path="/exam"
                color="bg-violet-500"
              />
            )}
            {isAdmin && (
              <QuickAction
                icon={Users}
                label="Add Student"
                description="Enroll new student"
                path="/students"
                color="bg-emerald-500"
              />
            )}
            {(isAdmin || isFinance) && (
              <QuickAction
                icon={CreditCard}
                label="Fee Payment"
                description="Record payment"
                path="/fee"
                color="bg-orange-500"
              />
            )}
            {(isAdmin || isLibrarian) && (
              <QuickAction
                icon={Library}
                label="Issue Book"
                description="Library management"
                path="/library"
                color="bg-teal-500"
              />
            )}
            {(isAdmin || isWarden) && (
              <QuickAction
                icon={Home}
                label="Hostel"
                description="Room management"
                path="/hostel"
                color="bg-pink-500"
              />
            )}
            {isStudent && (
              <QuickAction
                icon={ClipboardCheck}
                label="My Attendance"
                description="View summary"
                path="/attendance"
                color="bg-blue-500"
              />
            )}
            {isStudent && (
              <QuickAction
                icon={BookOpen}
                label="My Results"
                description="View marks"
                path="/exam"
                color="bg-violet-500"
              />
            )}
            {isStudent && (
              <QuickAction
                icon={AlertCircle}
                label="Grievance"
                description="Submit complaint"
                path="/grievance"
                color="bg-red-500"
              />
            )}
            {isStudent && (
              <QuickAction
                icon={TrendingUp}
                label="Feedback"
                description="Rate faculty"
                path="/feedback"
                color="bg-yellow-500"
              />
            )}
          </div>
        </div>

        {/* Notice Board */}
        <div>
          <h2 className="text-base font-semibold
            text-slate-700 mb-4">
            Notice Board
          </h2>
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
              {
                title: 'Internal Marks Published',
                time:  '4 days ago',
                type:  'success',
              },
            ].map((n, i) => (
              <div key={i}
                className="flex items-start
                  gap-3 p-4 hover:bg-slate-50
                  transition-colors cursor-pointer">
                <div className={`w-2 h-2
                  rounded-full mt-1.5 flex-shrink-0
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
                  <p className="text-xs
                    text-slate-400 mt-0.5">
                    {n.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(isAdmin || isHod || isFinance) && (
          <div className="xl:col-span-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Fee Collection Trend (Lakhs)
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="collected" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {(isAdmin || isHod || isFaculty) && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Attendance Trend
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#14b8a6"
                  fill="#ccfbf1"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r
        from-blue-600 to-indigo-600
        rounded-2xl p-6 flex items-center
        justify-between overflow-hidden">
        <div>
          <h3 className="text-white font-bold
            text-lg">
            Academic Year 2025-26
          </h3>
          <p className="text-blue-200
            text-sm mt-1">
            Semester 2 • Even Semester •
            Exam period: April 2026
          </p>
        </div>
        <GraduationCap
          size={64}
          className="text-white/20 flex-shrink-0" />
      </div>
    </div>
  )
}