import { useState, useMemo } from 'react'
import { Table, type Column } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/status-badge'
import { KpiCard } from '@/components/kpi-card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { mockData } from '@/data/mockData'
import { Search, DollarSign, AlertTriangle, Calendar, CheckCircle } from 'lucide-react'
import type { Invoice, Customer } from '@/types/finance'

const today = '2026-05-17'

export function AccountsReceivable() {
  const [activeTab, setActiveTab] = useState('invoices')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const totalReceivables = useMemo(
    () => mockData.invoices.reduce((s, inv) => s + inv.balance, 0),
    [],
  )
  const overdue = useMemo(
    () =>
      mockData.invoices
        .filter((inv) => inv.dueDate < today && inv.balance > 0)
        .reduce((s, inv) => s + inv.balance, 0),
    [],
  )
  const dueThisMonth = useMemo(
    () =>
      mockData.invoices
        .filter((inv) => inv.dueDate >= '2026-05-01' && inv.dueDate <= '2026-05-31')
        .reduce((s, inv) => s + inv.balance, 0),
    [],
  )
  const collectedThisMonth = useMemo(
    () =>
      mockData.invoices
        .filter((inv) => inv.date >= '2026-05-01' && inv.date <= '2026-05-31')
        .reduce((s, inv) => s + inv.paid, 0),
    [],
  )

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
  ]
  const customerOptions = [
    { value: '', label: 'All Customers' },
    ...mockData.customers.map((c) => ({ value: c.id, label: c.name })),
  ]

  const filteredInvoices = useMemo(() => {
    let items = [...mockData.invoices]
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (inv) => inv.number.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q),
      )
    }
    if (statusFilter) items = items.filter((inv) => inv.status === statusFilter)
    if (customerFilter) items = items.filter((inv) => inv.customerId === customerFilter)
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [search, statusFilter, customerFilter])

  const paginatedInvoices = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredInvoices.slice(start, start + pageSize)
  }, [filteredInvoices, page])

  const invoiceColumns: Column<Invoice>[] = [
    { key: 'number', header: 'Number', width: '140px' },
    { key: 'customerName', header: 'Customer' },
    { key: 'date', header: 'Date', width: '110px', render: (inv) => formatDate(inv.date) },
    { key: 'dueDate', header: 'Due Date', width: '110px', render: (inv) => formatDate(inv.dueDate) },
    {
      key: 'amount',
      header: 'Amount',
      width: '120px',
      className: 'text-right font-medium',
      render: (inv) => formatCurrency(inv.amount),
    },
    {
      key: 'paid',
      header: 'Paid',
      width: '120px',
      className: 'text-right',
      render: (inv) => formatCurrency(inv.paid),
    },
    {
      key: 'balance',
      header: 'Balance',
      width: '120px',
      className: 'text-right font-medium',
      render: (inv) => (
        <span className={inv.balance > 0 ? 'text-red-600' : 'text-emerald-600'}>{formatCurrency(inv.balance)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (inv) => <StatusBadge status={inv.status} />,
    },
  ]

  const customerColumns: Column<Customer>[] = [
    { key: 'code', header: 'Code', width: '80px' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'paymentTerms', header: 'Payment Terms', width: '120px' },
    {
      key: 'balance',
      header: 'Balance',
      width: '120px',
      className: 'text-right font-medium',
      render: (c) => formatCurrency(c.balance),
    },
    {
      key: 'creditLimit',
      header: 'Credit Limit',
      width: '120px',
      className: 'text-right',
      render: (c) => formatCurrency(c.creditLimit),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Total Receivables"
          value={formatCurrency(totalReceivables)}
          icon={<DollarSign className="h-5 w-5" />}
          variant="glass"
        />
        <KpiCard
          label="Overdue"
          value={formatCurrency(overdue)}
          trend={overdue > 0 ? 'down' : 'neutral'}
          trendValue={overdue > 0 ? 'Needs collection' : 'None overdue'}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="glass"
        />
        <KpiCard
          label="Due This Month"
          value={formatCurrency(dueThisMonth)}
          icon={<Calendar className="h-5 w-5" />}
          variant="glass"
        />
        <KpiCard
          label="Collected This Month"
          value={formatCurrency(collectedThisMonth)}
          trend={collectedThisMonth > 0 ? 'up' : 'neutral'}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="glass"
        />
      </div>

      <Card variant="glass">
        <CardContent className="p-5">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setPage(1) }} variant="pills">
            <TabsList className="mb-4">
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Search invoices..."
                    leftIcon={<Search className="h-4 w-4" />}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  />
                </div>
                <div className="w-40">
                  <Select options={statusOptions} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} />
                </div>
                <div className="w-48">
                  <Select options={customerOptions} value={customerFilter} onChange={(e) => { setCustomerFilter(e.target.value); setPage(1) }} />
                </div>
              </div>
              <Table<Invoice>
                columns={invoiceColumns}
                data={paginatedInvoices}
                keyExtractor={(inv) => inv.id}
                page={page}
                pageSize={pageSize}
                total={filteredInvoices.length}
                onPageChange={setPage}
                emptyState={<div className="py-8 text-center text-sm text-slate-500">No invoices found</div>}
              />
            </TabsContent>

            <TabsContent value="payments">
              <div className="py-8 text-center text-sm text-slate-500">
                Payment tracking coming soon
              </div>
            </TabsContent>

            <TabsContent value="customers">
              <Table<Customer>
                columns={customerColumns}
                data={mockData.customers}
                keyExtractor={(c) => c.id}
                emptyState={<div className="py-8 text-center text-sm text-slate-500">No customers found</div>}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
