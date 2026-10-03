import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Table, type Column } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/status-badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { mockData } from '@/data/mockData'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, Receipt } from 'lucide-react'

export function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const employee = mockData.employees.find((e) => e.id === id)

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-slate-600">Employee not found</p>
        <Button variant="ghost" onClick={() => navigate('/hr/employees')} className="mt-4">
          Back to Employees
        </Button>
      </div>
    )
  }

  const attendance = mockData.attendanceRecords.filter((a) => a.employeeId === id)
  const leave = mockData.leaveRequests.filter((l) => l.employeeId === id)
  const payroll = mockData.payrollRecords.filter((p) => p.employeeId === id)
  const attendanceColumns: Column<typeof attendance[0]>[] = [
    { key: 'date', header: 'Date', render: (item) => formatDate(item.date) },
    { key: 'checkIn', header: 'Check In' },
    { key: 'checkOut', header: 'Check Out' },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} type="attendance" /> },
    { key: 'hours', header: 'Hours', render: (item) => <span className="font-medium">{item.hours}h</span> },
  ]

  const leaveColumns: Column<typeof leave[0]>[] = [
    { key: 'type', header: 'Type', render: (item) => <Badge variant="info">{item.type}</Badge> },
    { key: 'fromDate', header: 'From', render: (item) => formatDate(item.fromDate) },
    { key: 'toDate', header: 'To', render: (item) => formatDate(item.toDate) },
    { key: 'days', header: 'Days' },
    { key: 'reason', header: 'Reason' },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} type="document" /> },
  ]

  const payrollColumns: Column<typeof payroll[0]>[] = [
    { key: 'period', header: 'Period' },
    { key: 'basicSalary', header: 'Basic', render: (item) => formatCurrency(item.basicSalary) },
    { key: 'allowances', header: 'Allowances', render: (item) => formatCurrency(item.allowances) },
    { key: 'deductions', header: 'Deductions', render: (item) => <span className="text-red-600">{formatCurrency(item.deductions)}</span> },
    { key: 'tax', header: 'Tax', render: (item) => formatCurrency(item.tax) },
    { key: 'netPay', header: 'Net Pay', render: (item) => <span className="font-semibold text-emerald-600">{formatCurrency(item.netPay)}</span> },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} type="document" /> },
  ]

  const initials = getInitials(`${employee.firstName} ${employee.lastName}`)

  return (
    <div className="space-y-6">
      <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/hr/employees')}>
        Back to Employees
      </Button>

      <Card variant="glass">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{employee.firstName} {employee.lastName}</h1>
                <p className="text-sm text-slate-500">{employee.position} · {employee.departmentName}</p>
              </div>
            </div>
            <StatusBadge status={employee.status} type="employee" size="md" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Contact</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {employee.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {employee.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {employee.address.street}, {employee.address.city}, {employee.address.state} {employee.address.zip}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Employment</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Hired: {formatDate(employee.hireDate)}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  Salary: {formatCurrency(employee.salary)}/year
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Code: </span>
                  <span className="font-mono text-sm text-slate-700">{employee.code}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="attendance">
        <TabsList>
          <TabsTrigger value="attendance">Attendance ({attendance.length})</TabsTrigger>
          <TabsTrigger value="leave">Leave ({leave.length})</TabsTrigger>
          <TabsTrigger value="payroll">Payroll ({payroll.length})</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <Card variant="glass" padding="none">
            <Table columns={attendanceColumns} data={attendance} keyExtractor={(item) => item.id} />
          </Card>
        </TabsContent>
        <TabsContent value="leave">
          <Card variant="glass" padding="none">
            <Table columns={leaveColumns} data={leave} keyExtractor={(item) => item.id} />
          </Card>
        </TabsContent>
        <TabsContent value="payroll">
          <Card variant="glass" padding="none">
            <Table columns={payrollColumns} data={payroll} keyExtractor={(item) => item.id} />
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <Card variant="glass" padding="none">
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Receipt className="h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-500">No expense claims found</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
