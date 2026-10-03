import { useState, useMemo } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { Table, type Column } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal'
import { mockData } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { PurchaseRequisition, PurchaseLine } from '@/types/procurement'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
]

const employeeMap: Record<string, string> = {}
for (const e of mockData.employees) {
  employeeMap[e.id] = `${e.firstName} ${e.lastName}`
}

export function PurchaseRequisitionList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedPr, setSelectedPr] = useState<PurchaseRequisition | null>(null)

  const requisitions = useMemo(() => {
    let data = mockData.purchaseRequisitions
    const q = search.toLowerCase()
    if (q) {
      data = data.filter(
        (pr) =>
          pr.number.toLowerCase().includes(q) ||
          pr.department.toLowerCase().includes(q) ||
          employeeMap[pr.requestedBy]?.toLowerCase().includes(q),
      )
    }
    if (statusFilter) {
      data = data.filter((pr) => pr.status === statusFilter)
    }
    if (dateFrom) {
      data = data.filter((pr) => pr.date >= dateFrom)
    }
    if (dateTo) {
      data = data.filter((pr) => pr.date <= dateTo)
    }
    return data
  }, [search, statusFilter, dateFrom, dateTo])

  const columns: Column<PurchaseRequisition>[] = [
    {
      key: 'number',
      header: 'Number',
      render: (pr) => <span className="font-medium text-primary-700">{pr.number}</span>,
    },
    {
      key: 'requestedBy',
      header: 'Requested By',
      render: (pr) => <span>{employeeMap[pr.requestedBy] || pr.requestedBy}</span>,
    },
    { key: 'department', header: 'Department' },
    {
      key: 'date',
      header: 'Date',
      render: (pr) => <span className="text-slate-600">{formatDate(pr.date)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (pr) => <StatusBadge status={pr.status} type="document" />,
    },
  ]

  const total = requisitions.reduce((s, pr) => s + pr.lines.reduce((sl, l) => sl + l.total, 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Purchase Requisitions</h1>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          New Requisition
        </Button>
      </div>

      <Card variant="glass" padding="none">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Input
            placeholder="Search requisitions..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-44"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={requisitions}
          keyExtractor={(pr) => pr.id}
          onRowClick={(pr) => setSelectedPr(pr)}
        />
      </Card>

      {requisitions.length > 0 && (
        <div className="flex items-center justify-end gap-2 px-5 py-2 text-sm text-slate-500">
          Total: <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
        </div>
      )}

      <Modal open={!!selectedPr} onClose={() => setSelectedPr(null)} size="lg">
        {selectedPr && (
          <>
            <ModalHeader onClose={() => setSelectedPr(null)}>
              {selectedPr.number}
            </ModalHeader>
            <ModalBody>
              <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Requested By:</span>
                  <p className="font-medium text-slate-900">
                    {employeeMap[selectedPr.requestedBy] || selectedPr.requestedBy}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Department:</span>
                  <p className="font-medium text-slate-900">{selectedPr.department}</p>
                </div>
                <div>
                  <span className="text-slate-500">Date:</span>
                  <p className="font-medium text-slate-900">{formatDate(selectedPr.date)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedPr.status} type="document" />
                  </div>
                </div>
                {selectedPr.notes && (
                  <div className="col-span-2">
                    <span className="text-slate-500">Notes:</span>
                    <p className="font-medium text-slate-900">{selectedPr.notes}</p>
                  </div>
                )}
              </div>
              <h4 className="mb-3 text-sm font-semibold text-slate-900">Line Items</h4>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Unit Price</th>
                    <th className="py-2 pr-4">Tax</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedPr.lines.map((line: PurchaseLine) => (
                    <tr key={line.id}>
                      <td className="py-2 pr-4 font-medium text-slate-900">{line.productName}</td>
                      <td className="py-2 pr-4 text-slate-700">{line.quantity}</td>
                      <td className="py-2 pr-4 text-slate-700">{formatCurrency(line.unitPrice)}</td>
                      <td className="py-2 pr-4 text-slate-700">{line.taxRate}%</td>
                      <td className="py-2 text-right font-medium text-slate-900">{formatCurrency(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 font-semibold">
                    <td colSpan={4} className="py-2 text-right text-slate-600">Total</td>
                    <td className="py-2 text-right text-slate-900">
                      {formatCurrency(selectedPr.lines.reduce((s, l) => s + l.total, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  )
}
