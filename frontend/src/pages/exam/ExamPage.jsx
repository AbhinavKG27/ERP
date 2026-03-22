import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen, Plus, Award,
  TrendingUp, FileText, Search
} from 'lucide-react'
import { examApi } from '../../api/examApi'
import { studentApi } from '../../api/studentApi'
import useAuthStore from '../../store/authStore'
import { ROLES, ACADEMIC_YEARS, SEMESTERS }
  from '../../utils/constants'
import {
  getInitials, getGradeColor
} from '../../utils/helpers'
import EnterMarksModal from './EnterMarksModal'

const GradeBadge = ({ grade }) => {
  const colors = {
    O:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    'A+':'bg-green-50 text-green-700 border-green-200',
    A:   'bg-blue-50 text-blue-700 border-blue-200',
    'B+':'bg-blue-50 text-blue-600 border-blue-200',
    B:   'bg-yellow-50 text-yellow-700 border-yellow-200',
    C:   'bg-orange-50 text-orange-700 border-orange-200',
    F:   'bg-red-50 text-red-700 border-red-200',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-lg
      text-xs font-bold border
      ${colors[grade] || colors.C}`}>
      {grade || '—'}
    </span>
  )
}

export default function ExamPage() {
  const { user } = useAuthStore()
  const isStudent = user?.role === ROLES.STUDENT
  const [academicYear, setAcademicYear] =
    useState('2025-26')
  const [semester, setSemester] = useState(3)
  const [showEnter, setShowEnter] = useState(false)
  const [selectedStudent, setSelectedStudent] =
    useState(null)

  // Student view
  const { data: myResults } = useQuery({
    queryKey: ['my-results',
      user?.id, academicYear, semester],
    queryFn:  () =>
      examApi.getResults(
        user?.id, academicYear, semester)
        .then(r => r.data?.data || []),
    enabled: isStudent,
  })

  // Admin/Faculty view
  const { data: studentsData } = useQuery({
    queryKey: ['students-list'],
    queryFn:  () =>
      studentApi.getAll(0, 50)
        .then(r =>
          r.data?.data?.content
          || r.data?.data || []),
    enabled: !isStudent,
  })

  const students = studentsData || []
  const results  = myResults  || []

  const cgpa = results.length
    ? (results.reduce((a, b) =>
        a + (b.gradePoint || 0), 0)
      / results.length).toFixed(2)
    : null

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Exams & Marks</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isStudent
              ? 'Your academic results'
              : 'Manage exams and enter marks'}
          </p>
        </div>
        <div className="flex items-center gap-3
          flex-wrap">
          <select
            value={academicYear}
            onChange={e =>
              setAcademicYear(e.target.value)}
            className="px-3 py-2 border border-slate-200
              rounded-xl text-sm text-slate-600
              bg-white outline-none
              focus:border-blue-400">
            {ACADEMIC_YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={semester}
            onChange={e =>
              setSemester(Number(e.target.value))}
            className="px-3 py-2 border border-slate-200
              rounded-xl text-sm text-slate-600
              bg-white outline-none
              focus:border-blue-400">
            {SEMESTERS.map(s => (
              <option key={s} value={s}>
                Sem {s}
              </option>
            ))}
          </select>
          {!isStudent && (
            <button
              onClick={() => setShowEnter(true)}
              className="flex items-center gap-2
                px-4 py-2.5 bg-blue-600
                hover:bg-blue-700 text-white
                text-sm font-semibold rounded-xl
                transition-colors shadow-sm
                shadow-blue-500/25">
              <Plus size={18} />
              Enter Marks
            </button>
          )}
        </div>
      </div>

      {/* Student View */}
      {isStudent && (
        <div className="space-y-4">
          {/* CGPA card */}
          {cgpa && (
            <div className="bg-gradient-to-r
              from-blue-600 to-indigo-600
              rounded-2xl p-6 flex items-center
              justify-between">
              <div>
                <p className="text-blue-200 text-sm">
                  Semester GPA
                </p>
                <p className="text-5xl font-bold
                  text-white mt-1">
                  {cgpa}
                </p>
                <p className="text-blue-200
                  text-sm mt-1">
                  out of 10.0
                </p>
              </div>
              <Award size={64}
                className="text-white/20" />
            </div>
          )}

          {results.length === 0 && (
            <div className="bg-white rounded-2xl
              border border-slate-100 shadow-sm
              p-12 text-center">
              <BookOpen size={40}
                className="text-slate-200
                  mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                No results for {academicYear}
                Sem {semester}
              </p>
            </div>
          )}

          {/* Results table */}
          {results.length > 0 && (
            <div className="bg-white rounded-2xl
              border border-slate-100 shadow-sm
              overflow-hidden">
              <div className="p-4 border-b
                border-slate-100">
                <h2 className="text-base font-semibold
                  text-slate-700">
                  Results — Semester {semester}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50
                      border-b border-slate-100">
                      {['Subject', 'CIA1',
                        'CIA2', 'External',
                        'Internal', 'Combined',
                        'Grade', 'Points',
                        'Status'].map(h => (
                        <th key={h}
                          className="text-left
                            text-xs font-semibold
                            text-slate-500 uppercase
                            tracking-wider
                            px-4 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y
                    divide-slate-50">
                    {results.map(r => (
                      <tr key={r.subjectId}
                        className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <p className="text-sm
                            font-semibold
                            text-slate-800">
                            {r.subjectName}
                          </p>
                          <p className="text-xs
                            text-slate-400">
                            {r.subjectCode}
                          </p>
                        </td>
                        <td className="px-4 py-3
                          text-sm text-slate-600">
                          {r.cia1Marks ?? '—'}
                        </td>
                        <td className="px-4 py-3
                          text-sm text-slate-600">
                          {r.cia2Marks ?? '—'}
                        </td>
                        <td className="px-4 py-3
                          text-sm text-slate-600">
                          {r.externalMarks ?? '—'}
                        </td>
                        <td className="px-4 py-3
                          text-sm text-slate-600">
                          {r.internalMarks ?? '—'}
                        </td>
                        <td className="px-4 py-3
                          text-sm font-semibold
                          text-slate-700">
                          {r.combinedMarks
                            ? Number(r.combinedMarks)
                                .toFixed(1)
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <GradeBadge
                            grade={r.gradeLetter} />
                        </td>
                        <td className="px-4 py-3
                          text-sm font-bold
                          text-blue-600">
                          {r.gradePoint ?? '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1
                            rounded-lg text-xs
                            font-semibold border
                            ${r.isPass
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {r.isPass
                              ? 'Pass'
                              : 'Fail'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin/Faculty View */}
      {!isStudent && (
        <div className="bg-white rounded-2xl
          border border-slate-100 shadow-sm
          overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-base font-semibold
              text-slate-700">
              Student Results
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Click on a student to view
              or enter marks
            </p>
          </div>

          <div className="divide-y divide-slate-50">
            {students.map(s => (
              <StudentResultRow
                key={s.id}
                student={s}
                academicYear={academicYear}
                semester={semester}
              />
            ))}
          </div>
        </div>
      )}

      {showEnter && (
        <EnterMarksModal
          students={students}
          onClose={() => setShowEnter(false)}
        />
      )}
    </div>
  )
}

function StudentResultRow({
  student, academicYear, semester
}) {
  const [expanded, setExpanded] = useState(false)

  const { data: results } = useQuery({
    queryKey: ['results',
      student.id, academicYear, semester],
    queryFn:  () =>
      examApi.getResults(
        student.id, academicYear, semester)
        .then(r => r.data?.data || []),
    enabled: expanded,
  })

  const gpa = results?.length
    ? (results.reduce((a, b) =>
        a + (b.gradePoint || 0), 0)
      / results.length).toFixed(2)
    : null

  return (
    <div>
      <div
        className="flex items-center gap-4
          px-4 py-3 hover:bg-slate-50/50
          cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}>
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
        {gpa && (
          <span className="px-3 py-1 bg-blue-50
            text-blue-700 rounded-xl text-xs
            font-bold">
            GPA: {gpa}
          </span>
        )}
        <div className={`text-slate-400
          transition-transform
          ${expanded ? 'rotate-180' : ''}`}>
          ▾
        </div>
      </div>

      {expanded && results && (
        <div className="px-4 pb-4 bg-slate-50/30">
          {results.length === 0 && (
            <p className="text-xs text-slate-400
              py-3">
              No results entered yet for
              Sem {semester}
            </p>
          )}
          <div className="grid grid-cols-1
            sm:grid-cols-2 gap-2 mt-2">
            {results.map(r => (
              <div key={r.subjectId}
                className="bg-white rounded-xl p-3
                  border border-slate-100">
                <div className="flex items-center
                  justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold
                      text-slate-700 truncate">
                      {r.subjectName}
                    </p>
                    <p className="text-xs
                      text-slate-400 mt-0.5">
                      Combined:{' '}
                      {r.combinedMarks
                        ? Number(r.combinedMarks)
                            .toFixed(1)
                        : '—'}
                    </p>
                  </div>
                  <GradeBadge
                    grade={r.gradeLetter} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}