import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Table, type Column } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { mockData } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Barcode, Package, DollarSign, Hash } from 'lucide-react'

export function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = mockData.products.find((p) => p.id === id)
  const stockLevelsForProduct = mockData.stockLevels.filter((sl) => sl.productId === id)
  const movements = mockData.stockMovements.filter((sm) => sm.productId === id)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-slate-600">Product not found</p>
        <Button variant="ghost" onClick={() => navigate('/inventory/items')} className="mt-4">
          Back to Items
        </Button>
      </div>
    )
  }

  const totalStock = stockLevelsForProduct.reduce((s, sl) => s + sl.quantity, 0)
  const totalValue = totalStock * product.cost

  const stockColumns: Column<typeof stockLevelsForProduct[0]>[] = [
    { key: 'warehouseName', header: 'Warehouse' },
    { key: 'quantity', header: 'Quantity', render: (item) => <span className="font-medium">{item.quantity}</span> },
    { key: 'reserved', header: 'Reserved' },
    { key: 'available', header: 'Available', render: (item) => <span className="font-semibold text-emerald-600">{item.available}</span> },
    { key: 'reorderPoint', header: 'Reorder Point' },
  ]

  const movementColumns: Column<typeof movements[0]>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (item) => formatDate(item.date),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => {
        const colors: Record<string, 'success' | 'danger' | 'info' | 'warning' | 'primary'> = {
          receipt: 'success',
          issue: 'danger',
          transfer: 'info',
          adjustment: 'warning',
          return: 'primary',
        }
        return <Badge variant={colors[item.type] || 'default'}>{item.type}</Badge>
      },
    },
    { key: 'warehouseName', header: 'Warehouse' },
    {
      key: 'quantity',
      header: 'Qty',
      render: (item) => (
        <span className={item.quantity < 0 ? 'text-red-600' : 'text-emerald-600'}>
          {item.quantity > 0 ? '+' : ''}{item.quantity}
        </span>
      ),
    },
    { key: 'reference', header: 'Reference' },
    { key: 'notes', header: 'Notes' },
  ]

  return (
    <div className="space-y-6">
      <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/inventory/items')}>
        Back to Items
      </Button>

      <Card variant="glass">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <Package className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{product.name}</h1>
                  <p className="mt-0.5 text-sm text-slate-500">{product.code} · {product.sku}</p>
                </div>
              </div>
            </div>
            <StatusBadge status={product.isActive ? 'active' : 'inactive'} type="employee" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Category</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{product.categoryName}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Unit</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{product.unit}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Description</p>
                <p className="mt-1 text-sm text-slate-600">{product.description}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Price</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(product.price)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Cost</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(product.cost)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Margin</p>
                <p className="mt-1 text-lg font-bold text-emerald-600">
                  {((product.price - product.cost) / product.price * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Stock</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{totalStock} {product.unit}(s)</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Value</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(totalValue)}</p>
              </div>
              {product.barcode && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Barcode</p>
                  <div className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2">
                    <Barcode className="h-5 w-5 text-slate-400" />
                    <span className="font-mono text-sm text-slate-700">{product.barcode}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>
        <TabsContent value="stock">
          <Card variant="glass" padding="none">
            <Table
              columns={stockColumns}
              data={stockLevelsForProduct}
              keyExtractor={(item) => `${item.productId}-${item.warehouseId}`}
            />
          </Card>
        </TabsContent>
        <TabsContent value="movements">
          <Card variant="glass" padding="none">
            <Table
              columns={movementColumns}
              data={movements}
              keyExtractor={(item) => item.id}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
