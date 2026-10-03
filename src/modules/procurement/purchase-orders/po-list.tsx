import { useState, useMemo } from 'react'
import { Search, Plus, ShoppingCart, CheckCircle2, FileCheck, Package } from 'lucide-react'
import { Table, type Column } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { KpiCard } from '@/components/kpi-card'
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal'
import { mockData } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { PurchaseOrder, PurchaseLine } from '@/types/procurement'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function PurchaseOrderList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [vendorFilter, setVendorFilter] = useState('')
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null)

  const vendorOptions = useMemo(
    () => [
      { value: '', label: 'All Vendors' },
      ...Array.from(new Set(mockData.purchaseOrders.map((po) => po.vendorName))).map((name) => ({
        value: name,
        label: name,
      })),
    ],
    [],
  )

  const orders = useMemo(() => {
    let data = mockData.purchaseOrders
    const q = search.toLowerCase()
    if (q) {
      data = data.filter(
        (po) =>
          po.number.toLowerCase().includes(q) ||
          po.vendorName.toLowerCase().includes(q),
      )
    }
    if (statusFilter) data = data.filter((po) => po.status === statusFilter)
    if (vendorFilter) data = data.filter((po) => po.vendorName === vendorFilter)
    return data
  }, [search, statusFilter, vendorFilter])

  const totalPos = mockData.purchaseOrders.length
  const pendingCount = mockData.purchaseOrders.filter((po) => po.status === 'pending').length
  const approvedCount = mockData.purchaseOrders.filter((po) => po.status === 'approved').length
  const receivedCount = mockData.purchaseOrders.filter((po) => po.status === 'completed').length

  const columns: Column<PurchaseOrder>[] = [
    {
      key: 'number',
      header: 'Number',
      render: (po) => <span className="font-medium text-primary-700">{po.number}</span>,
    },
    { key: 'vendorName', header: 'Vendor' },
    {
      key: 'date',
      header: 'Date',
      render: (po) => <span className="text-slate-600">{formatDate(po.date)}</span>,
    },
    {
      key: 'expectedDate',
      header: 'Expected Date',
      render: (po) => <span className="text-slate-600">{formatDate(po.expectedDate)}</span>,
    },
    {
      key: 'total',
      header: 'Total',
      render: (po) => <span className="font-medium text-slate-900">{formatCurrency(po.total)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (po) => <StatusBadge status={po.status} type="document" />,
    },
    {
      key: 'actions',
      header: '',
      render: (po) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm">View</Button>
        </div>
      ),
      width: '80px',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Purchase Orders</h1>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          New Purchase Order
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total POs" value={totalPos} icon={<ShoppingCart className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Pending Approval" value={pendingCount} icon={<FileCheck className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Approved" value={approvedCount} icon={<CheckCircle2 className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Received" value={receivedCount} icon={<Package className="h-5 w-5" />} variant="glass" />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Input
            placeholder="Search POs..."
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
          <Select
            options={vendorOptions}
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="w-48"
          />
        </div>
        <Table
          columns={columns}
          data={orders}
          keyExtractor={(po) => po.id}
          onRowClick={(po) => setSelectedPo(po)}
        />
      </Card>

      <Modal open={!!selectedPo} onClose={() => setSelectedPo(null)} size="lg">
        {selectedPo && (
          <>
            <ModalHeader onClose={() => setSelectedPo(null)}>
              {selectedPo.number} — {selectedPo.vendorName}
            </ModalHeader>
            <ModalBody>
              <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Date:</span>
                  <p className="font-medium text-slate-900">{formatDate(selectedPo.date)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Expected Date:</span>
                  <p className="font-medium text-slate-900">{formatDate(selectedPo.expectedDate)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedPo.status} type="document" />
                  </div>
                </div>
                {selectedPo.notes && (
                  <div className="col-span-3">
                    <span className="text-slate-500">Notes:</span>
                    <p className="font-medium text-slate-900">{selectedPo.notes}</p>
                  </div>
                )}
              </div>
              <h4 className="mb-3 text-sm font-semibold text-slate-900">Order Lines</h4>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Received</th>
                    <th className="py-2 pr-4">Unit Price</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedPo.lines.map((line: PurchaseLine) => (
                    <tr key={line.id}>
                      <td className="py-2 pr-4 font-medium text-slate-900">{line.productName}</td>
                      <td className="py-2 pr-4 text-slate-700">{line.quantity}</td>
                      <td className="py-2 pr-4 text-slate-700">{line.received}</td>
                      <td className="py-2 pr-4 text-slate-700">{formatCurrency(line.unitPrice)}</td>
                      <td className="py-2 text-right font-medium text-slate-900">{formatCurrency(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 font-semibold">
                    <td colSpan={4} className="py-2 text-right text-slate-600">Total</td>
                    <td className="py-2 text-right text-slate-900">{formatCurrency(selectedPo.total)}</td>
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
