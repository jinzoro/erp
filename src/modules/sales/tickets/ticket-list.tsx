import { useState, useMemo } from 'react'
import { Search, Plus, LifeBuoy, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'
import { Table, type Column } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { mockData } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import type { Ticket } from '@/types/sales'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const priorityConfig: Record<string, { variant: 'danger' | 'warning' | 'info' | 'primary' | 'default'; className?: string; icon: typeof AlertCircle }> = {
  urgent: { variant: 'danger', icon: AlertCircle },
  high: { variant: 'warning', icon: AlertCircle, className: '!bg-orange-100 !text-orange-700' },
  medium: { variant: 'warning', icon: Clock },
  low: { variant: 'info', icon: Clock },
}

function PriorityBadge({ priority }: { priority: string }) {
  const cfg = priorityConfig[priority]
  if (!cfg) return <Badge variant="default" size="sm">{priority}</Badge>
  const Icon = cfg.icon
  return (
    <Badge variant={cfg.variant} size="sm" icon={<Icon className="h-3 w-3" />} className={cfg.className}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

const userMap: Record<string, string> = {}
for (const u of mockData.users) {
  userMap[u.id] = u.name
}

export function TicketList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const tickets = useMemo(() => {
    let data = mockData.supportTickets
    const q = search.toLowerCase()
    if (q) {
      data = data.filter(
        (t) =>
          t.number.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q),
      )
    }
    if (statusFilter) data = data.filter((t) => t.status === statusFilter)
    if (priorityFilter) data = data.filter((t) => t.priority === priorityFilter)
    return data
  }, [search, statusFilter, priorityFilter])

  const columns: Column<Ticket>[] = [
    {
      key: 'number',
      header: 'Ticket',
      render: (t) => <span className="font-medium text-primary-700">{t.number}</span>,
    },
    { key: 'customerName', header: 'Customer' },
    {
      key: 'subject',
      header: 'Subject',
      render: (t) => (
        <span className="max-w-xs truncate font-medium text-slate-900">{t.subject}</span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (t) => <PriorityBadge priority={t.priority} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} type="ticket" />,
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (t) => <span className="text-slate-600">{userMap[t.assignedTo] || t.assignedTo}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (t) => <span className="text-slate-500 text-xs">{formatDate(t.createdAt)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          New Ticket
        </Button>
      </div>

      <Card variant="glass" padding="none">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Input
            placeholder="Search tickets..."
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
          <Select
            options={priorityOptions}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-40"
          />
        </div>
        <Table
          columns={columns}
          data={tickets}
          keyExtractor={(t) => t.id}
          onRowClick={(t) => console.log('Ticket clicked', t.id)}
        />
      </Card>
    </div>
  )
}
