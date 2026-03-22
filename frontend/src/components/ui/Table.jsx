import { useMemo, useState } from 'react'
import { ArrowDownAZ, ArrowUpZA } from 'lucide-react'

export default function Table({
  columns,
  data,
  pageSize = 10,
  loading = false,
  emptyText = 'No records found',
}) {
  const [sort, setSort] = useState(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const rows = useMemo(() => {
    let filtered = [...(data ?? [])]
    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter((row) => JSON.stringify(row).toLowerCase().includes(q))
    }

    if (sort) {
      filtered.sort((a, b) => {
        const x = String(a?.[sort.key] ?? '')
        const y = String(b?.[sort.key] ?? '')
        return sort.dir === 'asc' ? x.localeCompare(y) : y.localeCompare(x)
      })
    }
    return filtered
  }, [data, sort, query])

  const totalPages = Math.max(
    1,
    Math.ceil(rows.length / pageSize)
  )
  const pageRows = rows.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const toggleSort = (key) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' }
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
    })
  }

  const goToPage = (nextPage) => {
    setPage(Math.min(totalPages, Math.max(1, nextPage)))
  }

  return (
    <div className="space-y-3">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setPage(1)
        }}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        placeholder="Filter rows..."
      />
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold">
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort(col.key)}>
                    {col.label}
                    {sort?.key === col.key ? sort.dir === 'asc' ? <ArrowDownAZ size={14} /> : <ArrowUpZA size={14} /> : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && pageRows.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-100 hover:bg-indigo-50/40">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-slate-700">
                    {col.render ? col.render(row) : row[col.key] ?? '--'}
                  </td>
                ))}
              </tr>
            ))}
            {loading && (
              <tr className="border-t border-slate-100">
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!loading && pageRows.length === 0 && (
              <tr className="border-t border-slate-100">
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          Showing {pageRows.length} of {rows.length} records
        </p>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-200 px-2 py-1 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
          >
            Prev
          </button>
          <span>
            {page}/{totalPages}
          </span>
          <button
            className="rounded-lg border border-slate-200 px-2 py-1 disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}