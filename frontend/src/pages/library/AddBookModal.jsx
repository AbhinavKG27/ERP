import { useState } from 'react'
import { X, BookOpen, Loader2 } from 'lucide-react'
import { libraryApi } from '../../api/libraryApi'
import toast from 'react-hot-toast'

export default function AddBookModal({
  onClose, onSuccess
}) {
  const [form, setForm] = useState({
    title: '', author: '', isbn: '',
    publisher: '', publicationYear: '',
    category: '', totalCopies: 1,
    locationShelf: '', isEbook: false,
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleAdd = async () => {
    if (!form.title || !form.author) {
      toast.error('Title and author are required')
      return
    }
    setLoading(true)
    try {
      await libraryApi.addBook({
        ...form,
        totalCopies: Number(form.totalCopies),
        publicationYear: form.publicationYear
          ? Number(form.publicationYear)
          : undefined,
      })
      onSuccess()
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to add book')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full px-3 py-2 rounded-lg border ' +
    'border-slate-200 text-sm text-slate-700 ' +
    'bg-white outline-none focus:border-blue-400'

  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl
        w-full max-w-lg max-h-[90vh]
        overflow-hidden flex flex-col shadow-2xl">

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
            <h2 className="text-base font-bold
              text-slate-800">Add New Book</h2>
          </div>
          <button onClick={onClose}
            className="p-2 hover:bg-slate-100
              rounded-lg transition-colors">
            <X size={18}
              className="text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto
          flex-1 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs
                font-medium text-slate-600 mb-1">
                Title *
              </label>
              <input
                value={form.title}
                onChange={e =>
                  set('title', e.target.value)}
                placeholder="Book title"
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs
                font-medium text-slate-600 mb-1">
                Author *
              </label>
              <input
                value={form.author}
                onChange={e =>
                  set('author', e.target.value)}
                placeholder="Author name"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1">
                ISBN
              </label>
              <input
                value={form.isbn}
                onChange={e =>
                  set('isbn', e.target.value)}
                placeholder="978-0..."
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1">
                Publisher
              </label>
              <input
                value={form.publisher}
                onChange={e =>
                  set('publisher', e.target.value)}
                placeholder="Publisher name"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1">
                Year
              </label>
              <input
                type="number"
                value={form.publicationYear}
                onChange={e =>
                  set('publicationYear',
                    e.target.value)}
                placeholder="2024"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1">
                Category
              </label>
              <input
                value={form.category}
                onChange={e =>
                  set('category', e.target.value)}
                placeholder="Computer Science"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1">
                Total Copies *
              </label>
              <input
                type="number"
                min={1}
                value={form.totalCopies}
                onChange={e =>
                  set('totalCopies',
                    e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1">
                Shelf Location
              </label>
              <input
                value={form.locationShelf}
                onChange={e =>
                  set('locationShelf',
                    e.target.value)}
                placeholder="CS-001"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center
          justify-end gap-3 p-5
          border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm
              font-medium text-slate-600
              hover:bg-slate-100 rounded-xl
              transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAdd}
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
                  Adding...</>
              : 'Add Book'}
          </button>
        </div>
      </div>
    </div>
  )
}