import { useState, useMemo } from 'react'
import { Table, type Column } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/kpi-card'
import { mockData } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Search, ArrowRightLeft, ArrowDown, ArrowUp, ArrowLeftRight, RotateCcw, SlidersHorizontal } from 'lucide-react'

const typeConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'info' | 'warning' | 'primary'; icon: React.ReactNode }> = {
  receipt: { label: 'Receipt', variant: 'success', icon: <ArrowDown className="h-3.5 w-3.5" /> },
  issue: { label: 'Issue', variant: 'danger', icon: <ArrowUp className="h-3.5 w-3.5" /> },
  transfer: { label: 'Transfer', variant: 'info', icon: <ArrowLeftRight className="h-3.5 w-3.5" /> },
  adjustment: { label: 'Adjustment', variant: 'warning', icon: <SlidersHorizontal className="h-3.5 w-3.5" /> },
  return: { label: 'Return', variant: 'primary', icon: <RotateCcw className="h-3.5 w-3.5" /> },
}

export function StockMovementList() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('')

  const { stockMovements, warehouses } = mockData

  const warehouseOptions = useMemo(
    () => [{ value: '', label: 'All Warehouses' }, ...warehouses.map((w) => ({ value: w.id, label: w.name }))],
    [warehouses],
  )

  const filtered = useMemo(
    () =>
      stockMovements.filter((sm) => {
        if (search && !sm.productName.toLowerCase().includes(search.toLowerCase()) && !sm.reference.toLowerCase().includes(search.toLowerCase()))
          return false
        if (typeFilter && sm.type !== typeFilter) return false
        if (warehouseFilter && sm.warehouseId !== warehouseFilter) return false
        return true
      }),
    [stockMovements, search, typeFilter, warehouseFilter],
  )

  const totalMovements = stockMovements.length
  const totalReceipts = stockMovements.filter((sm) => sm.type === 'receipt').length
  const totalIssues = stockMovements.filter((sm) => sm.type === 'issue').length

  const columns: Column<typeof stockMovements[0]>[] = [
    { key: 'date', header: 'Date', render: (item) => <span className="text-sm">{formatDate(item.date)}</span> },
    {
      key: 'type',
      header: 'Type',
      render: (item) => {
        const config = typeConfig[item.type]
        return (
          <Badge variant={config.variant} icon={config.icon}>
            {config.label}
          </Badge>
        )
      },
    },
    { key: 'productName', header: 'Product' },
    { key: 'warehouseName', header: 'Warehouse' },
    {
      key: 'quantity',
      header: 'Qty',
      render: (item) => (
        <span className={`font-medium ${item.quantity < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          {item.quantity > 0 ? '+' : ''}{item.quantity}
        </span>
      ),
    },
    { key: 'unitCost', header: 'Unit Cost', render: (item) => formatCurrency(item.unitCost) },
    { key: 'totalCost', header: 'Total', render: (item) => <span className="font-medium">{formatCurrency(Math.abs(item.totalCost))}</span> },
    { key: 'reference', header: 'Reference', render: (item) => <span className="font-mono text-xs text-slate-500">{item.reference}</span> },
    { key: 'notes', header: 'Notes', render: (item) => <span className="text-sm text-slate-500">{item.notes}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Total Movements" value={totalMovements} icon={<ArrowRightLeft className="h-5 w-5" />} />
        <KpiCard label="Receipts" value={totalReceipts} icon={<ArrowDown className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Issues" value={totalIssues} icon={<ArrowUp className="h-5 w-5" />} variant="glass" />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/60 px-5 py-4">
          <Input
            placeholder="Search product or reference..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select
            options={[
              { value: '', label: 'All Types' },
              { value: 'receipt', label: 'Receipt' },
              { value: 'issue', label: 'Issue' },
              { value: 'transfer', label: 'Transfer' },
              { value: 'adjustment', label: 'Adjustment' },
              { value: 'return', label: 'Return' },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-36"
          />
          <Select
            options={warehouseOptions}
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="w-44"
          />
        </div>
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
        />
      </Card>
    </div>
  )
}
