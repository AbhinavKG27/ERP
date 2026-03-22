import { useState } from 'react'
import { useQuery, useQueryClient }
  from '@tanstack/react-query'
import {
  Star, Plus, BarChart2,
  MessageCircle, ChevronDown
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { ROLES, ACADEMIC_YEARS, SEMESTERS }
  from '../../utils/constants'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const feedbackApi = {
  getForms:      () =>
    api.get('/feedback/forms'),
  getFormById:   (id) =>
    api.get(`/feedback/forms/${id}`),
  getByFaculty:  (facultyId) =>
    api.get(`/feedback/forms/faculty/${facultyId}`),
  createForm:    (createdById, data) =>
    api.post(`/feedback/forms/${createdById}`, data),
  submitFeedback: (formId, data) =>
    api.post(`/feedback/forms/${formId}/submit`, data),
  getReport:     (facultyId) =>
    api.get(`/feedback/report/faculty/${facultyId}`),
  getResponses:  (formId) =>
    api.get(`/feedback/forms/${formId}/responses`),
  closeForm:     (formId) =>
    api.put(`/feedback/forms/${formId}/close`),
}

const StarRating = ({ value, onChange, readOnly }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s}
        type="button"
        onClick={() => !readOnly && onChange?.(s)}
        className={`transition-colors
          ${readOnly
            ? 'cursor-default'
            : 'cursor-pointer hover:scale-110'}`}>
        <Star
          size={20}
          className={s <= value
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-slate-200'}
        />
      </button>
    ))}
  </div>
)

export default function FeedbackPage() {
  const { user } = useAuthStore()
  const isAdmin   = user?.role === ROLES.ADMIN
  const isHod     = user?.role === ROLES.HOD
  const isStudent = user?.role === ROLES.STUDENT
  const isFaculty = user?.role === ROLES.FACULTY

  const [showCreate, setShowCreate] =
    useState(false)
  const [selectedForm, setSelectedForm] =
    useState(null)
  const [showSubmit, setShowSubmit] =
    useState(false)
  const queryClient = useQueryClient()

  const { data: forms = [],
          isLoading } = useQuery({
    queryKey: ['feedback-forms'],
    queryFn:  () =>
      feedbackApi.getForms()
        .then(r => r.data?.data || []),
  })

  const activeForms = forms.filter(
    f => f.status === 'ACTIVE')
  const closedForms = forms.filter(
    f => f.status === 'CLOSED')

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Feedback</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isStudent
              ? 'Rate your faculty'
              : 'Manage feedback forms'}
          </p>
        </div>
        {(isAdmin || isHod) && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2
              px-4 py-2.5 bg-blue-600
              hover:bg-blue-700 text-white
              text-sm font-semibold rounded-xl
              transition-colors shadow-sm">
            <Plus size={18} />
            Create Form
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Forms',
            value: forms.length,
            color: 'text-blue-600' },
          { label: 'Active',
            value: activeForms.length,
            color: 'text-emerald-600' },
          { label: 'Closed',
            value: closedForms.length,
            color: 'text-slate-600' },
        ].map(s => (
          <div key={s.label}
            className="bg-white rounded-xl p-4
              border border-slate-100 shadow-sm
              text-center">
            <p className={`text-2xl font-bold
              ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500
              mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Forms List */}
      {isLoading && (
        <div className="text-center py-12
          text-slate-400 text-sm">
          Loading forms...
        </div>
      )}

      {forms.length === 0 && !isLoading && (
        <div className="bg-white rounded-2xl
          border border-slate-100 shadow-sm
          p-12 text-center">
          <MessageCircle size={40}
            className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            No feedback forms yet
          </p>
        </div>
      )}

      <div className="space-y-3">
        {forms.map(form => (
          <FeedbackFormCard
            key={form.id}
            form={form}
            isStudent={isStudent}
            isAdmin={isAdmin || isHod}
            userId={user?.id}
            onSubmit={() => {
              setSelectedForm(form)
              setShowSubmit(true)
            }}
            onClose={async () => {
              try {
                await feedbackApi.closeForm(form.id)
                queryClient.invalidateQueries(
                  ['feedback-forms'])
                toast.success('Form closed')
              } catch {
                toast.error('Failed to close')
              }
            }}
          />
        ))}
      </div>

      {showCreate && (
        <CreateFormModal
          userId={user?.id}
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false)
            queryClient.invalidateQueries(
              ['feedback-forms'])
            toast.success('Form created!')
          }}
        />
      )}

      {showSubmit && selectedForm && (
        <SubmitFeedbackModal
          form={selectedForm}
          userId={user?.id}
          onClose={() => {
            setShowSubmit(false)
            setSelectedForm(null)
          }}
          onSuccess={() => {
            setShowSubmit(false)
            setSelectedForm(null)
            toast.success('Feedback submitted!')
          }}
        />
      )}
    </div>
  )
}

function FeedbackFormCard({
  form, isStudent, isAdmin,
  onSubmit, onClose
}) {
  const [expanded, setExpanded] = useState(false)

  const { data: report } = useQuery({
    queryKey: ['faculty-report', form.facultyId],
    queryFn:  () =>
      feedbackApi.getReport(form.facultyId)
        .then(r => r.data?.data || null),
    enabled: expanded && isAdmin,
  })

  return (
    <div className="bg-white rounded-2xl
      border border-slate-100 shadow-sm p-5">
      <div className="flex items-start
        justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center
            gap-2 flex-wrap">
            <h3 className="text-sm font-bold
              text-slate-800">
              {form.title}
            </h3>
            <span className={`px-2.5 py-0.5
              rounded-lg text-xs font-semibold
              ${form.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'}`}>
              {form.status}
            </span>
          </div>
          <p className="text-xs text-slate-500
            mt-1">
            Faculty: {form.facultyName}
            {' • '}
            Dept: {form.departmentName}
            {' • '}
            Sem {form.semester}
            {' • '}
            {form.academicYear}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {form.responseCount} responses
            {form.deadline && ` • Due: ${
              formatDate(form.deadline)}`}
          </p>
        </div>
        <div className="flex items-center
          gap-2 flex-shrink-0">
          {isStudent
            && form.status === 'ACTIVE' && (
            <button
              onClick={onSubmit}
              className="px-3 py-1.5 bg-blue-600
                hover:bg-blue-700 text-white
                text-xs font-semibold rounded-lg
                transition-colors flex items-center
                gap-1">
              <Star size={13} />
              Rate
            </button>
          )}
          {isAdmin
            && form.status === 'ACTIVE' && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 border
                border-slate-200
                hover:bg-slate-50 text-slate-600
                text-xs font-medium rounded-lg
                transition-colors">
              Close
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() =>
                setExpanded(e => !e)}
              className="p-1.5 hover:bg-slate-100
                rounded-lg transition-colors">
              <ChevronDown
                size={16}
                className={`text-slate-400
                  transition-transform
                  ${expanded
                    ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      {expanded && isAdmin && report && (
        <div className="mt-4 pt-4
          border-t border-slate-100">
          <p className="text-xs font-semibold
            text-slate-500 uppercase
            tracking-wider mb-3">
            Performance Report
          </p>
          <div className="grid grid-cols-2
            sm:grid-cols-3 gap-3">
            {[
              ['Teaching',
                report.avgTeachingRating],
              ['Knowledge',
                report.avgKnowledgeRating],
              ['Communication',
                report.avgCommunicationRating],
              ['Punctuality',
                report.avgPunctualityRating],
              ['Overall',
                report.avgOverallRating],
            ].map(([label, val]) => (
              <div key={label}
                className="bg-slate-50
                  rounded-xl p-3">
                <p className="text-xs
                  text-slate-500">{label}</p>
                <div className="flex items-center
                  gap-2 mt-1">
                  <StarRating
                    value={Math.round(val || 0)}
                    readOnly
                  />
                  <span className="text-sm
                    font-bold text-slate-700">
                    {val?.toFixed(1) || '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Based on {report.totalResponses}
            {' '}responses
          </p>
        </div>
      )}
    </div>
  )
}

function CreateFormModal({ userId, onClose,
  onSuccess }) {
  const [title,       setTitle]       = useState('')
  const [facultyId,   setFacultyId]   = useState('')
  const [departmentId,setDeptId]      = useState('')
  const [academicYear,setAcYear]      =
    useState('2025-26')
  const [semester,    setSemester]    = useState(3)
  const [deadline,    setDeadline]    = useState('')
  const [loading,     setLoading]     = useState(false)

  const { data: depts = [] } = useQuery({
    queryKey: ['departments'],
    queryFn:  () =>
      api.get('/departments')
        .then(r => r.data?.data || []),
  })

  const { data: faculty = [] } = useQuery({
    queryKey: ['faculty-all'],
    queryFn:  async () => {
      if (!depts.length) return []
      const results = await Promise.all(
        depts.map(d =>
          api.get(`/faculty/department/${d.id}`)
            .then(r =>
              r.data?.data?.content
              || r.data?.data || [])
            .catch(() => [])
        )
      )
      return results.flat()
    },
    enabled: depts.length > 0,
  })

  const handleCreate = async () => {
    if (!title || !facultyId || !departmentId) {
      toast.error(
        'Title, faculty and department required')
      return
    }
    setLoading(true)
    try {
      await feedbackApi.createForm(userId, {
        title,
        facultyId:    Number(facultyId),
        departmentId: Number(departmentId),
        academicYear: academicYear,
        semester:     Number(semester),
        deadline:     deadline || undefined,
      })
      onSuccess()
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to create form')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full px-3 py-2.5 rounded-xl border ' +
    'border-slate-200 text-sm text-slate-700 ' +
    'bg-white outline-none focus:border-blue-400'

  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl
        w-full max-w-lg shadow-2xl">

        <div className="flex items-center
          justify-between p-5
          border-b border-slate-100">
          <h2 className="text-base font-bold
            text-slate-800">
            Create Feedback Form
          </h2>
          <button onClick={onClose}
            className="p-2 hover:bg-slate-100
              rounded-lg transition-colors
              text-slate-400">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Form Title *
            </label>
            <input value={title}
              onChange={e =>
                setTitle(e.target.value)}
              placeholder="Semester 3 Feedback"
              className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1.5">
                Department *
              </label>
              <select value={departmentId}
                onChange={e =>
                  setDeptId(e.target.value)}
                className={inputCls}>
                <option value="">
                  Select dept
                </option>
                {depts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1.5">
                Faculty *
              </label>
              <select value={facultyId}
                onChange={e =>
                  setFacultyId(e.target.value)}
                className={inputCls}>
                <option value="">
                  Select faculty
                </option>
                {faculty.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1.5">
                Academic Year
              </label>
              <select value={academicYear}
                onChange={e =>
                  setAcYear(e.target.value)}
                className={inputCls}>
                {ACADEMIC_YEARS.map(y => (
                  <option key={y} value={y}>{y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1.5">
                Semester
              </label>
              <select value={semester}
                onChange={e =>
                  setSemester(e.target.value)}
                className={inputCls}>
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs
                font-medium text-slate-600 mb-1.5">
                Deadline (optional)
              </label>
              <input type="date"
                value={deadline}
                onChange={e =>
                  setDeadline(e.target.value)}
                className={inputCls} />
            </div>
          </div>
        </div>

        <div className="flex items-center
          justify-end gap-3 p-5
          border-t border-slate-100">
          <button onClick={onClose}
            className="px-4 py-2 text-sm
              font-medium text-slate-600
              hover:bg-slate-100 rounded-xl
              transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-5 py-2 bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-400 text-white
              text-sm font-semibold rounded-xl
              transition-colors">
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SubmitFeedbackModal({
  form, userId, onClose, onSuccess
}) {
  const [ratings, setRatings] = useState({
    teachingRating:      0,
    knowledgeRating:     0,
    communicationRating: 0,
    punctualityRating:   0,
    overallRating:       0,
  })
  const [comments,  setComments]  = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const setRating = (k, v) =>
    setRatings(r => ({ ...r, [k]: v }))

  const handleSubmit = async () => {
    const allRated = Object.values(ratings)
      .every(v => v > 0)
    if (!allRated) {
      toast.error('Please rate all categories')
      return
    }
    setLoading(true)
    try {
      await feedbackApi.submitFeedback(form.id, {
        studentId: anonymous ? undefined : userId,
        anonymous,
        ...ratings,
        comments,
      })
      onSuccess()
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  const ratingFields = [
    ['teachingRating',      'Teaching Quality'],
    ['knowledgeRating',     'Subject Knowledge'],
    ['communicationRating', 'Communication'],
    ['punctualityRating',   'Punctuality'],
    ['overallRating',       'Overall Rating'],
  ]

  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl
        w-full max-w-md shadow-2xl">

        <div className="flex items-center
          justify-between p-5
          border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold
              text-slate-800">
              Rate Faculty
            </h2>
            <p className="text-xs text-slate-400">
              {form.facultyName} •
              {' '}{form.title}
            </p>
          </div>
          <button onClick={onClose}
            className="p-2 hover:bg-slate-100
              rounded-lg transition-colors
              text-slate-400">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {ratingFields.map(([key, label]) => (
            <div key={key}
              className="flex items-center
                justify-between">
              <span className="text-sm
                text-slate-600">{label}</span>
              <StarRating
                value={ratings[key]}
                onChange={v => setRating(key, v)}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Comments (optional)
            </label>
            <textarea
              value={comments}
              onChange={e =>
                setComments(e.target.value)}
              placeholder="Share your feedback..."
              rows={3}
              className="w-full px-3 py-2.5
                rounded-xl border border-slate-200
                text-sm text-slate-700 outline-none
                resize-none focus:border-blue-400"
            />
          </div>

          <label className="flex items-center
            gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={e =>
                setAnonymous(e.target.checked)}
              className="w-4 h-4 rounded
                accent-blue-600"
            />
            <span className="text-sm
              text-slate-600">
              Submit anonymously
            </span>
          </label>
        </div>

        <div className="flex items-center
          justify-end gap-3 p-5
          border-t border-slate-100">
          <button onClick={onClose}
            className="px-4 py-2 text-sm
              font-medium text-slate-600
              hover:bg-slate-100 rounded-xl
              transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2
              px-5 py-2 bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-400 text-white
              text-sm font-semibold rounded-xl
              transition-colors">
            {loading
              ? 'Submitting...'
              : <><Star size={16} />
                  Submit Rating</>}
          </button>
        </div>
      </div>
    </div>
  )
}