import { useState, useMemo } from 'react'
import { Search, Plus, Filter } from 'lucide-react'
import { Table, type Column } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { mockData } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Opportunity } from '@/types/sales'

const stageOptions = [
  { value: '', label: 'All Stages' },
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed-won', label: 'Closed Won' },
  { value: 'closed-lost', label: 'Closed Lost' },
]

const stageBadgeMap: Record<string, { variant: 'info' | 'warning' | 'success' | 'danger' | 'primary' | 'default'; label: string }> = {
  prospecting: { variant: 'default', label: 'Prospecting' },
  qualification: { variant: 'info', label: 'Qualification' },
  proposal: { variant: 'warning', label: 'Proposal' },
  negotiation: { variant: 'primary', label: 'Negotiation' },
  'closed-won': { variant: 'success', label: 'Won' },
  'closed-lost': { variant: 'danger', label: 'Lost' },
}

function StageBadge({ stage }: { stage: string }) {
  const cfg = stageBadgeMap[stage]
  if (!cfg) return <Badge variant="default" size="sm">{stage}</Badge>
  return <Badge variant={cfg.variant} size="sm" dot>{cfg.label}</Badge>
}

const userMap: Record<string, string> = {}
for (const u of mockData.users) {
  userMap[u.id] = u.name
}

export function OpportunityList() {
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  const opportunities = useMemo(() => {
    let data = mockData.opportunities
    const q = search.toLowerCase()
    if (q) {
      data = data.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q),
      )
    }
    if (stageFilter) data = data.filter((o) => o.stage === stageFilter)
    return data
  }, [search, stageFilter])

  const columns: Column<Opportunity>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (o) => <span className="font-medium text-slate-900">{o.title}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (o) => <span className="text-slate-700">{o.customerName}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (o) => <span className="font-medium text-slate-900">{formatCurrency(o.amount)}</span>,
    },
    {
      key: 'probability',
      header: 'Probability',
      render: (o) => (
        <span className="inline-flex items-center gap-2">
          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-primary-500 transition-all"
              style={{ width: `${o.probability}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600">{o.probability}%</span>
        </span>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (o) => <StageBadge stage={o.stage} />,
    },
    {
      key: 'expectedCloseDate',
      header: 'Expected Close',
      render: (o) => <span className="text-slate-600 text-xs">{formatDate(o.expectedCloseDate)}</span>,
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (o) => <span className="text-slate-600">{userMap[o.assignedTo] || o.assignedTo}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          New Opportunity
        </Button>
      </div>

      <Card variant="glass" padding="none">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Input
            placeholder="Search opportunities..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select
            options={stageOptions}
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-44"
          />
        </div>
        <Table
          columns={columns}
          data={opportunities}
          keyExtractor={(o) => o.id}
          onRowClick={(o) => console.log('Opportunity clicked', o.id)}
        />
      </Card>
    </div>
  )
}
