import { useState, useMemo } from 'react'
import { Search, Plus, CheckCircle2, XCircle } from 'lucide-react'
import { Table, type Column } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/status-badge'
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal'
import { mockData } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import type { GoodsReceipt, GoodsReceiptLine } from '@/types/procurement'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function GoodsReceiptList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedGr, setSelectedGr] = useState<GoodsReceipt | null>(null)

  const receipts = useMemo(() => {
    let data = mockData.goodsReceipts
    const q = search.toLowerCase()
    if (q) {
      data = data.filter(
        (gr) =>
          gr.number.toLowerCase().includes(q) ||
          gr.purchaseOrderNumber.toLowerCase().includes(q),
      )
    }
    if (statusFilter) data = data.filter((gr) => gr.status === statusFilter)
    return data
  }, [search, statusFilter])

  const columns: Column<GoodsReceipt>[] = [
    {
      key: 'number',
      header: 'Receipt No.',
      render: (gr) => <span className="font-medium text-primary-700">{gr.number}</span>,
    },
    {
      key: 'purchaseOrderNumber',
      header: 'PO Number',
      render: (gr) => <span className="font-medium text-slate-900">{gr.purchaseOrderNumber}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      render: (gr) => <span className="text-slate-600">{formatDate(gr.date)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (gr) => <StatusBadge status={gr.status} type="document" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Goods Receipt</h1>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          New Receipt
        </Button>
      </div>

      <Card variant="glass" padding="none">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Input
            placeholder="Search receipts..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          />
        </div>
        <Table
          columns={columns}
          data={receipts}
          keyExtractor={(gr) => gr.id}
          onRowClick={(gr) => setSelectedGr(gr)}
        />
      </Card>

      <Modal open={!!selectedGr} onClose={() => setSelectedGr(null)} size="lg">
        {selectedGr && (
          <>
            <ModalHeader onClose={() => setSelectedGr(null)}>
              {selectedGr.number}
            </ModalHeader>
            <ModalBody>
              <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">PO Number:</span>
                  <p className="font-medium text-slate-900">{selectedGr.purchaseOrderNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Date:</span>
                  <p className="font-medium text-slate-900">{formatDate(selectedGr.date)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedGr.status} type="document" />
                  </div>
                </div>
              </div>
              <h4 className="mb-3 text-sm font-semibold text-slate-900">Receipt Lines</h4>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Ordered</th>
                    <th className="py-2 pr-4">Received</th>
                    <th className="py-2 pr-4">Accepted</th>
                    <th className="py-2 text-right">Rejected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedGr.lines.map((line: GoodsReceiptLine, i: number) => (
                    <tr key={`${line.productId}-${i}`}>
                      <td className="py-2 pr-4 font-medium text-slate-900">{line.productName}</td>
                      <td className="py-2 pr-4 text-slate-700">{line.orderQuantity}</td>
                      <td className="py-2 pr-4 text-slate-700">{line.receivedQuantity}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {line.acceptedQuantity}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        {line.rejectedQuantity > 0 ? (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <XCircle className="h-3.5 w-3.5" />
                            {line.rejectedQuantity}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  )
}
