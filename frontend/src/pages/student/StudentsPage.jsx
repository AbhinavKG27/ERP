import { useState } from 'react'
import { useQuery, useQueryClient }
  from '@tanstack/react-query'
import {
  Plus, Search, Eye, GraduationCap,
  Phone, Hash, ShieldOff
} from 'lucide-react'
import { studentApi } from '../../api/studentApi'
import { formatDate, getInitials }
  from '../../utils/helpers'
import { ROLES } from '../../utils/constants'
import useAuthStore from '../../store/authStore'
import AddStudentModal from './AddStudentModal'
import StudentDetailModal
  from './StudentDetailModal'
import toast from 'react-hot-toast'

const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    DETAINED:  'bg-red-50 text-red-700 border-red-200',
    PASSED_OUT:'bg-blue-50 text-blue-700 border-blue-200',
    DROPPED:   'bg-gray-50 text-gray-700 border-gray-200',
  }
  return (
    <span className={`px-2.5 py-1 rounded-lg
      text-xs font-medium border
      ${styles[status] || styles.ACTIVE}`}>
      {status || 'ACTIVE'}
    </span>
  )
}

// Shown to roles that can't view all students
function RestrictedView() {
  return (
    <div className="flex flex-col items-center
      justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl
        bg-slate-100 flex items-center
        justify-center mx-auto mb-5">
        <ShieldOff size={36}
          className="text-slate-300" />
      </div>
      <h2 className="text-lg font-bold
        text-slate-700">
        Access Restricted
      </h2>
      <p className="text-slate-400 text-sm
        mt-2 max-w-sm">
        You don't have permission to view
        the full student list. Contact your
        administrator for access.
      </p>
    </div>
  )
}

export default function StudentsPage() {
  const { user } = useAuthStore()
  const canView = [
    ROLES.ADMIN,
    ROLES.HOD,
    ROLES.COE,
  ].includes(user?.role)

  const [search,   setSearch]   = useState('')
  const [page,     setPage]     = useState(0)
  const [showAdd,  setShowAdd]  = useState(false)
  const [selected, setSelected] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['students', page, search],
    queryFn: async () => {
      if (search.trim()) {
        const res = await studentApi
          .search(search, page)
        return res.data
      }
      const res = await studentApi
        .getAll(page, 10)
      return res.data
    },
    keepPreviousData: true,
    enabled: canView,
  })

  const students = data?.data?.content
    || data?.data?.data?.content
    || data?.data
    || []

  const totalPages    = data?.data?.totalPages
    || data?.data?.data?.totalPages || 1
  const totalElements = data?.data?.totalElements
    || data?.data?.data?.totalElements
    || students.length || 0

  // Non-admin roles see restricted view
  if (!canView) return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold
          text-slate-800">Students</h1>
        <p className="text-slate-500
          text-sm mt-1">
          Student records
        </p>
      </div>
      <div className="bg-white rounded-2xl
        border border-slate-100 shadow-sm">
        <RestrictedView />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Students</h1>
          <p className="text-slate-500
            text-sm mt-1">
            Manage student records
          </p>
        </div>
        {user?.role === ROLES.ADMIN && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2
              px-4 py-2.5 bg-blue-600
              hover:bg-blue-700 text-white
              text-sm font-semibold rounded-xl
              transition-colors shadow-sm
              shadow-blue-500/25">
            <Plus size={18} />
            Add Student
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2
        sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Students',
            value: totalElements,
            color: 'text-blue-600' },
          { label: 'Active',
            value: totalElements,
            color: 'text-emerald-600' },
          { label: 'Detained',
            value: 0,
            color: 'text-red-600' },
          { label: 'Passed Out',
            value: 0,
            color: 'text-slate-600' },
        ].map(s => (
          <div key={s.label}
            className="bg-white rounded-xl p-4
              border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500">
              {s.label}
            </p>
            <p className={`text-2xl font-bold
              mt-1 ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl
        border border-slate-100 shadow-sm
        overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center
          justify-between p-4
          border-b border-slate-100 gap-4">
          <div className="flex items-center gap-2
            bg-slate-50 border border-slate-200
            rounded-xl px-3 py-2
            flex-1 max-w-sm">
            <Search size={16}
              className="text-slate-400
                flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(0)
              }}
              placeholder="Search by name,
                roll number..."
              className="bg-transparent text-sm
                text-slate-600
                placeholder-slate-400
                outline-none w-full"
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50
                border-b border-slate-100">
                {['Student', 'Roll Number',
                  'Contact', 'Batch',
                  'Status', 'Actions'].map(h => (
                  <th key={h}
                    className="text-left text-xs
                      font-semibold text-slate-500
                      uppercase tracking-wider
                      px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y
              divide-slate-50">

              {isLoading && (
                <tr><td colSpan={6}
                  className="text-center py-12
                    text-slate-400 text-sm">
                  <div className="flex items-center
                    justify-center gap-2">
                    <div className="w-4 h-4 border-2
                      border-blue-500
                      border-t-transparent
                      rounded-full animate-spin" />
                    Loading students...
                  </div>
                </td></tr>
              )}

              {isError && (
                <tr><td colSpan={6}
                  className="text-center py-12
                    text-red-400 text-sm">
                  Failed to load students.
                </td></tr>
              )}

              {!isLoading && !isError
                && students.length === 0 && (
                <tr><td colSpan={6}
                  className="text-center py-12">
                  <GraduationCap size={40}
                    className="text-slate-200
                      mx-auto mb-3" />
                  <p className="text-slate-400
                    text-sm">
                    No students found
                  </p>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="mt-3 text-blue-600
                      text-sm hover:underline">
                    Add your first student
                  </button>
                </td></tr>
              )}

              {students.map(student => (
                <tr key={student.id}
                  className="hover:bg-slate-50/50
                    transition-colors">

                  <td className="px-4 py-3">
                    <div className="flex items-center
                      gap-3">
                      <div className="w-9 h-9
                        rounded-xl bg-gradient-to-br
                        from-blue-500 to-indigo-600
                        flex items-center
                        justify-center text-white
                        text-xs font-bold
                        flex-shrink-0">
                        {getInitials(student.fullName)}
                      </div>
                      <div>
                        <p className="text-sm
                          font-semibold
                          text-slate-800">
                          {student.fullName}
                        </p>
                        <p className="text-xs
                          text-slate-400">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center
                      gap-1.5">
                      <Hash size={13}
                        className="text-slate-300" />
                      <span className="text-sm
                        font-mono font-medium
                        text-slate-700">
                        {student.rollNumber}
                      </span>
                    </div>
                    <p className="text-xs
                      text-slate-400 mt-0.5">
                      {student.registerNumber}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center
                      gap-1.5 text-xs text-slate-500">
                      <Phone size={12} />
                      {student.phone || '—'}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm
                      text-slate-600">
                      Batch {student.batchId}
                    </span>
                    <p className="text-xs
                      text-slate-400 mt-0.5">
                      {formatDate(
                        student.admissionDate)}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge
                      status={student.status} />
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        setSelected(student)}
                      className="flex items-center
                        gap-1.5 text-blue-600
                        hover:text-blue-700
                        text-xs font-medium
                        hover:bg-blue-50
                        px-2.5 py-1.5 rounded-lg
                        transition-colors">
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center
            justify-between px-4 py-3
            border-t border-slate-100
            bg-slate-50/50">
            <p className="text-sm text-slate-500">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm
                  border border-slate-200
                  rounded-lg text-slate-600
                  hover:bg-white disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition-colors">
                Previous
              </button>
              <button
                onClick={() =>
                  setPage(p =>
                    Math.min(totalPages - 1,
                      p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-sm
                  border border-slate-200
                  rounded-lg text-slate-600
                  hover:bg-white disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <AddStudentModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false)
            queryClient.invalidateQueries(
              ['students'])
            toast.success('Student added!')
          }}
        />
      )}

      {selected && (
        <StudentDetailModal
          student={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}