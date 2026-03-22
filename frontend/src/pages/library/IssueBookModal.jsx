import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Loader2 } from 'lucide-react'
import { libraryApi } from '../../api/libraryApi'
import { studentApi } from '../../api/studentApi'
import toast from 'react-hot-toast'

export default function IssueBookModal({
  onClose, onSuccess
}) {
  const [search,  setSearch]  = useState('')
  const [userId,  setUserId]  = useState('')
  const [bookId,  setBookId]  = useState('')
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  const { data: searchResults = [] } = useQuery({
    queryKey: ['book-search', search],
    queryFn:  () =>
      libraryApi.searchBooks(search, 0)
        .then(r =>
          r.data?.data?.content
          || r.data?.data || []),
    enabled: search.length >= 2,
  })

  const { data: students = [] } = useQuery({
    queryKey: ['students-for-issue'],
    queryFn:  () =>
      studentApi.getAll(0, 100)
        .then(r =>
          r.data?.data?.content
          || r.data?.data || []),
  })

  const handleIssue = async () => {
    if (!bookId || !userId) {
      toast.error('Select a book and a user')
      return
    }
    setLoading(true)
    try {
      await libraryApi.issueBook({
        bookId:    Number(bookId),
        userId:    Number(userId),
        issueDate: new Date()
          .toISOString().split('T')[0],
        dueDate,
      })
      onSuccess()
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to issue book')
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

        {/* Header */}
        <div className="flex items-center
          justify-between p-5
          border-b border-slate-100">
          <h2 className="text-base font-bold
            text-slate-800">Issue Book</h2>
          <button onClick={onClose}
            className="p-2 hover:bg-slate-100
              rounded-lg transition-colors">
            <X size={18}
              className="text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">

          {/* Book Search */}
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Search Book *
            </label>
            <input
              value={search}
              onChange={e =>
                setSearch(e.target.value)}
              placeholder="Type book title..."
              className={inputCls}
            />
            {searchResults.length > 0
              && search.length >= 2 && (
              <div className="mt-1 border
                border-slate-200 rounded-xl
                overflow-hidden max-h-40
                overflow-y-auto shadow-sm">
                {searchResults.map(b => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setBookId(b.id)
                      setSearch(b.title)
                    }}
                    className={`px-3 py-2.5
                      cursor-pointer text-sm
                      hover:bg-blue-50
                      transition-colors
                      ${String(bookId) ===
                        String(b.id)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700'}`}>
                    <p className="font-medium
                      truncate">
                      {b.title}
                    </p>
                    <p className="text-xs
                      text-slate-400">
                      {b.author} •
                      {' '}{b.availableCopies}
                      {' '}available
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Select */}
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Issue To *
            </label>
            <select
              value={userId}
              onChange={e =>
                setUserId(e.target.value)}
              className={inputCls}>
              <option value="">
                Select student / faculty
              </option>
              {students.map(s => (
                <option
                  key={s.userId || s.id}
                  value={s.userId || s.id}>
                  {s.fullName} —
                  {' '}{s.rollNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e =>
                setDueDate(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Footer */}
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
            onClick={handleIssue}
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
                  Issuing...</>
              : 'Issue Book'}
          </button>
        </div>
      </div>
    </div>
  )
}