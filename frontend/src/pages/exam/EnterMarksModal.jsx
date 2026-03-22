import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Loader2, BookOpen } from 'lucide-react'
import { examApi } from '../../api/examApi'
import { departmentApi }
  from '../../api/departmentApi'
import {
  ACADEMIC_YEARS, SEMESTERS, EXAM_TYPES
} from '../../utils/constants'
import { getInitials } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function EnterMarksModal({
  students, onClose
}) {
  const [step,         setStep]         = useState(1)
  const [examId,       setExamId]       = useState(null)
  const [subjectId,    setSubjectId]    = useState('')
  const [deptId,       setDeptId]       = useState('')
  const [examType,     setExamType]     = useState('CIA1')
  const [examDate,     setExamDate]     =
    useState(new Date().toISOString().split('T')[0])
  const [maxMarks,     setMaxMarks]     = useState(50)
  const [academicYear, setAcademicYear] =
    useState('2025-26')
  const [semester,     setSemester]     = useState(3)
  const [batchId,      setBatchId]      = useState(1)
  const [marks,        setMarks]        = useState({})
  const [loading,      setLoading]      = useState(false)

  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn:  () => departmentApi.getAll()
      .then(r => r.data?.data || []),
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects', deptId],
    queryFn:  () =>
      departmentApi.getSubjects(deptId)
        .then(r => r.data?.data || []),
    enabled: !!deptId,
  })

  const createExam = async () => {
    if (!subjectId) {
      toast.error('Select a subject')
      return
    }
    setLoading(true)
    try {
      const res = await examApi.createExam({
        subjectId:     Number(subjectId),
        batchId:       Number(batchId),
        examType,
        examDate,
        maxMarks:      Number(maxMarks),
        academicYear,
        semesterNumber: Number(semester),
      })
      const id = res.data?.data?.id
      setExamId(id)
      // Init marks to 0
      const init = {}
      students.forEach(s => { init[s.id] = '' })
      setMarks(init)
      setStep(2)
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to create exam')
    } finally {
      setLoading(false)
    }
  }

  const submitMarks = async () => {
    setLoading(true)
    try {
      const marksArr = students
        .filter(s => marks[s.id] !== '')
        .map(s => ({
          studentId:     s.id,
          subjectId:     Number(subjectId),
          marksObtained: Number(marks[s.id]),
          maxMarks:      Number(maxMarks),
          marksType:     examType,
        }))

      await examApi.upsertMarks({
        examId,
        marks: marksArr,
      })
      toast.success('Marks saved successfully!')
      onClose()
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to save marks')
    } finally {
      setLoading(false)
    }
  }

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
              <BookOpen size={20}
                className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold
                text-slate-800">
                {step === 1
                  ? 'Create Exam'
                  : 'Enter Marks'}
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

        <div className="overflow-y-auto flex-1 p-5">

          {step === 1 && (
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
                  <option value="">Select dept</option>
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
                  <option value="">Select subject</option>
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
                  Exam Type *
                </label>
                <select
                  value={examType}
                  onChange={e =>
                    setExamType(e.target.value)}
                  className="w-full px-3 py-2
                    rounded-lg border border-slate-200
                    text-sm text-slate-700 bg-white
                    outline-none
                    focus:border-blue-400">
                  {EXAM_TYPES.map(t => (
                    <option key={t} value={t}>{t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs
                  font-medium text-slate-600 mb-1">
                  Max Marks *
                </label>
                <input
                  type="number"
                  value={maxMarks}
                  onChange={e =>
                    setMaxMarks(e.target.value)}
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
                  Exam Date *
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={e =>
                    setExamDate(e.target.value)}
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
                      Sem {s}
                    </option>
                  ))}
                </select>
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
                    <option key={y} value={y}>{y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <div className="flex items-center
                justify-between p-3 bg-slate-50
                rounded-xl mb-4">
                <span className="text-sm
                  text-slate-600">
                  Enter marks out of {maxMarks}
                </span>
                <span className="text-xs
                  text-slate-400">
                  {examType} Exam
                </span>
              </div>
              {students.map(s => (
                <div key={s.id}
                  className="flex items-center gap-3
                    p-3 bg-white border border-slate-100
                    rounded-xl">
                  <div className="w-9 h-9 rounded-xl
                    bg-gradient-to-br from-blue-500
                    to-indigo-600 flex items-center
                    justify-center text-white text-xs
                    font-bold flex-shrink-0">
                    {getInitials(s.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold
                      text-slate-800 truncate">
                      {s.fullName}
                    </p>
                    <p className="text-xs
                      text-slate-400">
                      {s.rollNumber}
                    </p>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={maxMarks}
                    value={marks[s.id] || ''}
                    onChange={e =>
                      setMarks(prev => ({
                        ...prev,
                        [s.id]: e.target.value,
                      }))}
                    placeholder="—"
                    className="w-20 px-3 py-2
                      rounded-lg border
                      border-slate-200 text-sm
                      text-center text-slate-700
                      bg-white outline-none
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-500/20"
                  />
                  <span className="text-xs
                    text-slate-400 w-12
                    text-right">
                    /{maxMarks}
                  </span>
                </div>
              ))}
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
                onClick={createExam}
                disabled={loading}
                className="flex items-center gap-2
                  px-5 py-2 bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-blue-400 text-white
                  text-sm font-semibold rounded-xl
                  transition-colors">
                {loading
                  ? <><Loader2 size={16}
                      className="animate-spin" />
                      Creating...</>
                  : 'Next →'}
              </button>
            )}
            {step === 2 && (
              <button
                onClick={submitMarks}
                disabled={loading}
                className="flex items-center gap-2
                  px-5 py-2 bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-blue-400 text-white
                  text-sm font-semibold rounded-xl
                  transition-colors">
                {loading
                  ? <><Loader2 size={16}
                      className="animate-spin" />
                      Saving...</>
                  : 'Save Marks'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}