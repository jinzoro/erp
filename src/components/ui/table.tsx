import { type ReactNode, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (item: T) => ReactNode
  className?: string
  headerClassName?: string
  width?: string
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (column: string) => void
  onRowClick?: (item: T) => void
  loading?: boolean
  emptyState?: ReactNode
  className?: string
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
}

function TableInner<T>({
  columns,
  data,
  keyExtractor,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  loading = false,
  emptyState,
  className,
  page,
  pageSize,
  total,
  onPageChange,
}: TableProps<T>) {
  const allSelected = data.length > 0 && data.every((item) => selectedIds.includes(keyExtractor(item)))
  const someSelected = !allSelected && data.some((item) => selectedIds.includes(keyExtractor(item)))

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      const idsToRemove = new Set(data.map((item) => keyExtractor(item)))
      onSelectionChange?.(selectedIds.filter((id) => !idsToRemove.has(id)))
    } else {
      const existing = new Set(selectedIds)
      data.forEach((item) => existing.add(keyExtractor(item)))
      onSelectionChange?.(Array.from(existing))
    }
  }, [allSelected, data, keyExtractor, onSelectionChange, selectedIds])

  const handleSelectRow = useCallback(
    (id: string) => {
      if (selectedIds.includes(id)) {
        onSelectionChange?.(selectedIds.filter((i) => i !== id))
      } else {
        onSelectionChange?.([...selectedIds, id])
      }
    },
    [onSelectionChange, selectedIds],
  )

  const totalPages = page && pageSize && total ? Math.ceil(total / pageSize) : 1

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {selectable && (
                <th className="sticky top-0 z-10 w-10 bg-slate-50 px-3 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'sticky top-0 z-10 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600',
                    col.sortable && 'cursor-pointer select-none hover:text-slate-900',
                    col.headerClassName,
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortColumn === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {selectable && <td className="px-3 py-3"><div className="h-4 w-4 animate-pulse rounded bg-slate-200" /></td>}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  {emptyState || (
                    <div className="text-sm text-slate-500">No data available</div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = keyExtractor(item)
                const isSelected = selectedIds.includes(id)
                return (
                  <tr
                    key={id}
                    className={cn(
                      'transition-colors duration-150',
                      onRowClick && 'cursor-pointer',
                      isSelected ? 'bg-primary-50' : 'hover:bg-slate-50',
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          checked={isSelected}
                          onChange={() => handleSelectRow(id)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn('px-4 py-3 text-slate-700', col.className)}
                      >
                        {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {page && total !== undefined && totalPages > 1 && onPageChange && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, idx, arr) => (
            <span key={p} className="flex items-center">
              {idx > 0 && arr[idx - 1] !== p - 1 && (
                <span className="px-1 text-slate-400">...</span>
              )}
              <button
                className={cn(
                  'min-w-[2rem] rounded-lg px-2 py-1 text-sm font-medium transition-colors',
                  p === page
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            </span>
          ))}
        <button
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function Table<T>(props: TableProps<T>) {
  return <TableInner<T> {...props} />
}
