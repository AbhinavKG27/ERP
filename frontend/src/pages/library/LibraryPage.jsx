import { useState } from 'react'
import { useQuery, useQueryClient }
  from '@tanstack/react-query'
import {
  Library, Search, Plus, BookOpen,
  RotateCcw, Clock, AlertCircle
} from 'lucide-react'
import { libraryApi } from '../../api/libraryApi'
import useAuthStore from '../../store/authStore'
import { ROLES } from '../../utils/constants'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'
import AddBookModal from './AddBookModal'
import IssueBookModal from './IssueBookModal'

export default function LibraryPage() {
  const { user } = useAuthStore()
  const isLibrarian =
    user?.role === ROLES.LIBRARIAN
  const isAdmin = user?.role === ROLES.ADMIN

  const [tab,     setTab]     = useState('books')
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [showIssue,
         setShowIssue]        = useState(false)
  const queryClient = useQueryClient()

  // Search or browse books
  const { data: booksData,
          isLoading: loadingBooks } = useQuery({
    queryKey: ['books', search, page],
    queryFn:  () => {
      if (search.trim()) {
        return libraryApi.searchBooks(search, page)
          .then(r => r.data)
      }
      return libraryApi.getAvailable(page)
        .then(r => r.data)
    },
  })

  // Overdue books
  const { data: overdueBooks = [] } = useQuery({
    queryKey: ['overdue-books'],
    queryFn:  () =>
      libraryApi.getOverdue()
        .then(r => r.data?.data || []),
    enabled: isAdmin || isLibrarian,
  })

  // User issued books
  const { data: myBooks = [] } = useQuery({
    queryKey: ['my-books', user?.id],
    queryFn:  () =>
      libraryApi.getUserBooks(user?.id)
        .then(r => r.data?.data || []),
    enabled: !isAdmin && !isLibrarian,
  })

  const books = booksData?.data?.content
    || booksData?.data || []

  const tabs = [
    { id: 'books',    label: 'Book Catalog' },
    { id: 'issued',   label: 'Issued Books' },
    { id: 'overdue',
      label: `Overdue (${overdueBooks.length})` },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Library</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin || isLibrarian
              ? 'Manage books and issues'
              : 'Browse and borrow books'}
          </p>
        </div>
        {(isAdmin || isLibrarian) && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowIssue(true)}
              className="flex items-center gap-2
                px-4 py-2.5 border border-slate-200
                hover:bg-slate-50 text-slate-700
                text-sm font-semibold rounded-xl
                transition-colors">
              <BookOpen size={18} />
              Issue Book
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2
                px-4 py-2.5 bg-blue-600
                hover:bg-blue-700 text-white
                text-sm font-semibold rounded-xl
                transition-colors shadow-sm">
              <Plus size={18} />
              Add Book
            </button>
          </div>
        )}
      </div>

      {/* My Books (student/faculty) */}
      {!isAdmin && !isLibrarian
        && myBooks.length > 0 && (
        <div className="bg-white rounded-2xl
          border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold
            text-slate-700 mb-4">
            My Borrowed Books
          </h2>
          <div className="space-y-3">
            {myBooks.map(issue => (
              <div key={issue.id}
                className="flex items-center
                  gap-4 p-3 bg-slate-50
                  rounded-xl">
                <div className="w-10 h-10
                  rounded-xl bg-blue-100
                  flex items-center
                  justify-center flex-shrink-0">
                  <BookOpen size={18}
                    className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold
                    text-slate-800 truncate">
                    {issue.bookTitle}
                  </p>
                  <p className="text-xs
                    text-slate-400">
                    Due: {formatDate(issue.dueDate)}
                  </p>
                </div>
                <span className={`px-2.5 py-1
                  rounded-lg text-xs font-semibold
                  ${issue.status === 'OVERDUE'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-emerald-50 text-emerald-700'}`}>
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1
        bg-slate-100 rounded-xl w-fit">
        {tabs.filter(t =>
          t.id !== 'overdue'
          || isAdmin || isLibrarian)
          .map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg
              text-sm font-medium transition-all
              ${tab === t.id
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Books Tab */}
      {tab === 'books' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2
            bg-white border border-slate-200
            rounded-xl px-4 py-3 shadow-sm">
            <Search size={18}
              className="text-slate-400
                flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(0)
              }}
              placeholder="Search by title,
                author, ISBN..."
              className="bg-transparent text-sm
                text-slate-600
                placeholder-slate-400
                outline-none w-full"
            />
          </div>

          {/* Books Grid */}
          {loadingBooks && (
            <div className="text-center py-12
              text-slate-400 text-sm">
              Searching books...
            </div>
          )}

          <div className="grid grid-cols-1
            sm:grid-cols-2 lg:grid-cols-3
            xl:grid-cols-4 gap-4">
            {books.map(book => (
              <div key={book.id}
                className="bg-white rounded-2xl
                  border border-slate-100
                  shadow-sm p-5
                  hover:shadow-md transition-shadow">
                <div className="w-12 h-12
                  rounded-xl bg-blue-50
                  flex items-center
                  justify-center mb-4">
                  <BookOpen size={22}
                    className="text-blue-600" />
                </div>
                <h3 className="text-sm font-bold
                  text-slate-800 line-clamp-2
                  leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs
                  text-slate-500 mt-1 truncate">
                  {book.author}
                </p>
                {book.isbn && (
                  <p className="text-xs
                    text-slate-400 mt-0.5">
                    ISBN: {book.isbn}
                  </p>
                )}
                <div className="mt-3 flex items-center
                  justify-between">
                  <span className={`px-2.5 py-0.5
                    rounded-lg text-xs
                    font-semibold
                    ${book.availableCopies > 0
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'}`}>
                    {book.availableCopies > 0
                      ? `${book.availableCopies} available`
                      : 'Unavailable'}
                  </span>
                  {book.locationShelf && (
                    <span className="text-xs
                      text-slate-400">
                      {book.locationShelf}
                    </span>
                  )}
                </div>
                {!(isAdmin || isLibrarian)
                  && book.availableCopies > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        await libraryApi
                          .reserveBook(book.id)
                        toast.success(
                          'Book reserved!')
                      } catch (err) {
                        toast.error(
                          err?.response?.data
                            ?.message
                          || 'Failed to reserve')
                      }
                    }}
                    className="mt-3 w-full py-2
                      bg-blue-50 hover:bg-blue-100
                      text-blue-700 text-xs
                      font-semibold rounded-xl
                      transition-colors">
                    Reserve
                  </button>
                )}
              </div>
            ))}
          </div>

          {!loadingBooks
            && books.length === 0 && (
            <div className="bg-white rounded-2xl
              border border-slate-100 shadow-sm
              p-12 text-center">
              <Library size={40}
                className="text-slate-200
                  mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                {search
                  ? `No books found for "${search}"`
                  : 'No books in library yet'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Issued Tab */}
      {tab === 'issued' && (
        <IssuedBooksTab
          isAdmin={isAdmin || isLibrarian}
          userId={user?.id}
          queryClient={queryClient}
        />
      )}

      {/* Overdue Tab */}
      {tab === 'overdue' && (
        <div className="bg-white rounded-2xl
          border border-slate-100 shadow-sm
          overflow-hidden">
          <div className="p-4 border-b
            border-slate-100">
            <h2 className="text-base font-semibold
              text-slate-700">
              Overdue Books
            </h2>
          </div>
          {overdueBooks.length === 0 && (
            <div className="p-12 text-center">
              <Clock size={40}
                className="text-slate-200
                  mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                No overdue books
              </p>
            </div>
          )}
          <div className="divide-y divide-slate-50">
            {overdueBooks.map(issue => (
              <div key={issue.id}
                className="flex items-center
                  gap-4 p-4">
                <AlertCircle size={20}
                  className="text-red-500
                    flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold
                    text-slate-800">
                    {issue.bookTitle}
                  </p>
                  <p className="text-xs
                    text-slate-400">
                    {issue.userName} •
                    Due: {formatDate(issue.dueDate)}
                  </p>
                </div>
                {issue.fineAmount > 0 && (
                  <span className="text-sm
                    font-bold text-red-600">
                    ₹{issue.fineAmount}
                  </span>
                )}
                <button
                  onClick={async () => {
                    try {
                      await libraryApi
                        .returnBook(issue.id)
                      queryClient.invalidateQueries(
                        ['overdue-books'])
                      toast.success('Book returned!')
                    } catch (err) {
                      toast.error('Return failed')
                    }
                  }}
                  className="px-3 py-1.5
                    bg-emerald-600
                    hover:bg-emerald-700
                    text-white text-xs
                    font-semibold rounded-lg
                    transition-colors
                    flex-shrink-0">
                  Return
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <AddBookModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false)
            queryClient.invalidateQueries(['books'])
            toast.success('Book added!')
          }}
        />
      )}

      {showIssue && (
        <IssueBookModal
          onClose={() => setShowIssue(false)}
          onSuccess={() => {
            setShowIssue(false)
            queryClient.invalidateQueries(['books'])
            toast.success('Book issued!')
          }}
        />
      )}
    </div>
  )
}

function IssuedBooksTab({
  isAdmin, userId, queryClient
}) {
  const { data: issued = [] } = useQuery({
    queryKey: ['issued-books', userId],
    queryFn:  () =>
      libraryApi.getUserBooks(userId)
        .then(r => r.data?.data || []),
  })

  return (
    <div className="bg-white rounded-2xl
      border border-slate-100 shadow-sm
      overflow-hidden">
      <div className="p-4 border-b
        border-slate-100">
        <h2 className="text-base font-semibold
          text-slate-700">
          {isAdmin
            ? 'Currently Issued Books'
            : 'My Issued Books'}
        </h2>
      </div>
      {issued.length === 0 && (
        <div className="p-12 text-center">
          <BookOpen size={40}
            className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            No books currently issued
          </p>
        </div>
      )}
      <div className="divide-y divide-slate-50">
        {issued.map(issue => (
          <div key={issue.id}
            className="flex items-center
              gap-4 p-4">
            <div className="w-10 h-10 rounded-xl
              bg-blue-50 flex items-center
              justify-center flex-shrink-0">
              <BookOpen size={18}
                className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold
                text-slate-800 truncate">
                {issue.bookTitle}
              </p>
              <p className="text-xs text-slate-400">
                Issued: {formatDate(issue.issueDate)}
                {' • '}
                Due: {formatDate(issue.dueDate)}
              </p>
            </div>
            <span className={`px-2.5 py-1
              rounded-lg text-xs font-semibold
              border flex-shrink-0
              ${issue.status === 'OVERDUE'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
              {issue.status}
            </span>
            {isAdmin && (
              <button
                onClick={async () => {
                  try {
                    await libraryApi
                      .returnBook(issue.id)
                    queryClient.invalidateQueries(
                      ['issued-books'])
                    toast.success('Book returned!')
                  } catch {
                    toast.error('Return failed')
                  }
                }}
                className="px-3 py-1.5
                  border border-slate-200
                  hover:bg-slate-50 text-slate-600
                  text-xs font-medium rounded-lg
                  transition-colors flex-shrink-0
                  flex items-center gap-1">
                <RotateCcw size={13} />
                Return
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}