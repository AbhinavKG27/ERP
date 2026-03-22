import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ClipboardCheck, Plus, CheckCircle,
  XCircle, TrendingUp
} from 'lucide-react'
import { attendanceApi }
  from '../../api/attendanceApi'
import { studentApi } from '../../api/studentApi'
import useAuthStore from '../../store/authStore'
import { ROLES, ACADEMIC_YEARS }
  from '../../utils/constants'
import {
  getAttendanceBg, getInitials
} from '../../utils/helpers'
import MarkAttendanceModal
  from './MarkAttendanceModal'
import StudentAttendanceSummary
  from './StudentAttendanceSummary'

export default function AttendancePage() {
  const { user } = useAuthStore()
  const isStudent = user?.role === ROLES.STUDENT
  const isFaculty = user?.role === ROLES.FACULTY
  const isAdmin   = user?.role === ROLES.ADMIN
  const isHod     = user?.role === ROLES.HOD

  const [academicYear, setAcademicYear] =
    useState('2025-26')
  const [showMark, setShowMark] = useState(false)

  // ── Get student record to find studentId ──────
  // user.id = userId (e.g. 5)
  // studentId = students.id (e.g. 1)
  // These are DIFFERENT — we need studentId
  const { data: myStudentRecord } = useQuery({
    queryKey: ['my-student', user?.id],
    queryFn:  async () => {
      // Get all students and find the one
      // matching the logged-in user's email
      const res = await studentApi.getAll(0, 100)
      const all = res.data?.data?.content
        || res.data?.data || []
      return all.find(s =>
        s.email === user?.email) || null
    },
    enabled: isStudent,
  })

  const studentId = myStudentRecord?.id

  // ── Student own attendance summary ───────────
  const { data: studentSummary = [] } = useQuery({
    queryKey: ['my-attendance',
      studentId, academicYear],
    queryFn:  () =>
      attendanceApi.getStudentSummary(
        studentId, academicYear)
        .then(r => r.data?.data || []),
    enabled: isStudent && !!studentId,
  })

  // ── Admin/HOD/Faculty: all students ──────────
  const { data: studentsData } = useQuery({
    queryKey: ['students-att-list'],
    queryFn:  () =>
      studentApi.getAll(0, 50)
        .then(r =>
          r.data?.data?.content
          || r.data?.data || []),
    enabled: !isStudent,
  })

  const students = studentsData || []

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Attendance</h1>
          <p className="text-slate-500
            text-sm mt-1">
            {isStudent
              ? 'Your attendance summary'
              : 'Track and manage attendance'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={academicYear}
            onChange={e =>
              setAcademicYear(e.target.value)}
            className="px-3 py-2 border
              border-slate-200 rounded-xl
              text-sm text-slate-600 bg-white
              outline-none focus:border-blue-400">
            {ACADEMIC_YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {(isFaculty || isAdmin || isHod) && (
            <button
              onClick={() => setShowMark(true)}
              className="flex items-center gap-2
                px-4 py-2.5 bg-blue-600
                hover:bg-blue-700 text-white
                text-sm font-semibold rounded-xl
                transition-colors shadow-sm
                shadow-blue-500/25">
              <Plus size={18} />
              Mark Attendance
            </button>
          )}
        </div>
      </div>

      {/* Student loading state */}
      {isStudent && !studentId && (
        <div className="bg-white rounded-2xl
          border border-slate-100 shadow-sm
          p-12 text-center">
          <div className="w-8 h-8 border-2
            border-blue-500 border-t-transparent
            rounded-full animate-spin mx-auto
            mb-3" />
          <p className="text-slate-400 text-sm">
            Loading your attendance...
          </p>
        </div>
      )}

      {/* Student View */}
      {isStudent && studentId && (
        <StudentAttendanceSummary
          summary={studentSummary}
          academicYear={academicYear}
        />
      )}

      {/* Admin/Faculty View */}
      {!isStudent && (
        <div className="space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2
            sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Students',
                value: students.length,
                icon: ClipboardCheck,
                color: 'text-blue-600',
                bg: 'bg-blue-50' },
              { label: 'Above 85%',
                value: '—',
                icon: CheckCircle,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50' },
              { label: 'Below 75%',
                value: '—',
                icon: XCircle,
                color: 'text-red-600',
                bg: 'bg-red-50' },
              { label: 'Avg Attendance',
                value: '—',
                icon: TrendingUp,
                color: 'text-violet-600',
                bg: 'bg-violet-50' },
            ].map(s => (
              <div key={s.label}
                className="bg-white rounded-xl
                  p-4 border border-slate-100
                  shadow-sm">
                <div className="flex items-center
                  justify-between">
                  <div>
                    <p className="text-sm
                      text-slate-500">
                      {s.label}
                    </p>
                    <p className={`text-2xl
                      font-bold mt-1 ${s.color}`}>
                      {s.value}
                    </p>
                  </div>
                  <div className={`w-10 h-10
                    rounded-xl flex items-center
                    justify-center ${s.bg}`}>
                    <s.icon size={20}
                      className={s.color} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Student list */}
          <div className="bg-white rounded-2xl
            border border-slate-100 shadow-sm
            overflow-hidden">
            <div className="p-4 border-b
              border-slate-100">
              <h2 className="text-base font-semibold
                text-slate-700">
                Student Attendance
              </h2>
              <p className="text-xs
                text-slate-400 mt-1">
                Click a student to expand
                their subject-wise attendance
              </p>
            </div>
            <div className="divide-y
              divide-slate-50">
              {students.length === 0 && (
                <div className="text-center py-12
                  text-slate-400 text-sm">
                  No students found
                </div>
              )}
              {students.map(s => (
                <StudentAttendanceRow
                  key={s.id}
                  student={s}
                  academicYear={academicYear}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showMark && (
        <MarkAttendanceModal
          onClose={() => setShowMark(false)}
        />
      )}
    </div>
  )
}

// ── Expandable row for admin/faculty view ──────
function StudentAttendanceRow({
  student, academicYear
}) {
  const [expanded, setExpanded] = useState(false)

  const { data: summary = [] } = useQuery({
    queryKey: ['att-summary',
      student.id, academicYear],
    queryFn:  () =>
      attendanceApi.getStudentSummary(
        student.id, academicYear)
        .then(r => r.data?.data || []),
    enabled: expanded,
  })

  const avgPct = summary.length
    ? Math.round(
        summary.reduce((a, b) =>
          a + (b.percentage || 0), 0)
        / summary.length)
    : null

  return (
    <div>
      <div
        className="flex items-center gap-4
          px-4 py-3 hover:bg-slate-50/50
          cursor-pointer transition-colors"
        onClick={() =>
          setExpanded(e => !e)}>
        <div className="w-9 h-9 rounded-xl
          bg-gradient-to-br from-blue-500
          to-indigo-600 flex items-center
          justify-center text-white text-xs
          font-bold flex-shrink-0">
          {getInitials(student.fullName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold
            text-slate-800 truncate">
            {student.fullName}
          </p>
          <p className="text-xs text-slate-400">
            {student.rollNumber}
          </p>
        </div>
        {avgPct !== null
          ? (
          <span className={`px-3 py-1
            rounded-xl text-xs font-semibold
            ${getAttendanceBg(avgPct)}`}>
            {avgPct}% avg
          </span>
        ) : (
          <span className="text-xs
            text-slate-400">
            {expanded
              ? 'Loading...'
              : 'Click to view'}
          </span>
        )}
        <span className={`text-slate-400
          text-sm transition-transform inline-block
          ${expanded ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 bg-slate-50/30">
          {summary.length === 0 && (
            <p className="text-xs text-slate-400
              py-3">
              No attendance data for
              {academicYear}
            </p>
          )}
          <div className="grid grid-cols-1
            sm:grid-cols-2 gap-2 mt-2">
            {summary.map(s => (
              <div key={s.subjectId}
                className="bg-white rounded-xl
                  p-3 border border-slate-100">
                <div className="flex items-center
                  justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs
                      font-semibold text-slate-700
                      truncate">
                      {s.subjectName}
                    </p>
                    <p className="text-xs
                      text-slate-400 mt-0.5">
                      {s.attendedSessions}/
                      {s.totalSessions} classes
                    </p>
                  </div>
                  <span className={`ml-2
                    px-2 py-0.5 rounded-lg
                    text-xs font-bold flex-shrink-0
                    ${getAttendanceBg(
                      s.percentage)}`}>
                    {s.percentage}%
                  </span>
                </div>
                <div className="mt-2 h-1.5
                  bg-slate-100 rounded-full
                  overflow-hidden">
                  <div
                    className={`h-full rounded-full
                      ${s.percentage >= 85
                        ? 'bg-emerald-500'
                        : s.percentage >= 75
                        ? 'bg-yellow-500'
                        : s.percentage >= 65
                        ? 'bg-orange-500'
                        : 'bg-red-500'}`}
                    style={{
                      width: `${Math.min(
                        s.percentage, 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

