import { useState } from 'react'
import { useQuery, useQueryClient }
  from '@tanstack/react-query'
import {
  Plus, Search, Eye, UserCheck,
  Phone, Building2
} from 'lucide-react'
import { facultyApi } from '../../api/facultyApi'
import { departmentApi }
  from '../../api/departmentApi'
import { getInitials, formatDate }
  from '../../utils/helpers'
import AddFacultyModal from './AddFacultyModal'
import FacultyDetailModal
  from './FacultyDetailModal'
import toast from 'react-hot-toast'

export default function FacultyPage() {
  const [search,   setSearch]   = useState('')
  const [deptId,   setDeptId]   = useState('')
  const [showAdd,  setShowAdd]  = useState(false)
  const [selected, setSelected] = useState(null)
  const queryClient = useQueryClient()

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn:  () => departmentApi.getAll()
      .then(r => r.data?.data || []),
  })

  // Fetch faculty for selected dept
  // or for all depts when none selected
  const {
    data: faculty = [],
    isLoading,
  } = useQuery({
    queryKey: ['faculty', deptId, departments],
    queryFn: async () => {
      if (deptId) {
        const r = await facultyApi
          .getByDept(deptId)
        return r.data?.data?.content
          || r.data?.data || []
      }
      if (!departments.length) return []
      const results = await Promise.all(
        departments.map(d =>
          facultyApi.getByDept(d.id)
            .then(r =>
              r.data?.data?.content
              || r.data?.data || [])
            .catch(() => [])
        )
      )
      return results.flat()
    },
    enabled: departments.length > 0
      || !!deptId,
  })

  const filtered = faculty.filter(f => {
    if (!search) return true
    const q = search.toLowerCase()
    return f.fullName?.toLowerCase().includes(q)
      || f.employeeId?.toLowerCase().includes(q)
      || f.email?.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Faculty</h1>
          <p className="text-slate-500
            text-sm mt-1">
            Manage faculty members
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2
            px-4 py-2.5 bg-blue-600
            hover:bg-blue-700 text-white
            text-sm font-semibold rounded-xl
            transition-colors shadow-sm">
          <Plus size={18} />
          Add Faculty
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2
        sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Faculty',
            value: faculty.length,
            color: 'text-blue-600' },
          { label: 'Departments',
            value: departments.length,
            color: 'text-violet-600' },
          { label: 'Professors',
            value: faculty.filter(f =>
              f.designation?.toLowerCase()
                .includes('professor')).length,
            color: 'text-emerald-600' },
          { label: 'Active',
            value: faculty.length,
            color: 'text-orange-600' },
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
          gap-3 p-4 border-b border-slate-100
          flex-wrap">
          <div className="flex items-center gap-2
            bg-slate-50 border border-slate-200
            rounded-xl px-3 py-2 flex-1 max-w-xs">
            <Search size={16}
              className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e =>
                setSearch(e.target.value)}
              placeholder="Search faculty..."
              className="bg-transparent text-sm
                text-slate-600 placeholder-slate-400
                outline-none w-full"
            />
          </div>
          <select
            value={deptId}
            onChange={e =>
              setDeptId(e.target.value)}
            className="px-3 py-2 border
              border-slate-200 rounded-xl
              text-sm text-slate-600 bg-white
              outline-none focus:border-blue-400">
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50
                border-b border-slate-100">
                {['Faculty', 'Employee ID',
                  'Department', 'Designation',
                  'Contact', 'Joined',
                  'Actions'].map(h => (
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
                <tr><td colSpan={7}
                  className="text-center py-12">
                  <div className="flex items-center
                    justify-center gap-2
                    text-slate-400 text-sm">
                    <div className="w-4 h-4 border-2
                      border-blue-500
                      border-t-transparent
                      rounded-full animate-spin" />
                    Loading...
                  </div>
                </td></tr>
              )}

              {!isLoading
                && filtered.length === 0 && (
                <tr><td colSpan={7}
                  className="text-center py-12">
                  <UserCheck size={40}
                    className="text-slate-200
                      mx-auto mb-3" />
                  <p className="text-slate-400
                    text-sm">
                    No faculty members found
                  </p>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="mt-3 text-blue-600
                      text-sm hover:underline">
                    Add first faculty member
                  </button>
                </td></tr>
              )}

              {filtered.map(f => (
                <tr key={f.id}
                  className="hover:bg-slate-50/50
                    transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center
                      gap-3">
                      <div className="w-9 h-9
                        rounded-xl bg-gradient-to-br
                        from-violet-500
                        to-purple-600
                        flex items-center
                        justify-center text-white
                        text-xs font-bold
                        flex-shrink-0">
                        {getInitials(f.fullName)}
                      </div>
                      <div>
                        <p className="text-sm
                          font-semibold
                          text-slate-800">
                          {f.fullName}
                        </p>
                        <p className="text-xs
                          text-slate-400">
                          {f.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm
                      font-mono font-medium
                      text-slate-700 bg-slate-100
                      px-2 py-0.5 rounded-lg">
                      {f.employeeId}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center
                      gap-1.5">
                      <Building2 size={13}
                        className="text-slate-300" />
                      <span className="text-sm
                        text-slate-600">
                        {f.departmentName || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm
                      text-slate-600">
                      {f.designation || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center
                      gap-1.5 text-xs text-slate-500">
                      <Phone size={12} />
                      {f.phone || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm
                      text-slate-500">
                      {formatDate(f.joiningDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(f)}
                      className="flex items-center
                        gap-1.5 text-blue-600
                        hover:text-blue-700 text-xs
                        font-medium hover:bg-blue-50
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
      </div>

      {showAdd && (
        <AddFacultyModal
          departments={departments}
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false)
            queryClient.invalidateQueries(
              ['faculty'])
            toast.success('Faculty added!')
          }}
        />
      )}

      {selected && (
        <FacultyDetailModal
          faculty={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}