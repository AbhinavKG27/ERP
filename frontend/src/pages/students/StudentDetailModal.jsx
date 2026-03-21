import {
  X, Phone, Mail,
  Hash, Calendar, User, MapPin,
  Users, Droplets
} from 'lucide-react'
import { formatDate, getInitials }
  from '../../utils/helpers'

const InfoRow = ({ icon, label, value }) => {
  const IconComponent = icon
  return (
    <div className="flex items-start gap-3 py-3
      border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100
        flex items-center justify-center flex-shrink-0">
        <IconComponent size={14} className="text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700 mt-0.5">
          {value || '—'}
        </p>
      </div>
    </div>
  )
}

export default function StudentDetailModal({
  student, onClose
}) {
  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl w-full
        max-w-lg shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r
          from-blue-600 to-indigo-600 p-6">
          <div className="flex items-start
            justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl
                bg-white/20 flex items-center
                justify-center text-white text-xl
                font-bold">
                {getInitials(student.fullName)}
              </div>
              <div>
                <h2 className="text-xl font-bold
                  text-white">
                  {student.fullName}
                </h2>
                <p className="text-blue-200 text-sm mt-1">
                  {student.rollNumber}
                </p>
                <span className="mt-2 inline-block
                  px-2.5 py-0.5 bg-white/20
                  text-white text-xs rounded-lg">
                  {student.status || 'ACTIVE'}
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
        <div className="p-6 overflow-y-auto
          max-h-[60vh]">

          <h3 className="text-xs font-semibold
            text-slate-400 uppercase tracking-wider mb-3">
            Personal Details
          </h3>

          <InfoRow icon={Mail}   label="Email"
            value={student.email} />
          <InfoRow icon={Phone}  label="Phone"
            value={student.phone} />
          <InfoRow icon={Calendar} label="Date of Birth"
            value={formatDate(student.dateOfBirth)} />
          <InfoRow icon={User}   label="Gender"
            value={student.gender} />
          <InfoRow icon={Droplets} label="Blood Group"
            value={student.bloodGroup} />
          <InfoRow icon={MapPin} label="Address"
            value={student.address} />

          <h3 className="text-xs font-semibold
            text-slate-400 uppercase tracking-wider
            mt-6 mb-3">Academic Details</h3>

          <InfoRow icon={Hash}   label="Register Number"
            value={student.registerNumber} />
          <InfoRow icon={Calendar} label="Admission Date"
            value={formatDate(student.admissionDate)} />

          <h3 className="text-xs font-semibold
            text-slate-400 uppercase tracking-wider
            mt-6 mb-3">Parent / Guardian</h3>

          <InfoRow icon={Users}  label="Parent Name"
            value={student.parentName} />
          <InfoRow icon={Phone}  label="Parent Phone"
            value={student.parentPhone} />
          <InfoRow icon={Mail}   label="Parent Email"
            value={student.parentEmail} />
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