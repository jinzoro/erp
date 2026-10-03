import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, type Column } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, type SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/kpi-card'
import { StatusBadge } from '@/components/status-badge'
import { mockData } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { Search, Plus, Package, DollarSign, AlertTriangle } from 'lucide-react'

export function ItemList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { products, stockLevels } = mockData

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.categoryName))
    return [{ value: '', label: 'All Categories' }, ...Array.from(set).map((c) => ({ value: c, label: c }))]
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.code.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter && p.categoryName !== categoryFilter) return false
      if (statusFilter === 'active' && !p.isActive) return false
      if (statusFilter === 'inactive' && p.isActive) return false
      return true
    })
  }, [products, search, categoryFilter, statusFilter])

  const getStockQty = (productId: string) =>
    stockLevels.filter((sl) => sl.productId === productId).reduce((sum, sl) => sum + sl.quantity, 0)

  const getReorderPoint = (productId: string) => {
    const sl = stockLevels.find((sl) => sl.productId === productId)
    return sl?.reorderPoint ?? 0
  }

  const totalItems = products.length
  const activeItems = products.filter((p) => p.isActive).length
  const lowStockItems = products.filter((p) => {
    const qty = getStockQty(p.id)
    const rp = getReorderPoint(p.id)
    return rp > 0 && qty <= rp
  }).length
  const totalValue = products.reduce((sum, p) => sum + getStockQty(p.id) * p.cost, 0)

  const columns: Column<typeof products[0]>[] = [
    { key: 'code', header: 'Code', render: (item) => <span className="font-mono text-xs text-slate-500">{item.code}</span> },
    { key: 'name', header: 'Name', render: (item) => <span className="font-medium text-slate-900">{item.name}</span> },
    { key: 'categoryName', header: 'Category' },
    { key: 'unit', header: 'Unit' },
    {
      key: 'price',
      header: 'Price',
      render: (item) => formatCurrency(item.price),
    },
    {
      key: 'cost',
      header: 'Cost',
      render: (item) => formatCurrency(item.cost),
    },
    {
      key: 'stockQty',
      header: 'Stock Qty',
      render: (item) => {
        const qty = getStockQty(item.id)
        const rp = getReorderPoint(item.id)
        const isLow = rp > 0 && qty <= rp
        return (
          <span className={isLow ? 'font-semibold text-red-600' : ''}>
            {qty}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.isActive ? 'active' : 'inactive'} type="employee" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Items" value={totalItems} icon={<Package className="h-5 w-5" />} />
        <KpiCard label="Active Items" value={activeItems} icon={<Package className="h-5 w-5" />} />
        <KpiCard
          label="Low Stock Items"
          value={lowStockItems}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant={lowStockItems > 0 ? 'glass' : 'default'}
        />
        <KpiCard label="Total Inventory Value" value={formatCurrency(totalValue)} icon={<DollarSign className="h-5 w-5" />} />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/60 px-5 py-4">
          <Input
            placeholder="Search items..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select
            options={categories}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-44"
          />
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36"
          />
          <div className="ml-auto">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              New Item
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => navigate(`/inventory/items/${item.id}`)}
        />
      </Card>
    </div>
  )
}
