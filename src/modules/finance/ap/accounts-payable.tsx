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
import type { Bill, Vendor } from '@/types/finance'

const today = '2026-05-17'

export function AccountsPayable() {
  const [activeTab, setActiveTab] = useState('bills')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [vendorFilter, setVendorFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const totalPayables = useMemo(
    () => mockData.bills.reduce((s, b) => s + b.balance, 0),
    [],
  )
  const overdue = useMemo(
    () =>
      mockData.bills
        .filter((b) => b.dueDate < today && b.balance > 0)
        .reduce((s, b) => s + b.balance, 0),
    [],
  )
  const dueThisMonth = useMemo(
    () =>
      mockData.bills
        .filter((b) => b.dueDate >= '2026-05-01' && b.dueDate <= '2026-05-31')
        .reduce((s, b) => s + b.balance, 0),
    [],
  )
  const paidThisMonth = useMemo(
    () =>
      mockData.bills
        .filter((b) => b.date >= '2026-05-01' && b.date <= '2026-05-31')
        .reduce((s, b) => s + b.paid, 0),
    [],
  )

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
  ]
  const vendorOptions = [
    { value: '', label: 'All Vendors' },
    ...mockData.vendors.map((v) => ({ value: v.id, label: v.name })),
  ]

  const filteredBills = useMemo(() => {
    let items = [...mockData.bills]
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (b) => b.number.toLowerCase().includes(q) || b.vendorName.toLowerCase().includes(q),
      )
    }
    if (statusFilter) items = items.filter((b) => b.status === statusFilter)
    if (vendorFilter) items = items.filter((b) => b.vendorId === vendorFilter)
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [search, statusFilter, vendorFilter])

  const paginatedBills = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredBills.slice(start, start + pageSize)
  }, [filteredBills, page])

  const billColumns: Column<Bill>[] = [
    { key: 'number', header: 'Number', width: '140px' },
    { key: 'vendorName', header: 'Vendor' },
    { key: 'date', header: 'Date', width: '110px', render: (b) => formatDate(b.date) },
    { key: 'dueDate', header: 'Due Date', width: '110px', render: (b) => formatDate(b.dueDate) },
    {
      key: 'amount',
      header: 'Amount',
      width: '120px',
      className: 'text-right font-medium',
      render: (b) => formatCurrency(b.amount),
    },
    {
      key: 'paid',
      header: 'Paid',
      width: '120px',
      className: 'text-right',
      render: (b) => formatCurrency(b.paid),
    },
    {
      key: 'balance',
      header: 'Balance',
      width: '120px',
      className: 'text-right font-medium',
      render: (b) => (
        <span className={b.balance > 0 ? 'text-red-600' : 'text-emerald-600'}>{formatCurrency(b.balance)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (b) => <StatusBadge status={b.status} />,
    },
  ]

  const vendorColumns: Column<Vendor>[] = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Name' },
    { key: 'taxId', header: 'Tax ID' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'isActive',
      header: 'Status',
      render: (v) => <StatusBadge status={v.isActive ? 'active' : 'inactive'} type="document" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Total Payables"
          value={formatCurrency(totalPayables)}
          icon={<DollarSign className="h-5 w-5" />}
          variant="glass"
        />
        <KpiCard
          label="Overdue"
          value={formatCurrency(overdue)}
          trend={overdue > 0 ? 'down' : 'neutral'}
          trendValue={overdue > 0 ? 'Needs attention' : 'None overdue'}
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
          label="Paid This Month"
          value={formatCurrency(paidThisMonth)}
          trend={paidThisMonth > 0 ? 'up' : 'neutral'}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="glass"
        />
      </div>

      <Card variant="glass">
        <CardContent className="p-5">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setPage(1) }} variant="pills">
            <TabsList className="mb-4">
              <TabsTrigger value="bills">Bills</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
            </TabsList>

            <TabsContent value="bills">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Search bills..."
                    leftIcon={<Search className="h-4 w-4" />}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  />
                </div>
                <div className="w-40">
                  <Select options={statusOptions} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} />
                </div>
                <div className="w-48">
                  <Select options={vendorOptions} value={vendorFilter} onChange={(e) => { setVendorFilter(e.target.value); setPage(1) }} />
                </div>
              </div>
              <Table<Bill>
                columns={billColumns}
                data={paginatedBills}
                keyExtractor={(b) => b.id}
                page={page}
                pageSize={pageSize}
                total={filteredBills.length}
                onPageChange={setPage}
                emptyState={<div className="py-8 text-center text-sm text-slate-500">No bills found</div>}
              />
            </TabsContent>

            <TabsContent value="payments">
              <div className="py-8 text-center text-sm text-slate-500">
                Payment management coming soon
              </div>
            </TabsContent>

            <TabsContent value="vendors">
              <Table<Vendor>
                columns={vendorColumns}
                data={mockData.vendors}
                keyExtractor={(v) => v.id}
                emptyState={<div className="py-8 text-center text-sm text-slate-500">No vendors found</div>}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
