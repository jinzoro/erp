import { useState, useMemo } from 'react'
import { Table, type Column } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { mockData } from '@/data/mockData'
import { JournalEntryForm } from './journal-entry-form'
import { Search, Plus, Eye, FileText } from 'lucide-react'
import type { JournalEntry } from '@/types/finance'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export function JournalEntries() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    let items = mockData.journalEntries
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (e) =>
          e.number.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.reference.toLowerCase().includes(q),
      )
    }
    if (statusFilter) items = items.filter((e) => e.status === statusFilter)
    if (dateFrom) items = items.filter((e) => e.date >= dateFrom)
    if (dateTo) items = items.filter((e) => e.date <= dateTo)
    return items
  }, [search, statusFilter, dateFrom, dateTo])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const totalDebit = (entry: JournalEntry) =>
    entry.lines.reduce((s, l) => s + l.debit, 0)
  const totalCredit = (entry: JournalEntry) =>
    entry.lines.reduce((s, l) => s + l.credit, 0)

  const columns: Column<JournalEntry>[] = [
    { key: 'number', header: 'Number', width: '140px' },
    {
      key: 'date',
      header: 'Date',
      width: '120px',
      render: (e) => formatDate(e.date),
    },
    { key: 'description', header: 'Description' },
    { key: 'reference', header: 'Reference', width: '120px' },
    {
      key: 'debitTotal',
      header: 'Total Debit',
      width: '130px',
      className: 'text-right font-medium',
      render: (e) => formatCurrency(totalDebit(e)),
    },
    {
      key: 'creditTotal',
      header: 'Total Credit',
      width: '130px',
      className: 'text-right font-medium',
      render: (e) => formatCurrency(totalCredit(e)),
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (e) => <StatusBadge status={e.status} />,
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      render: (e) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(ev) => { ev.stopPropagation(); setSelectedEntry(e) }}
          leftIcon={<Eye className="h-4 w-4" />}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardContent className="p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Journal Entries</h2>
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>
              New Entry
            </Button>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search entries..."
                leftIcon={<Search className="h-4 w-4" />}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className="w-40" />
            <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className="w-40" />
            <div className="w-40">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              />
            </div>
          </div>
          <Table<JournalEntry>
            columns={columns}
            data={paginated}
            keyExtractor={(e) => e.id}
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            onRowClick={setSelectedEntry}
            emptyState={
              <div className="py-8 text-center text-sm text-slate-500">No journal entries found</div>
            }
          />
        </CardContent>
      </Card>

      <Modal open={!!selectedEntry} onClose={() => setSelectedEntry(null)} size="xl">
        {selectedEntry && (
          <>
            <ModalHeader onClose={() => setSelectedEntry(null)}>
              {selectedEntry.number}
            </ModalHeader>
            <ModalBody>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500">Date</label>
                  <p className="text-sm text-slate-900">{formatDate(selectedEntry.date)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Reference</label>
                  <p className="text-sm text-slate-900">{selectedEntry.reference}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Status</label>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedEntry.status} />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs font-medium text-slate-500">Description</label>
                <p className="text-sm text-slate-900">{selectedEntry.description}</p>
              </div>

              <h4 className="mb-2 text-sm font-semibold text-slate-900">Line Items</h4>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Account</th>
                      <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Debit</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedEntry.lines.map((line) => (
                      <tr key={line.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2">
                          <span className="font-medium text-slate-900">{line.accountCode}</span>
                          <span className="ml-2 text-slate-500">{line.accountName}</span>
                        </td>
                        <td className="px-4 py-2 text-slate-700">{line.description}</td>
                        <td className="px-4 py-2 text-right text-slate-900">{line.debit ? formatCurrency(line.debit) : '-'}</td>
                        <td className="px-4 py-2 text-right text-slate-900">{line.credit ? formatCurrency(line.credit) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-slate-200 bg-slate-50 font-medium">
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-right text-sm text-slate-700">Totals</td>
                      <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(totalDebit(selectedEntry))}</td>
                      <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(totalCredit(selectedEntry))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </ModalBody>
            <ModalFooter>
              <span className="text-xs text-slate-500">
                Created by user ID: {selectedEntry.createdBy} | {selectedEntry.createdAt}
              </span>
            </ModalFooter>
          </>
        )}
      </Modal>

      {showForm && <JournalEntryForm open={showForm} onClose={() => setShowForm(false)} />}
    </div>
  )
}
