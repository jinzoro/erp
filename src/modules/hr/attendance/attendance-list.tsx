import { useState, useMemo } from 'react'
import { Table, type Column } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { KpiCard } from '@/components/kpi-card'
import { mockData } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { Search, CalendarCheck, Plus, Clock, XCircle, AlertTriangle } from 'lucide-react'

const today = '2026-05-17'

export function AttendanceList() {
  const [dateFilter, setDateFilter] = useState(today)
  const [departmentFilter, setDepartmentFilter] = useState('')

  const { attendanceRecords, employees, departments } = mockData

  const departmentOptions = useMemo(
    () => [{ value: '', label: 'All Departments' }, ...departments.map((d) => ({ value: d.id, label: d.name }))],
    [departments],
  )

  const filtered = useMemo(
    () =>
      attendanceRecords.filter((a) => {
        if (dateFilter && a.date !== dateFilter) return false
        if (departmentFilter) {
          const emp = employees.find((e) => e.id === a.employeeId)
          if (emp?.departmentId !== departmentFilter) return false
        }
        return true
      }),
    [attendanceRecords, dateFilter, departmentFilter, employees],
  )

  const todayRecords = attendanceRecords.filter((a) => a.date === today)
  const presentToday = todayRecords.filter((a) => a.status === 'present').length
  const absentToday = todayRecords.filter((a) => a.status === 'absent').length
  const lateToday = todayRecords.filter((a) => a.status === 'late').length
  const onLeaveToday = todayRecords.filter((a) => a.status === 'half-day').length

  const columns: Column<typeof attendanceRecords[0]>[] = [
    { key: 'employeeName', header: 'Employee' },
    { key: 'date', header: 'Date', render: (item) => formatDate(item.date) },
    { key: 'checkIn', header: 'Check In', render: (item) => item.checkIn || '-' },
    { key: 'checkOut', header: 'Check Out', render: (item) => item.checkOut || '-' },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} type="attendance" /> },
    { key: 'hours', header: 'Hours', render: (item) => <span className="font-medium">{item.hours}h</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Present Today" value={presentToday} icon={<CalendarCheck className="h-5 w-5" />} />
        <KpiCard label="Absent" value={absentToday} icon={<XCircle className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Late" value={lateToday} icon={<AlertTriangle className="h-5 w-5" />} variant="glass" />
        <KpiCard label="On Leave" value={onLeaveToday} icon={<Clock className="h-5 w-5" />} />
      </div>

      <Card variant="glass" padding="none">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/60 px-5 py-4">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-44"
          />
          <Select
            options={departmentOptions}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-44"
          />
          <div className="ml-auto">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              Mark Attendance
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
