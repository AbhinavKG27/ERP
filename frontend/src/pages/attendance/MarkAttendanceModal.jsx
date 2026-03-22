import { useState } from 'react'
import { useQuery, useMutation }
  from '@tanstack/react-query'
import {
  X, CheckCircle, XCircle,
  Loader2, ClipboardCheck
} from 'lucide-react'
import { attendanceApi }
  from '../../api/attendanceApi'
import { studentApi } from '../../api/studentApi'
import { departmentApi }
  from '../../api/departmentApi'
import { getInitials } from '../../utils/helpers'
import { ACADEMIC_YEARS, SEMESTERS }
  from '../../utils/constants'
import toast from 'react-hot-toast'

export default function MarkAttendanceModal({
  onClose
}) {
  const [step,         setStep]         = useState(1)
  const [sessionId,    setSessionId]    = useState(null)
  const [subjectId,    setSubjectId]    = useState('')
  const [batchId,      setBatchId]      = useState('')
  const [academicYear, setAcademicYear] =
    useState('2025-26')
  const [semester,     setSemester]     = useState(3)
  const [sessionDate,  setSessionDate]  =
    useState(new Date().toISOString().split('T')[0])
  const [attendance,   setAttendance]   = useState({})
  const [creating,     setCreating]     = useState(false)
  const [marking,      setMarking]      = useState(false)

  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn:  () => departmentApi.getAll()
      .then(r => r.data?.data || []),
  })

  const [deptId, setDeptId] = useState('')

  const { data: subjects } = useQuery({
    queryKey: ['subjects', deptId],
    queryFn:  () =>
      departmentApi.getSubjects(deptId)
        .then(r => r.data?.data || []),
    enabled: !!deptId,
  })

  const { data: batches } = useQuery({
    queryKey: ['batches-all'],
    queryFn:  () =>
      studentApi.getAll(0, 100)
        .then(r => {
          const students =
            r.data?.data?.content
            || r.data?.data || []
          const batchIds = [
            ...new Set(
              students.map(s => s.batchId)
            )]
          return batchIds.map(id => ({
            id, name: `Batch ${id}`
          }))
        }),
  })

  const { data: students } = useQuery({
    queryKey: ['students-for-att', batchId],
    queryFn:  () =>
      studentApi.getAll(0, 100)
        .then(r => {
          const all =
            r.data?.data?.content
            || r.data?.data || []
          return batchId
            ? all.filter(s =>
                String(s.batchId) ===
                String(batchId))
            : all
        }),
    enabled: step === 2,
  })

  const createSession = async () => {
    if (!subjectId || !batchId) {
      toast.error('Select subject and batch')
      return
    }
    setCreating(true)
    try {
      const res = await attendanceApi.createSession({
        subjectId:     Number(subjectId),
        batchId:       Number(batchId),
        sessionDate,
        startTime:     '09:00:00',
        endTime:       '10:00:00',
        academicYear,
        semesterNumber: Number(semester),
      })
      const id = res.data?.data?.id
      setSessionId(id)
      // Init all as PRESENT
      const init = {}
      ;(students || []).forEach(s => {
        init[s.id] = 'PRESENT'
      })
      setAttendance(init)
      setStep(2)
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to create session')
    } finally {
      setCreating(false)
    }
  }

  const toggleStatus = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT'
        ? 'ABSENT' : 'PRESENT',
    }))
  }

  const submitAttendance = async () => {
    setMarking(true)
    try {
      await attendanceApi.markAttendance({
        sessionId,
        attendanceMap: attendance,
      })
      await attendanceApi.finalizeSession(sessionId)
      toast.success('Attendance marked and finalized!')
      onClose()
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to mark attendance')
    } finally {
      setMarking(false)
    }
  }

  const presentCount = Object.values(attendance)
    .filter(v => v === 'PRESENT').length
  const totalCount   = Object.keys(attendance).length

  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl w-full
        max-w-2xl max-h-[90vh] overflow-hidden
        flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center
          justify-between p-5
          border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl
              bg-blue-50 flex items-center
              justify-center">
              <ClipboardCheck size={20}
                className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold
                text-slate-800">
                {step === 1
                  ? 'Create Session'
                  : 'Mark Attendance'}
              </h2>
              <p className="text-xs text-slate-400">
                Step {step} of 2
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 hover:bg-slate-100
              rounded-lg transition-colors">
            <X size={18}
              className="text-slate-400" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex">
          {[1, 2].map(s => (
            <div key={s}
              className={`flex-1 h-1
                ${step >= s
                  ? 'bg-blue-500'
                  : 'bg-slate-100'}`}
            />
          ))}
        </div>

        <div className="overflow-y-auto
          flex-1 p-5">

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs
                    font-medium text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                    value={deptId}
                    onChange={e =>
                      setDeptId(e.target.value)}
                    className="w-full px-3 py-2
                      rounded-lg border border-slate-200
                      text-sm text-slate-700 bg-white
                      outline-none
                      focus:border-blue-400">
                    <option value="">
                      Select department
                    </option>
                    {(deptData || []).map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs
                    font-medium text-slate-600 mb-1">
                    Subject *
                  </label>
                  <select
                    value={subjectId}
                    onChange={e =>
                      setSubjectId(e.target.value)}
                    className="w-full px-3 py-2
                      rounded-lg border border-slate-200
                      text-sm text-slate-700 bg-white
                      outline-none
                      focus:border-blue-400">
                    <option value="">
                      Select subject
                    </option>
                    {(subjects || []).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.code} — {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs
                    font-medium text-slate-600 mb-1">
                    Batch *
                  </label>
                  <select
                    value={batchId}
                    onChange={e =>
                      setBatchId(e.target.value)}
                    className="w-full px-3 py-2
                      rounded-lg border border-slate-200
                      text-sm text-slate-700 bg-white
                      outline-none
                      focus:border-blue-400">
                    <option value="">Select batch</option>
                    {(batches || []).map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs
                    font-medium text-slate-600 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={e =>
                      setSessionDate(e.target.value)}
                    className="w-full px-3 py-2
                      rounded-lg border border-slate-200
                      text-sm text-slate-700 bg-white
                      outline-none
                      focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs
                    font-medium text-slate-600 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={e =>
                      setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2
                      rounded-lg border border-slate-200
                      text-sm text-slate-700 bg-white
                      outline-none
                      focus:border-blue-400">
                    {ACADEMIC_YEARS.map(y => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs
                    font-medium text-slate-600 mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={e =>
                      setSemester(e.target.value)}
                    className="w-full px-3 py-2
                      rounded-lg border border-slate-200
                      text-sm text-slate-700 bg-white
                      outline-none
                      focus:border-blue-400">
                    {SEMESTERS.map(s => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-3">
              {/* Summary bar */}
              <div className="flex items-center
                justify-between p-3 bg-slate-50
                rounded-xl">
                <span className="text-sm
                  text-slate-600">
                  {presentCount}/{totalCount} Present
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const all = {}
                      Object.keys(attendance)
                        .forEach(id => {
                          all[id] = 'PRESENT'
                        })
                      setAttendance(all)
                    }}
                    className="px-3 py-1 bg-emerald-100
                      text-emerald-700 text-xs
                      font-semibold rounded-lg
                      hover:bg-emerald-200
                      transition-colors">
                    All Present
                  </button>
                  <button
                    onClick={() => {
                      const all = {}
                      Object.keys(attendance)
                        .forEach(id => {
                          all[id] = 'ABSENT'
                        })
                      setAttendance(all)
                    }}
                    className="px-3 py-1 bg-red-100
                      text-red-700 text-xs
                      font-semibold rounded-lg
                      hover:bg-red-200
                      transition-colors">
                    All Absent
                  </button>
                </div>
              </div>

              {/* Student list */}
              <div className="space-y-2">
                {(students || []).map(s => {
                  const isPresent =
                    attendance[s.id] === 'PRESENT'
                  return (
                    <div key={s.id}
                      className={`flex items-center
                        gap-3 p-3 rounded-xl border
                        cursor-pointer transition-all
                        ${isPresent
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-red-50 border-red-200'}`}
                      onClick={() =>
                        toggleStatus(s.id)}>
                      <div className={`w-9 h-9
                        rounded-xl flex items-center
                        justify-center text-xs
                        font-bold flex-shrink-0
                        ${isPresent
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white'}`}>
                        {getInitials(s.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm
                          font-semibold text-slate-800
                          truncate">
                          {s.fullName}
                        </p>
                        <p className="text-xs
                          text-slate-400">
                          {s.rollNumber}
                        </p>
                      </div>
                      <div className="flex items-center
                        gap-2 flex-shrink-0">
                        <span className={`text-xs
                          font-semibold
                          ${isPresent
                            ? 'text-emerald-700'
                            : 'text-red-700'}`}>
                          {attendance[s.id]}
                        </span>
                        {isPresent
                          ? <CheckCircle size={18}
                              className="text-emerald-500" />
                          : <XCircle size={18}
                              className="text-red-500" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center
          justify-between p-5
          border-t border-slate-100 bg-slate-50/50">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium
              text-slate-600 hover:bg-slate-100
              rounded-xl transition-colors">
            Cancel
          </button>
          <div className="flex gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm
                  font-medium text-slate-600
                  border border-slate-200
                  hover:bg-slate-100 rounded-xl
                  transition-colors">
                Back
              </button>
            )}
            {step === 1 && (
              <button
                onClick={createSession}
                disabled={creating}
                className="flex items-center gap-2
                  px-5 py-2 bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-blue-400 text-white
                  text-sm font-semibold rounded-xl
                  transition-colors">
                {creating
                  ? <><Loader2 size={16}
                      className="animate-spin" />
                      Creating...</>
                  : 'Next →'}
              </button>
            )}
            {step === 2 && (
              <button
                onClick={submitAttendance}
                disabled={marking}
                className="flex items-center gap-2
                  px-5 py-2 bg-emerald-600
                  hover:bg-emerald-700
                  disabled:bg-emerald-400 text-white
                  text-sm font-semibold rounded-xl
                  transition-colors">
                {marking
                  ? <><Loader2 size={16}
                      className="animate-spin" />
                      Saving...</>
                  : 'Submit Attendance'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}