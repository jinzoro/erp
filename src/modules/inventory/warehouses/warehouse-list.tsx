import { useState } from 'react'
import { Table, type Column } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/status-badge'
import { KpiCard } from '@/components/kpi-card'
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal'
import { mockData } from '@/data/mockData'
import { Search, Warehouse } from 'lucide-react'

export function WarehouseList() {
  const [search, setSearch] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState<typeof mockData.warehouses[0] | null>(null)

  const { warehouses, stockLevels } = mockData

  const filtered = warehouses.filter((w) =>
    !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.code.toLowerCase().includes(search.toLowerCase()),
  )

  const warehouseStock = selectedWarehouse
    ? stockLevels.filter((sl) => sl.warehouseId === selectedWarehouse.id)
    : []

  const stockColumns: Column<typeof warehouseStock[0]>[] = [
    { key: 'productName', header: 'Product' },
    { key: 'productCode', header: 'Code', render: (item) => <span className="font-mono text-xs text-slate-500">{item.productCode}</span> },
    { key: 'quantity', header: 'Quantity', render: (item) => <span className="font-medium">{item.quantity}</span> },
    { key: 'reserved', header: 'Reserved' },
    { key: 'available', header: 'Available', render: (item) => <span className="font-semibold text-emerald-600">{item.available}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const isLow = item.quantity <= item.reorderPoint
        return isLow ? <Badge variant="warning" size="sm">Low Stock</Badge> : <Badge variant="success" size="sm">In Stock</Badge>
      },
    },
  ]

  const columns: Column<typeof warehouses[0]>[] = [
    { key: 'code', header: 'Code', render: (item) => <span className="font-mono text-xs font-medium text-primary-600">{item.code}</span> },
    { key: 'name', header: 'Name' },
    { key: 'address', header: 'Address', render: (item) => <span className="text-sm text-slate-500">{item.address}</span> },
    { key: 'branchId', header: 'Branch', render: (item) => {
      const branch = mockData.branches.find((b) => b.id === item.branchId)
      return branch?.name ?? item.branchId
    }},
    { key: 'isActive', header: 'Status', render: (item) => <StatusBadge status={item.isActive ? 'active' : 'inactive'} type="employee" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Total Warehouses" value={warehouses.length} icon={<Warehouse className="h-5 w-5" />} />
        <KpiCard label="Active Warehouses" value={warehouses.filter((w) => w.isActive).length} icon={<Warehouse className="h-5 w-5" />} />
        <KpiCard label="Total Stock Items" value={stockLevels.length} icon={<Warehouse className="h-5 w-5" />} />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex items-center gap-3 border-b border-slate-200/60 px-5 py-4">
          <Input
            placeholder="Search warehouses..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => setSelectedWarehouse(item)}
        />
      </Card>

      <Modal open={!!selectedWarehouse} onClose={() => setSelectedWarehouse(null)} size="lg">
        <ModalHeader onClose={() => setSelectedWarehouse(null)}>
          Stock Levels - {selectedWarehouse?.name}
        </ModalHeader>
        <ModalBody>
          {selectedWarehouse && (
            <Table
              columns={stockColumns}
              data={warehouseStock}
              keyExtractor={(item) => `${item.productId}-${item.warehouseId}`}
            />
          )}
        </ModalBody>
      </Modal>
    </div>
  )
}
