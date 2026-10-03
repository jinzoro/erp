import { useState, useMemo } from 'react'
import { Search, Plus, Users, UserPlus, Target, TrendingUp } from 'lucide-react'
import { Table, type Column } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { KpiCard } from '@/components/kpi-card'
import { mockData } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import type { Lead } from '@/types/sales'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

const leadBadgeConfig: Record<string, { variant: 'info' | 'warning' | 'success' | 'danger' | 'primary' | 'default'; className?: string }> = {
  new: { variant: 'info' },
  contacted: { variant: 'warning' },
  qualified: { variant: 'success' },
  proposal: { variant: 'primary', className: '!bg-purple-100 !text-purple-700' },
  won: { variant: 'success' },
  lost: { variant: 'danger' },
}

function LeadStatusBadge({ status }: { status: string }) {
  const cfg = leadBadgeConfig[status]
  if (!cfg) return <Badge variant="default" size="sm">{status}</Badge>
  return (
    <Badge variant={cfg.variant} size="sm" dot className={cfg.className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

const userMap: Record<string, string> = {}
for (const u of mockData.users) {
  userMap[u.id] = u.name
}

export function LeadList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const leads = useMemo(() => {
    let data = mockData.leads
    const q = search.toLowerCase()
    if (q) {
      data = data.filter(
        (l) =>
          l.company.toLowerCase().includes(q) ||
          l.contactName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q),
      )
    }
    if (statusFilter) data = data.filter((l) => l.status === statusFilter)
    return data
  }, [search, statusFilter])

  const totalLeads = mockData.leads.length
  const newThisWeek = mockData.leads.filter((l) => {
    const created = new Date(l.createdAt)
    const weekAgo = new Date('2026-05-10')
    return created >= weekAgo
  }).length
  const qualified = mockData.leads.filter((l) => l.status === 'qualified' || l.status === 'proposal').length
  const won = mockData.leads.filter((l) => l.status === 'won').length
  const conversionRate = totalLeads > 0 ? ((won / totalLeads) * 100).toFixed(1) : '0.0'

  const columns: Column<Lead>[] = [
    {
      key: 'company',
      header: 'Company',
      render: (l) => <span className="font-medium text-slate-900">{l.company}</span>,
    },
    {
      key: 'contactName',
      header: 'Contact',
      render: (l) => <span className="text-slate-700">{l.contactName}</span>,
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'source', header: 'Source' },
    {
      key: 'status',
      header: 'Status',
      render: (l) => <LeadStatusBadge status={l.status} />,
    },
    {
      key: 'score',
      header: 'Score',
      render: (l) => (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span
            className={`h-2 w-2 rounded-full ${
              l.score >= 80 ? 'bg-emerald-500' : l.score >= 60 ? 'bg-amber-500' : 'bg-slate-400'
            }`}
          />
          {l.score}
        </span>
      ),
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (l) => <span className="text-slate-600">{userMap[l.assignedTo] || l.assignedTo}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (l) => <span className="text-slate-500 text-xs">{formatDate(l.createdAt)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline</h1>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          New Lead
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Leads" value={totalLeads} icon={<Users className="h-5 w-5" />} variant="glass" />
        <KpiCard label="New This Week" value={newThisWeek} icon={<UserPlus className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Qualified" value={qualified} icon={<Target className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} icon={<TrendingUp className="h-5 w-5" />} variant="glass" />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Input
            placeholder="Search leads..."
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
        </div>
        <Table
          columns={columns}
          data={leads}
          keyExtractor={(l) => l.id}
          onRowClick={(l) => console.log('Lead clicked', l.id)}
        />
      </Card>
    </div>
  )
}
