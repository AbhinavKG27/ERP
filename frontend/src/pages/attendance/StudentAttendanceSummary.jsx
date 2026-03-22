import { getAttendanceBg } from '../../utils/helpers'
import { CheckCircle, XCircle,
  AlertCircle, TrendingUp } from 'lucide-react'

export default function StudentAttendanceSummary({
  summary, academicYear
}) {
  if (!summary.length) {
    return (
      <div className="bg-white rounded-2xl
        border border-slate-100 shadow-sm p-12
        text-center">
        <TrendingUp size={40}
          className="text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">
          No attendance data for {academicYear}
        </p>
      </div>
    )
  }

  const avg = Math.round(
    summary.reduce((a, b) =>
      a + (b.percentage || 0), 0) / summary.length
  )

  return (
    <div className="space-y-4">

      {/* Overview */}
      <div className="grid grid-cols-2
        sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4
          border border-slate-100 shadow-sm
          col-span-2 sm:col-span-1">
          <p className="text-sm text-slate-500">
            Overall Average
          </p>
          <p className={`text-3xl font-bold mt-1
            ${avg >= 85
              ? 'text-emerald-600'
              : avg >= 75
              ? 'text-yellow-600'
              : 'text-red-600'}`}>
            {avg}%
          </p>
          <span className={`mt-2 inline-block
            px-2.5 py-0.5 rounded-lg text-xs
            font-semibold
            ${getAttendanceBg(avg)}`}>
            {avg >= 85 ? 'Eligible'
              : avg >= 75 ? 'Needs Approval'
              : avg >= 65 ? 'Fine Required'
              : 'Not Eligible'}
          </span>
        </div>
        <div className="bg-white rounded-xl p-4
          border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">
            Subjects
          </p>
          <p className="text-3xl font-bold mt-1
            text-blue-600">
            {summary.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4
          border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">
            Good Standing
          </p>
          <p className="text-3xl font-bold mt-1
            text-emerald-600">
            {summary.filter(s =>
              s.percentage >= 85).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4
          border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">
            At Risk
          </p>
          <p className="text-3xl font-bold mt-1
            text-red-600">
            {summary.filter(s =>
              s.percentage < 75).length}
          </p>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1
        sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summary.map(s => (
          <div key={s.subjectId}
            className="bg-white rounded-2xl p-5
              border border-slate-100 shadow-sm">

            <div className="flex items-start
              justify-between mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold
                  text-slate-800 truncate">
                  {s.subjectName}
                </p>
                <p className="text-xs text-slate-400
                  mt-0.5">
                  Sem {s.semesterNumber} •
                  {s.attendedSessions}/
                  {s.totalSessions} classes
                </p>
              </div>
              <div className="ml-3 flex-shrink-0">
                {s.percentage >= 85
                  ? <CheckCircle size={20}
                      className="text-emerald-500" />
                  : s.percentage >= 75
                  ? <AlertCircle size={20}
                      className="text-yellow-500" />
                  : <XCircle size={20}
                      className="text-red-500" />}
              </div>
            </div>

            {/* Big percentage */}
            <div className="text-center mb-3">
              <span className={`text-4xl font-bold
                ${s.percentage >= 85
                  ? 'text-emerald-600'
                  : s.percentage >= 75
                  ? 'text-yellow-600'
                  : s.percentage >= 65
                  ? 'text-orange-500'
                  : 'text-red-600'}`}>
                {s.percentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-100
              rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full
                  transition-all duration-500
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

            {/* Status badge */}
            <div className="mt-3 flex items-center
              justify-between">
              <span className={`px-2.5 py-1
                rounded-lg text-xs font-semibold
                ${getAttendanceBg(s.percentage)}`}>
                {s.eligibilityStatus
                  ?.replace('_', ' ')}
              </span>
              {s.approvalGranted && (
                <span className="text-xs
                  text-emerald-600 font-medium">
                  ✓ Approved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}