import { useState, useMemo } from 'react'
import { Search, ShoppingCart, FileText, CheckCircle2, Package, FileSpreadsheet } from 'lucide-react'
import { Table, type Column } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { KpiCard } from '@/components/kpi-card'
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal'
import { mockData } from '@/data/mockData'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { SalesOrder, SalesLine } from '@/types/sales'

export function SalesOrderList() {
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null)

  const orders = useMemo(() => {
    if (!search) return mockData.salesOrders
    const q = search.toLowerCase()
    return mockData.salesOrders.filter(
      (so) =>
        so.number.toLowerCase().includes(q) ||
        so.customerName.toLowerCase().includes(q),
    )
  }, [search])

  const totalOrders = mockData.salesOrders.length
  const draftCount = mockData.salesOrders.filter((so) => so.status === 'draft').length
  const confirmedCount = mockData.salesOrders.filter((so) => so.status === 'approved').length
  const deliveredCount = mockData.salesOrders.filter((so) => so.status === 'completed').length
  const invoicedCount = mockData.salesOrders.filter((so) => so.status === 'pending').length

  const columns: Column<SalesOrder>[] = [
    {
      key: 'number',
      header: 'Number',
      render: (so) => <span className="font-medium text-primary-700">{so.number}</span>,
    },
    { key: 'customerName', header: 'Customer' },
    {
      key: 'date',
      header: 'Date',
      render: (so) => <span className="text-slate-600">{formatDate(so.date)}</span>,
    },
    {
      key: 'deliveryDate',
      header: 'Delivery Date',
      render: (so) => <span className="text-slate-600">{formatDate(so.deliveryDate)}</span>,
    },
    {
      key: 'total',
      header: 'Total',
      render: (so) => <span className="font-medium text-slate-900">{formatCurrency(so.total)}</span>,
    },
    {
      key: 'paid',
      header: 'Paid',
      render: (so) => (
        <span className={cn('font-medium', so.paid > 0 ? 'text-emerald-600' : 'text-slate-400')}>
          {formatCurrency(so.paid)}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (so) => (
        <span className={cn('font-medium', so.balance > 0 ? 'text-red-600' : 'text-slate-900')}>
          {formatCurrency(so.balance)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (so) => <StatusBadge status={so.status} type="document" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Sales Orders</h1>
        <Button variant="primary" leftIcon={<ShoppingCart className="h-4 w-4" />}>
          New Sales Order
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <KpiCard label="Total Orders" value={totalOrders} icon={<ShoppingCart className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Draft" value={draftCount} icon={<FileText className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Confirmed" value={confirmedCount} icon={<CheckCircle2 className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Delivered" value={deliveredCount} icon={<Package className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Invoiced" value={invoicedCount} icon={<FileSpreadsheet className="h-5 w-5" />} variant="glass" />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Input
            placeholder="Search orders..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <Table
          columns={columns}
          data={orders}
          keyExtractor={(so) => so.id}
          onRowClick={(so) => setSelectedOrder(so)}
        />
      </Card>

      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} size="lg">
        {selectedOrder && (
          <>
            <ModalHeader onClose={() => setSelectedOrder(null)}>
              {selectedOrder.number} — {selectedOrder.customerName}
            </ModalHeader>
            <ModalBody>
              <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Date:</span>
                  <p className="font-medium text-slate-900">{formatDate(selectedOrder.date)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Delivery Date:</span>
                  <p className="font-medium text-slate-900">{formatDate(selectedOrder.deliveryDate)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedOrder.status} type="document" />
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Subtotal:</span>
                  <p className="font-medium text-slate-900">{formatCurrency(selectedOrder.subtotal)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Tax:</span>
                  <p className="font-medium text-slate-900">{formatCurrency(selectedOrder.taxTotal)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Total:</span>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(selectedOrder.total)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Paid:</span>
                  <p className="font-medium text-emerald-600">{formatCurrency(selectedOrder.paid)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Balance:</span>
                  <p className="font-medium text-red-600">{formatCurrency(selectedOrder.balance)}</p>
                </div>
              </div>
              <h4 className="mb-3 text-sm font-semibold text-slate-900">Order Lines</h4>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Delivered</th>
                    <th className="py-2 pr-4">Unit Price</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.lines.map((line: SalesLine) => (
                    <tr key={line.id}>
                      <td className="py-2 pr-4 font-medium text-slate-900">{line.productName}</td>
                      <td className="py-2 pr-4 text-slate-700">{line.quantity}</td>
                      <td className="py-2 pr-4 text-slate-700">{line.delivered}</td>
                      <td className="py-2 pr-4 text-slate-700">{formatCurrency(line.unitPrice)}</td>
                      <td className="py-2 text-right font-medium text-slate-900">{formatCurrency(line.total)}</td>
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
