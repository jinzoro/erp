import { useMemo } from 'react'
import { Table, type Column } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { KpiCard } from '@/components/kpi-card'
import { mockData } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { Plus, Truck } from 'lucide-react'

export function TransferList() {
  const transfers = useMemo(
    () => mockData.stockMovements.filter((sm) => sm.type === 'transfer'),
    [],
  )

  const uniqueTransfers = useMemo(() => {
    const map = new Map<string, typeof transfers[0][]>()
    transfers.forEach((t) => {
      const key = t.reference
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    })
    return Array.from(map.entries()).map(([ref, movements]) => ({
      id: ref,
      number: ref,
      fromWarehouse: movements.find((m) => m.quantity < 0)?.warehouseName ?? '',
      toWarehouse: movements.find((m) => m.quantity > 0)?.warehouseName ?? '',
      status: 'completed' as const,
      date: movements[0]?.date ?? '',
    }))
  }, [transfers])

  const columns: Column<typeof uniqueTransfers[0]>[] = [
    { key: 'number', header: 'Number', render: (item) => <span className="font-mono text-xs font-medium text-primary-600">{item.number}</span> },
    { key: 'fromWarehouse', header: 'From Warehouse' },
    { key: 'toWarehouse', header: 'To Warehouse' },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} type="document" /> },
    { key: 'date', header: 'Date', render: (item) => formatDate(item.date) },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard label="Total Transfers" value={uniqueTransfers.length} icon={<Truck className="h-5 w-5" />} />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex items-center justify-between border-b border-slate-200/60 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Stock Transfers</h3>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            New Transfer
          </Button>
        </div>
        <Table
          columns={columns}
          data={uniqueTransfers}
          keyExtractor={(item) => item.id}
        />
      </Card>
    </div>
  )
}
