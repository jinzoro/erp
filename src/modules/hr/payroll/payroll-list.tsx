import { useState, useMemo } from 'react'
import { Table, type Column } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { KpiCard } from '@/components/kpi-card'
import { mockData } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { Wallet, DollarSign, Percent, Landmark, Play } from 'lucide-react'

export function PayrollList() {
  const [periodFilter, setPeriodFilter] = useState('2026-05')
  const [statusFilter, setStatusFilter] = useState('')

  const { payrollRecords } = mockData

  const periods = useMemo(
    () => [...new Set(payrollRecords.map((p) => p.period))].sort(),
    [],
  )

  const filtered = useMemo(
    () =>
      payrollRecords.filter((p) => {
        if (periodFilter && p.period !== periodFilter) return false
        if (statusFilter && p.status !== statusFilter) return false
        return true
      }),
    [payrollRecords, periodFilter, statusFilter],
  )

  const totalPayroll = filtered.reduce((s, p) => s + p.netPay, 0)
  const avgSalary = filtered.length > 0 ? totalPayroll / filtered.length : 0
  const totalTax = filtered.reduce((s, p) => s + p.tax, 0)
  const netPayTotal = filtered.reduce((s, p) => s + p.netPay, 0)

  const columns: Column<typeof payrollRecords[0]>[] = [
    { key: 'employeeName', header: 'Employee' },
    { key: 'period', header: 'Period' },
    { key: 'basicSalary', header: 'Basic', render: (item) => formatCurrency(item.basicSalary) },
    { key: 'allowances', header: 'Allowances', render: (item) => formatCurrency(item.allowances) },
    { key: 'deductions', header: 'Deductions', render: (item) => <span className="text-red-600">{formatCurrency(item.deductions)}</span> },
    { key: 'tax', header: 'Tax', render: (item) => formatCurrency(item.tax) },
    {
      key: 'netPay',
      header: 'Net Pay',
      render: (item) => <span className="font-semibold text-emerald-600">{formatCurrency(item.netPay)}</span>,
    },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} type="document" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Payroll" value={formatCurrency(totalPayroll)} icon={<Wallet className="h-5 w-5" />} />
        <KpiCard label="Avg Salary" value={formatCurrency(avgSalary)} icon={<DollarSign className="h-5 w-5" />} />
        <KpiCard label="Total Tax" value={formatCurrency(totalTax)} icon={<Percent className="h-5 w-5" />} />
        <KpiCard label="Net Pay Total" value={formatCurrency(netPayTotal)} icon={<Landmark className="h-5 w-5" />} />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/60 px-5 py-4">
          <Select
            options={periods.map((p) => ({ value: p, label: p }))}
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="w-36"
          />
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'paid', label: 'Paid' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36"
          />
          <div className="ml-auto">
            <Button variant="primary" leftIcon={<Play className="h-4 w-4" />}>
              Run Payroll
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
