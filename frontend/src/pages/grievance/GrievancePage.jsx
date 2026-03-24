import { useState } from 'react'
import { useQuery, useQueryClient }
  from '@tanstack/react-query'
import {
  MessageSquare, Plus, ChevronDown,
  Send, CheckCircle, Clock,
  AlertCircle, ArrowUp
} from 'lucide-react'
import { grievanceApi }
  from '../../api/grievanceApi'
import { studentApi } from '../../api/studentApi'
import useAuthStore from '../../store/authStore'
import { ROLES, GRIEVANCE_CATEGORIES }
  from '../../utils/constants'
import { formatDate, getInitials }
  from '../../utils/helpers'
import toast from 'react-hot-toast'

const statusConfig = {
  SUBMITTED: {
    color: 'bg-blue-50 text-blue-700',
    icon:  Clock,
  },
  ASSIGNED: {
    color: 'bg-yellow-50 text-yellow-700',
    icon:  AlertCircle,
  },
  ESCALATED: {
    color: 'bg-orange-50 text-orange-700',
    icon:  ArrowUp,
  },
  RESOLVED: {
    color: 'bg-emerald-50 text-emerald-700',
    icon:  CheckCircle,
  },
}

export default function GrievancePage() {
  const { user } = useAuthStore()
  const isStudent = user?.role === ROLES.STUDENT
  const isAdmin   = user?.role === ROLES.ADMIN
  const isHod     = user?.role === ROLES.HOD

  const [showSubmit, setShowSubmit] =
    useState(false)
  const [selected, setSelected] = useState(null)
  const queryClient = useQueryClient()

  // Student: find own studentId
  const { data: myStudent } = useQuery({
    queryKey: ['my-student-griev', user?.id],
    queryFn:  () =>
      studentApi.getMe()
        .then(r => r.data?.data || null)
        .catch(() => null),
    enabled: isStudent,
  })

  // Student: own grievances
  const { data: myGrievances = [] } = useQuery({
    queryKey: ['my-grievances', myStudent?.id],
    queryFn:  () =>
      grievanceApi.getByStudent(myStudent.id)
        .then(r => r.data?.data || []),
    enabled: isStudent && !!myStudent?.id,
  })

  // Admin/HOD: all grievances
  const { data: allGrievances = [] } = useQuery({
    queryKey: ['all-grievances'],
    queryFn:  () =>
      grievanceApi.getAll()
        .then(r => r.data?.data || []),
    enabled: isAdmin || isHod,
  })

  const grievances = isStudent
    ? myGrievances : allGrievances

  const pending   = grievances.filter(g =>
    g.status !== 'RESOLVED').length
  const resolved  = grievances.filter(g =>
    g.status === 'RESOLVED').length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Grievances</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isStudent
              ? 'Submit and track your complaints'
              : 'Manage student grievances'}
          </p>
        </div>
        {isStudent && (
          <button
            onClick={() => setShowSubmit(true)}
            className="flex items-center gap-2
              px-4 py-2.5 bg-blue-600
              hover:bg-blue-700 text-white
              text-sm font-semibold rounded-xl
              transition-colors shadow-sm">
            <Plus size={18} />
            Submit Grievance
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',
            value: grievances.length,
            color: 'text-blue-600' },
          { label: 'Pending',
            value: pending,
            color: 'text-orange-600' },
          { label: 'Resolved',
            value: resolved,
            color: 'text-emerald-600' },
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

      {/* List */}
      <div className="space-y-3">
        {grievances.length === 0 && (
          <div className="bg-white rounded-2xl
            border border-slate-100 shadow-sm
            p-12 text-center">
            <MessageSquare size={40}
              className="text-slate-200
                mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              No grievances found
            </p>
            {isStudent && (
              <button
                onClick={() => setShowSubmit(true)}
                className="mt-3 text-blue-600
                  text-sm hover:underline">
                Submit your first grievance
              </button>
            )}
          </div>
        )}

        {grievances.map(g => {
          const cfg = statusConfig[g.status]
            || statusConfig.SUBMITTED
          const Icon = cfg.icon
          return (
            <div
              key={g.id}
              className="bg-white rounded-2xl
                border border-slate-100 shadow-sm
                p-5 cursor-pointer
                hover:shadow-md transition-shadow"
              onClick={() => setSelected(
                selected?.id === g.id ? null : g)}>
              <div className="flex items-start
                justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center
                    gap-2 flex-wrap">
                    <h3 className="text-sm font-bold
                      text-slate-800">
                      {g.subject}
                    </h3>
                    <span className={`px-2.5 py-0.5
                      rounded-lg text-xs
                      font-semibold ${cfg.color}`}>
                      <Icon size={11}
                        className="inline mr-1" />
                      {g.status}
                    </span>
                    <span className="px-2 py-0.5
                      bg-slate-100 text-slate-600
                      text-xs rounded-lg">
                      {g.category}
                    </span>
                  </div>
                  <p className="text-sm
                    text-slate-500 mt-1.5
                    line-clamp-2">
                    {g.description}
                  </p>
                  <div className="flex items-center
                    gap-3 mt-2 text-xs text-slate-400">
                    {!isStudent && !g.anonymous && (
                      <span>
                        By: {g.studentName}
                      </span>
                    )}
                    <span>
                      {formatDate(g.submittedAt)}
                    </span>
                    {g.assignedFacultyName && (
                      <span>
                        Assigned: {g.assignedFacultyName}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-slate-400
                    flex-shrink-0 transition-transform
                    ${selected?.id === g.id
                      ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Expanded */}
              {selected?.id === g.id && (
                <GrievanceDetail
                  grievance={g}
                  userId={user?.id}
                  isAdmin={isAdmin}
                  isHod={isHod}
                  isStudent={isStudent}
                  onRefresh={() =>
                    queryClient.invalidateQueries(
                      isStudent
                        ? ['my-grievances']
                        : ['all-grievances'])}
                />
              )}
            </div>
          )
        })}
      </div>

      {showSubmit && myStudent && (
        <SubmitGrievanceModal
          studentId={myStudent.id}
          onClose={() => setShowSubmit(false)}
          onSuccess={() => {
            setShowSubmit(false)
            queryClient.invalidateQueries(
              ['my-grievances'])
            toast.success('Grievance submitted!')
          }}
        />
      )}
    </div>
  )
}

function GrievanceDetail({
  grievance, userId, isAdmin,
  isHod, isStudent, onRefresh
}) {
  const [comment,  setComment]  = useState('')
  const [resolve,  setResolve]  = useState('')
  const [showRes,  setShowRes]  = useState(false)
  const [loading,  setLoading]  = useState(false)

  const { data: comments = [],
          refetch: refetchComments } = useQuery({
    queryKey: ['comments', grievance.id],
    queryFn:  () =>
      grievanceApi.getComments(grievance.id)
        .then(r => r.data?.data || []),
  })

  const addComment = async () => {
    if (!comment.trim()) return
    setLoading(true)
    try {
      await grievanceApi.addComment(
        grievance.id, userId,
        { comment })
      setComment('')
      refetchComments()
      toast.success('Comment added!')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  const resolveGrievance = async () => {
    if (!resolve.trim()) {
      toast.error('Enter resolution note')
      return
    }
    setLoading(true)
    try {
      await grievanceApi.resolve(
        grievance.id,
        { resolutionNote: resolve })
      onRefresh()
      toast.success('Grievance resolved!')
    } catch {
      toast.error('Failed to resolve')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 pt-4
      border-t border-slate-100
      space-y-4"
      onClick={e => e.stopPropagation()}>

      {/* Resolution note */}
      {grievance.resolutionNote && (
        <div className="p-3 bg-emerald-50
          rounded-xl border border-emerald-200">
          <p className="text-xs font-semibold
            text-emerald-700 mb-1">
            Resolution
          </p>
          <p className="text-sm text-emerald-800">
            {grievance.resolutionNote}
          </p>
        </div>
      )}

      {/* Comments */}
      <div>
        <p className="text-xs font-semibold
          text-slate-500 uppercase
          tracking-wider mb-3">
          Comment Trail
        </p>
        <div className="space-y-2 max-h-48
          overflow-y-auto">
          {comments.length === 0 && (
            <p className="text-xs text-slate-400
              py-2">
              No comments yet
            </p>
          )}
          {comments.map(c => (
            <div key={c.id}
              className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg
                bg-slate-200 flex items-center
                justify-center text-xs font-bold
                text-slate-600 flex-shrink-0">
                {getInitials(c.commenterName)}
              </div>
              <div className="flex-1
                bg-slate-50 rounded-xl p-3">
                <div className="flex items-center
                  gap-2">
                  <span className="text-xs
                    font-semibold text-slate-700">
                    {c.commenterName}
                  </span>
                  <span className="text-xs
                    text-slate-400">
                    {formatDate(c.commentedAt)}
                  </span>
                </div>
                <p className="text-sm
                  text-slate-600 mt-0.5">
                  {c.comment}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Add comment */}
        <div className="flex items-center gap-2 mt-3">
          <input
            value={comment}
            onChange={e =>
              setComment(e.target.value)}
            onKeyDown={e =>
              e.key === 'Enter' && addComment()}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2
              rounded-xl border border-slate-200
              text-sm text-slate-700 bg-white
              outline-none focus:border-blue-400"
          />
          <button
            onClick={addComment}
            disabled={loading || !comment.trim()}
            className="p-2 bg-blue-600
              hover:bg-blue-700 text-white
              rounded-xl transition-colors
              disabled:bg-blue-300">
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Resolve (admin/hod) */}
      {(isAdmin || isHod)
        && grievance.status !== 'RESOLVED' && (
        <div>
          {!showRes
            ? (
            <button
              onClick={() => setShowRes(true)}
              className="px-4 py-2 bg-emerald-600
                hover:bg-emerald-700 text-white
                text-xs font-semibold rounded-xl
                transition-colors">
              ✓ Mark as Resolved
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={resolve}
                onChange={e =>
                  setResolve(e.target.value)}
                placeholder="Enter resolution note..."
                rows={2}
                className="w-full px-3 py-2
                  rounded-xl border border-slate-200
                  text-sm text-slate-700 bg-white
                  outline-none resize-none
                  focus:border-blue-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={resolveGrievance}
                  disabled={loading}
                  className="px-4 py-2
                    bg-emerald-600
                    hover:bg-emerald-700
                    text-white text-xs
                    font-semibold rounded-xl
                    transition-colors">
                  {loading
                    ? 'Resolving...'
                    : 'Confirm Resolve'}
                </button>
                <button
                  onClick={() => setShowRes(false)}
                  className="px-4 py-2
                    text-slate-600 text-xs
                    font-medium hover:bg-slate-100
                    rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SubmitGrievanceModal({
  studentId, onClose, onSuccess
}) {
  const [subject,   setSubject]   = useState('')
  const [desc,      setDesc]      = useState('')
  const [category,  setCategory]  =
    useState('ACADEMIC')
  const [anonymous, setAnonymous] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const handleSubmit = async () => {
    if (!subject || !desc) {
      toast.error('Fill all required fields')
      return
    }
    setLoading(true)
    try {
      await grievanceApi.submit(studentId, {
        subject, description: desc,
        category, anonymous,
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
            Submit Grievance
          </h2>
          <button onClick={onClose}
            className="p-2 hover:bg-slate-100
              rounded-lg transition-colors text-slate-400">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Subject *
            </label>
            <input
              value={subject}
              onChange={e =>
                setSubject(e.target.value)}
              placeholder="Brief subject line"
              className="w-full px-3 py-2.5
                rounded-xl border border-slate-200
                text-sm text-slate-700 outline-none
                focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={e =>
                setCategory(e.target.value)}
              className="w-full px-3 py-2.5
                rounded-xl border border-slate-200
                text-sm text-slate-700 bg-white
                outline-none focus:border-blue-400">
              {GRIEVANCE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Description *
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe your grievance
                in detail..."
              rows={4}
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
            className="px-5 py-2 bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-400 text-white
              text-sm font-semibold rounded-xl
              transition-colors">
            {loading
              ? 'Submitting...'
              : 'Submit Grievance'}
          </button>
        </div>
      </div>
    </div>
  )
}