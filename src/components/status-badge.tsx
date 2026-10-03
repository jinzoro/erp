import { Badge, type BadgeProps } from '@/components/ui/badge'

type StatusVariant = BadgeProps['variant']

const documentStatusMap: Record<string, StatusVariant> = {
  draft: 'default',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  cancelled: 'default',
  completed: 'success',
}

const employeeStatusMap: Record<string, StatusVariant> = {
  active: 'success',
  inactive: 'default',
  terminated: 'danger',
}

const projectStatusMap: Record<string, StatusVariant> = {
  planning: 'info',
  active: 'primary',
  'on-hold': 'warning',
  completed: 'success',
  cancelled: 'default',
}

const taskStatusMap: Record<string, StatusVariant> = {
  todo: 'default',
  'in-progress': 'primary',
  review: 'warning',
  done: 'success',
}

const leadStatusMap: Record<string, StatusVariant> = {
  new: 'info',
  contacted: 'primary',
  qualified: 'warning',
  proposal: 'default',
  won: 'success',
  lost: 'danger',
}

const opportunityStatusMap: Record<string, StatusVariant> = {
  prospecting: 'default',
  qualification: 'info',
  proposal: 'warning',
  negotiation: 'primary',
  'closed-won': 'success',
  'closed-lost': 'danger',
}

const ticketStatusMap: Record<string, StatusVariant> = {
  open: 'info',
  'in-progress': 'primary',
  waiting: 'warning',
  resolved: 'success',
  closed: 'default',
}

const approvalStatusMap: Record<string, StatusVariant> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  cancelled: 'default',
}

const contractStatusMap: Record<string, StatusVariant> = {
  draft: 'default',
  active: 'success',
  expired: 'default',
  terminated: 'danger',
}

const batchStatusMap: Record<string, StatusVariant> = {
  active: 'success',
  expired: 'default',
  blocked: 'danger',
}

const cycleCountStatusMap: Record<string, StatusVariant> = {
  planned: 'info',
  'in-progress': 'primary',
  completed: 'success',
}

const recruitmentStatusMap: Record<string, StatusVariant> = {
  open: 'info',
  'in-progress': 'primary',
  filled: 'success',
  cancelled: 'danger',
}

const attendanceStatusMap: Record<string, StatusVariant> = {
  present: 'success',
  absent: 'danger',
  late: 'warning',
  'half-day': 'warning',
  holiday: 'info',
}

const statusMaps: Record<string, Record<string, StatusVariant>> = {
  document: documentStatusMap,
  employee: employeeStatusMap,
  project: projectStatusMap,
  task: taskStatusMap,
  lead: leadStatusMap,
  opportunity: opportunityStatusMap,
  ticket: ticketStatusMap,
  approval: approvalStatusMap,
  contract: contractStatusMap,
  batch: batchStatusMap,
  'cycle-count': cycleCountStatusMap,
  recruitment: recruitmentStatusMap,
  attendance: attendanceStatusMap,
}

const labelOverrides: Record<string, Record<string, string>> = {
  opportunity: {
    'closed-won': 'Won',
    'closed-lost': 'Lost',
  },
  task: {
    'in-progress': 'In Progress',
  },
}

export interface StatusBadgeProps {
  status: string
  type?: keyof typeof statusMaps
  size?: BadgeProps['size']
}

export function StatusBadge({ status, type = 'document', size = 'sm' }: StatusBadgeProps) {
  const map = statusMaps[type] ?? documentStatusMap
  const variant = map[status] ?? 'default'
  const label =
    labelOverrides[type]?.[status] ??
    status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')

  return (
    <Badge variant={variant} size={size} dot>
      {label}
    </Badge>
  )
}
