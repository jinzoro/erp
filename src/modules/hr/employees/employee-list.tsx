import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, type Column } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/kpi-card'
import { StatusBadge } from '@/components/status-badge'
import { mockData } from '@/data/mockData'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { Search, Plus, Users, Building2, DollarSign } from 'lucide-react'

export function EmployeeList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { employees, departments, payrollRecords } = mockData

  const departmentOptions = useMemo(
    () => [{ value: '', label: 'All Departments' }, ...departments.map((d) => ({ value: d.id, label: d.name }))],
    [departments],
  )

  const filtered = useMemo(
    () =>
      employees.filter((e) => {
        const fullName = `${e.firstName} ${e.lastName}`
        if (search && !fullName.toLowerCase().includes(search.toLowerCase()) && !e.code.toLowerCase().includes(search.toLowerCase()))
          return false
        if (departmentFilter && e.departmentId !== departmentFilter) return false
        if (statusFilter && e.status !== statusFilter) return false
        return true
      }),
    [employees, search, departmentFilter, statusFilter],
  )

  const activeEmployees = employees.filter((e) => e.status === 'active').length
  const payrollThisMonth = payrollRecords
    .filter((p) => p.period === '2026-05')
    .reduce((s, p) => s + p.netPay, 0)

  const columns: Column<typeof employees[0]>[] = [
    { key: 'code', header: 'Code', render: (item) => <span className="font-mono text-xs text-slate-500">{item.code}</span> },
    {
      key: 'name',
      header: 'Name',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            {getInitials(`${item.firstName} ${item.lastName}`)}
          </div>
          <span className="font-medium text-slate-900">{item.firstName} {item.lastName}</span>
        </div>
      ),
    },
    { key: 'departmentName', header: 'Department' },
    { key: 'position', header: 'Position' },
    { key: 'email', header: 'Email', render: (item) => <span className="text-sm text-slate-500">{item.email}</span> },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} type="employee" /> },
    { key: 'hireDate', header: 'Hire Date', render: (item) => formatDate(item.hireDate) },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Employees" value={employees.length} icon={<Users className="h-5 w-5" />} />
        <KpiCard label="Active" value={activeEmployees} icon={<Users className="h-5 w-5" />} />
        <KpiCard label="Departments" value={departments.length} icon={<Building2 className="h-5 w-5" />} />
        <KpiCard label="Payroll This Month" value={formatCurrency(payrollThisMonth)} icon={<DollarSign className="h-5 w-5" />} />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/60 px-5 py-4">
          <Input
            placeholder="Search employees..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select
            options={departmentOptions}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-44"
          />
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'terminated', label: 'Terminated' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36"
          />
          <div className="ml-auto">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              New Employee
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => navigate(`/hr/employees/${item.id}`)}
        />
      </Card>
    </div>
  )
}
