import { useState } from 'react'
import { useQuery, useQueryClient }
  from '@tanstack/react-query'
import {
  Bell, Send, CheckCheck,
  Info, AlertTriangle,
  CheckCircle, Zap, Plus
} from 'lucide-react'
import { notificationApi }
  from '../../api/notificationApi'
import useAuthStore from '../../store/authStore'
import { ROLES } from '../../utils/constants'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const typeConfig = {
  INFO:    { icon: Info,
    color: 'text-blue-600',
    bg:    'bg-blue-50' },
  WARNING: { icon: AlertTriangle,
    color: 'text-yellow-600',
    bg:    'bg-yellow-50' },
  ALERT:   { icon: Zap,
    color: 'text-red-600',
    bg:    'bg-red-50' },
  SUCCESS: { icon: CheckCircle,
    color: 'text-emerald-600',
    bg:    'bg-emerald-50' },
}

export default function NotificationsPage() {
  const { user } = useAuthStore()
  const isAdmin   = user?.role === ROLES.ADMIN
  const [showSend, setShowSend] = useState(false)
  const queryClient = useQueryClient()

  const { data: notifications = [],
          isLoading } = useQuery({
    queryKey: ['notifications',
      user?.id, user?.role],
    queryFn:  () =>
      notificationApi.getForUser(
        user?.id, user?.role)
        .then(r => r.data?.data || []),
  })

  const { data: unreadData } = useQuery({
    queryKey: ['unread-count',
      user?.id, user?.role],
    queryFn:  () =>
      notificationApi.getUnreadCount(
        user?.id, user?.role)
        .then(r => r.data?.unreadCount || 0),
    refetchInterval: 30000,
  })

  const unreadCount = unreadData || 0

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead(
        user?.id, user?.role)
      queryClient.invalidateQueries(
        ['notifications'])
      queryClient.invalidateQueries(
        ['unread-count'])
      toast.success('All marked as read')
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const markOneRead = async (notifId) => {
    try {
      await notificationApi.markAsRead(
        notifId, user?.id)
      queryClient.invalidateQueries(
        ['notifications'])
      queryClient.invalidateQueries(
        ['unread-count'])
    } catch (error) {
      console.debug('Mark read failed:', error)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2
                px-4 py-2.5 border border-slate-200
                hover:bg-slate-50 text-slate-600
                text-sm font-semibold rounded-xl
                transition-colors">
              <CheckCheck size={18} />
              Mark all read
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowSend(true)}
              className="flex items-center gap-2
                px-4 py-2.5 bg-blue-600
                hover:bg-blue-700 text-white
                text-sm font-semibold rounded-xl
                transition-colors shadow-sm">
              <Send size={18} />
              Send Notification
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',
            value: notifications.length,
            color: 'text-blue-600' },
          { label: 'Unread',
            value: unreadCount,
            color: 'text-orange-600' },
          { label: 'Read',
            value: notifications.length
              - unreadCount,
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

      {/* Notifications List */}
      <div className="bg-white rounded-2xl
        border border-slate-100 shadow-sm
        overflow-hidden">

        {isLoading && (
          <div className="p-12 text-center
            text-slate-400 text-sm">
            Loading notifications...
          </div>
        )}

        {!isLoading
          && notifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell size={40}
              className="text-slate-200
                mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              No notifications yet
            </p>
          </div>
        )}

        <div className="divide-y divide-slate-50">
          {notifications.map(n => {
            const cfg = typeConfig[n.type]
              || typeConfig.INFO
            const Icon = cfg.icon
            return (
              <div
                key={n.id}
                onClick={() =>
                  !n.read && markOneRead(n.id)}
                className={`flex items-start
                  gap-4 p-4 transition-colors
                  cursor-pointer
                  ${n.read
                    ? 'hover:bg-slate-50/50'
                    : 'bg-blue-50/30 hover:bg-blue-50/50'}`}>

                <div className={`w-10 h-10
                  rounded-xl flex items-center
                  justify-center flex-shrink-0
                  ${cfg.bg}`}>
                  <Icon size={20}
                    className={cfg.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start
                    justify-between gap-2">
                    <p className={`text-sm
                      font-semibold
                      ${n.read
                        ? 'text-slate-700'
                        : 'text-slate-900'}`}>
                      {n.title}
                    </p>
                    <span className="text-xs
                      text-slate-400 flex-shrink-0">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm
                    text-slate-500 mt-0.5">
                    {n.message}
                  </p>
                  <div className="flex items-center
                    gap-2 mt-1.5">
                    <span className="text-xs
                      text-slate-400">
                      {n.targetType === 'ALL'
                        ? 'Broadcast'
                        : n.targetType === 'ROLE'
                        ? `To: ${n.targetRole}`
                        : 'Direct'}
                    </span>
                    {!n.read && (
                      <span className="w-2 h-2
                        bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showSend && (
        <SendNotificationModal
          userId={user?.id}
          onClose={() => setShowSend(false)}
          onSuccess={() => {
            setShowSend(false)
            queryClient.invalidateQueries(
              ['notifications'])
            toast.success('Notification sent!')
          }}
        />
      )}
    </div>
  )
}

function SendNotificationModal({
  userId, onClose, onSuccess
}) {
  const [title,      setTitle]      = useState('')
  const [message,    setMessage]    = useState('')
  const [type,       setType]       =
    useState('INFO')
  const [targetType, setTargetType] =
    useState('ALL')
  const [targetRole, setTargetRole] =
    useState('STUDENT')
  const [loading,    setLoading]    = useState(false)

  const handleSend = async () => {
    if (!title || !message) {
      toast.error('Fill title and message')
      return
    }
    setLoading(true)
    try {
      if (targetType === 'ALL') {
        await notificationApi.broadcast(
          userId, {
            title, message, type,
            targetType: 'ALL',
            broadcast: true,
          })
      } else {
        await notificationApi.send(userId, {
          title, message, type,
          targetType,
          targetRole: targetType === 'ROLE'
            ? targetRole : undefined,
          broadcast: false,
        })
      }
      onSuccess()
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to send')
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
        w-full max-w-md shadow-2xl">

        <div className="flex items-center
          justify-between p-5
          border-b border-slate-100">
          <h2 className="text-base font-bold
            text-slate-800">
            Send Notification
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
              Title *
            </label>
            <input value={title}
              onChange={e =>
                setTitle(e.target.value)}
              placeholder="Notification title"
              className={inputCls} />
          </div>
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Message *
            </label>
            <textarea
              value={message}
              onChange={e =>
                setMessage(e.target.value)}
              placeholder="Notification message..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1.5">
                Type
              </label>
              <select value={type}
                onChange={e =>
                  setType(e.target.value)}
                className={inputCls}>
                {['INFO', 'WARNING',
                  'ALERT', 'SUCCESS'].map(t => (
                  <option key={t} value={t}>{t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1.5">
                Send To
              </label>
              <select value={targetType}
                onChange={e =>
                  setTargetType(e.target.value)}
                className={inputCls}>
                <option value="ALL">
                  Everyone
                </option>
                <option value="ROLE">
                  By Role
                </option>
              </select>
            </div>
          </div>
          {targetType === 'ROLE' && (
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1.5">
                Role
              </label>
              <select value={targetRole}
                onChange={e =>
                  setTargetRole(e.target.value)}
                className={inputCls}>
                {['STUDENT', 'FACULTY',
                  'HOD', 'ADMIN', 'FINANCE',
                  'LIBRARIAN',
                  'HOSTEL_WARDEN'].map(r => (
                  <option key={r} value={r}>{r}
                  </option>
                ))}
              </select>
            </div>
          )}
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
            onClick={handleSend}
            disabled={loading}
            className="flex items-center gap-2
              px-5 py-2 bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-400 text-white
              text-sm font-semibold rounded-xl
              transition-colors">
            {loading
              ? 'Sending...'
              : <><Send size={16} />
                  Send</>}
          </button>
        </div>
      </div>
    </div>
  )
}