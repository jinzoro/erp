import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Building2, Users, Wallet, Mail, Phone, MoreHorizontal } from 'lucide-react'
import { Table, type Column } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { KpiCard } from '@/components/kpi-card'
import { mockData } from '@/data/mockData'
import { formatCurrency, cn } from '@/lib/utils'
import type { Vendor } from '@/types/procurement'

const userMap: Record<string, string> = {}
for (const u of mockData.users) {
  userMap[u.id] = u.name
}

export function VendorList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const vendors = useMemo(() => {
    if (!search) return mockData.vendors
    const q = search.toLowerCase()
    return mockData.vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.taxId.toLowerCase().includes(q),
    )
  }, [search])

  const totalVendors = mockData.vendors.length
  const activeVendors = mockData.vendors.filter((v) => v.isActive).length
  const totalBalance = mockData.vendors.reduce((sum, v) => sum + v.balance, 0)

  const columns: Column<Vendor>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (v) => <span className="font-medium text-slate-900">{v.code}</span>,
    },
    { key: 'name', header: 'Name' },
    { key: 'taxId', header: 'Tax ID' },
    {
      key: 'email',
      header: 'Email',
      render: (v) => (
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <Mail className="h-3.5 w-3.5 text-slate-400" />
          {v.email}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (v) => (
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <Phone className="h-3.5 w-3.5 text-slate-400" />
          {v.phone}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (v) => (
        <Badge variant={v.isActive ? 'success' : 'default'} size="sm" dot>
          {v.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (v) => (
        <span className={cn('font-medium', v.balance > 0 ? 'text-red-600' : 'text-slate-900')}>
          {formatCurrency(v.balance)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
      width: '48px',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          New Vendor
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Total Vendors" value={totalVendors} icon={<Building2 className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Active Vendors" value={activeVendors} icon={<Users className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Total AP Balance" value={formatCurrency(totalBalance)} icon={<Wallet className="h-5 w-5" />} variant="glass" />
      </div>

      <Card variant="glass" padding="none">
        <div className="border-b border-slate-100 px-5 py-4">
          <Input
            placeholder="Search vendors..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Table
          columns={columns}
          data={vendors}
          keyExtractor={(v) => v.id}
          onRowClick={(v) => navigate(`/procurement/vendors/${v.id}`)}
        />
      </Card>
    </div>
  )
}
