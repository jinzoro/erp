import { useState, useMemo } from 'react'
import { Table, type Column } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/status-badge'
import { KpiCard } from '@/components/kpi-card'
import { mockData } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { Plus, LogOut, CalendarDays } from 'lucide-react'

export function LeaveList() {
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const { leaveRequests } = mockData

  const filtered = useMemo(
    () =>
      leaveRequests.filter((l) => {
        if (statusFilter && l.status !== statusFilter) return false
        if (typeFilter && l.type !== typeFilter) return false
        return true
      }),
    [leaveRequests, statusFilter, typeFilter],
  )

  const pendingCount = leaveRequests.filter((l) => l.status === 'pending').length
  const approvedCount = leaveRequests.filter((l) => l.status === 'approved').length
  const totalDays = leaveRequests.reduce((s, l) => s + l.days, 0)

  const leaveBalance = {
    annual: { total: 20, used: 8, remaining: 12 },
    sick: { total: 10, used: 2, remaining: 8 },
    personal: { total: 5, used: 1, remaining: 4 },
  }

  const columns: Column<typeof leaveRequests[0]>[] = [
    { key: 'employeeName', header: 'Employee' },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <Badge variant="info" size="sm">
          {item.type}
        </Badge>
      ),
    },
    { key: 'fromDate', header: 'From', render: (item) => formatDate(item.fromDate) },
    { key: 'toDate', header: 'To', render: (item) => formatDate(item.toDate) },
    { key: 'days', header: 'Days', render: (item) => <span className="font-medium">{item.days}</span> },
    { key: 'reason', header: 'Reason', render: (item) => <span className="text-sm text-slate-500">{item.reason}</span> },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} type="document" /> },
    { key: 'approvedBy', header: 'Approved By', render: (item) => {
      if (!item.approvedBy) return <span className="text-sm text-slate-400">-</span>
      const approver = mockData.employees.find((e) => e.id === item.approvedBy)
      return approver ? `${approver.firstName} ${approver.lastName}` : item.approvedBy
    }},
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Total Requests" value={leaveRequests.length} icon={<LogOut className="h-5 w-5" />} />
        <KpiCard label="Pending" value={pendingCount} icon={<CalendarDays className="h-5 w-5" />} />
        <KpiCard label="Approved" value={approvedCount} icon={<CalendarDays className="h-5 w-5" />} />
      </div>

      <Card variant="glass" padding="md">
        <p className="mb-3 text-sm font-semibold text-slate-900">Leave Balance</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.entries(leaveBalance).map(([type, balance]) => (
            <div key={type} className="rounded-lg border border-slate-200 bg-white/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{type}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{balance.remaining}</span>
                <span className="text-sm text-slate-500">/ {balance.total} days</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-primary-500"
                  style={{ width: `${(balance.used / balance.total) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">{balance.used} used</p>
            </div>
          ))}
        </div>
      </Card>

      <Card variant="glass" padding="none">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/60 px-5 py-4">
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36"
          />
          <Select
            options={[
              { value: '', label: 'All Types' },
              { value: 'annual', label: 'Annual' },
              { value: 'sick', label: 'Sick' },
              { value: 'personal', label: 'Personal' },
              { value: 'maternity', label: 'Maternity' },
              { value: 'paternity', label: 'Paternity' },
              { value: 'other', label: 'Other' },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-36"
          />
          <div className="ml-auto">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              New Leave Request
            </Button>
          </div>
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
