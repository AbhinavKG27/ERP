import { useQuery } from '@tanstack/react-query'
import {
  X, Building2, Phone, Mail,
  Award, Calendar, BookOpen,
  GraduationCap, Hash
} from 'lucide-react'
import { facultyApi } from '../../api/facultyApi'
import { formatDate, getInitials }
  from '../../utils/helpers'
import { ACADEMIC_YEARS } from '../../utils/constants'

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5
    border-b border-slate-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-100
      flex items-center justify-center flex-shrink-0">
      <Icon size={14} className="text-slate-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium
        text-slate-700 mt-0.5">
        {value || '—'}
      </p>
    </div>
  </div>
)

export default function FacultyDetailModal({
  faculty, onClose
}) {
  const { data: assignments } = useQuery({
    queryKey: ['assignments', faculty.id],
    queryFn: () =>
      facultyApi.getAssignments(
        faculty.id, '2025-26')
        .then(r => r.data?.data || []),
  })

  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl w-full
        max-w-lg shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r
          from-violet-600 to-purple-600 p-6">
          <div className="flex items-start
            justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl
                bg-white/20 flex items-center
                justify-center text-white
                text-xl font-bold">
                {getInitials(faculty.fullName)}
              </div>
              <div>
                <h2 className="text-xl font-bold
                  text-white">
                  {faculty.fullName}
                </h2>
                <p className="text-violet-200
                  text-sm mt-0.5">
                  {faculty.designation}
                </p>
                <span className="mt-2 inline-block
                  px-2.5 py-0.5 bg-white/20
                  text-white text-xs rounded-lg">
                  {faculty.employeeId}
                </span>
              </div>
            </div>
            <button onClick={onClose}
              className="p-2 bg-white/10
                hover:bg-white/20 rounded-lg
                transition-colors">
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto
          max-h-[55vh] space-y-4">

          <div>
            <h3 className="text-xs font-semibold
              text-slate-400 uppercase
              tracking-wider mb-2">
              Details
            </h3>
            <InfoRow icon={Mail} label="Email"
              value={faculty.email} />
            <InfoRow icon={Phone} label="Phone"
              value={faculty.phone} />
            <InfoRow icon={Building2}
              label="Department"
              value={faculty.departmentName} />
            <InfoRow icon={GraduationCap}
              label="Qualification"
              value={faculty.qualification} />
            <InfoRow icon={Award}
              label="Specialization"
              value={faculty.specialization} />
            <InfoRow icon={Calendar}
              label="Joining Date"
              value={formatDate(faculty.joiningDate)} />
          </div>

          {/* Subject Assignments */}
          {assignments?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold
                text-slate-400 uppercase
                tracking-wider mb-3">
                Subject Assignments (2025-26)
              </h3>
              <div className="space-y-2">
                {assignments.map(a => (
                  <div key={a.id}
                    className="flex items-center
                      gap-3 p-3 bg-slate-50
                      rounded-xl">
                    <div className="w-8 h-8
                      rounded-lg bg-violet-100
                      flex items-center
                      justify-center">
                      <BookOpen size={14}
                        className="text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium
                        text-slate-700">
                        {a.subjectName}
                      </p>
                      <p className="text-xs
                        text-slate-400">
                        {a.subjectCode} •
                        Sem {a.semesterNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4
          border-t border-slate-100">
          <button onClick={onClose}
            className="px-5 py-2 bg-slate-100
              hover:bg-slate-200 text-slate-700
              text-sm font-medium rounded-xl
              transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}