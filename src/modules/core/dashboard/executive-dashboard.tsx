import { useMemo } from 'react'
import { useAuthStore } from '@/store/authStore'
import { mockData } from '@/data/mockData'
import { KpiCard } from '@/components/kpi-card'
import { ChartWidget } from '@/components/chart-widget'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/status-badge'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Clock,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const roleNames: Record<string, string> = {
  admin: 'Administrator',
  finance: 'Finance Manager',
  sales: 'Sales Manager',
  procurement: 'Procurement Manager',
  inventory: 'Inventory Manager',
  hr: 'HR Manager',
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function ExecutiveDashboard() {
  const user = useAuthStore((s) => s.user)

  const kpis = useMemo(() => {
    const thisMonth = '2026-05'

    const revenue = mockData.invoices
      .filter((i) => i.status === 'approved' && i.date.startsWith(thisMonth))
      .reduce((s, i) => s + i.amount, 0)

    const expenses = mockData.bills
      .filter((b) => b.status === 'approved' && b.date.startsWith(thisMonth))
      .reduce((s, b) => s + b.amount, 0)

    const cashAccounts = mockData.accounts.filter((a) =>
      ['1000', '1100'].includes(a.code),
    )
    const cashBalance = cashAccounts.reduce((s, a) => s + a.balance, 0)

    const openOrders = mockData.salesOrders.filter(
      (so) => so.status === 'pending' || so.status === 'approved',
    ).length

    const pendingApprovals = mockData.approvals.filter(
      (a) => a.status === 'pending',
    ).length

    return { revenue, expenses, netProfit: revenue - expenses, cashBalance, openOrders, pendingApprovals }
  }, [])

  const monthlyTrend = useMemo(() => {
    const months = ['2026-04', '2026-05']
    return months.map((m) => ({
      month: new Date(m + '-01').toLocaleString('en-US', { month: 'short' }),
      revenue: mockData.invoices
        .filter((i) => i.status === 'approved' && i.date.startsWith(m))
        .reduce((s, i) => s + i.amount, 0),
      expenses: mockData.bills
        .filter((b) => b.status === 'approved' && b.date.startsWith(m))
        .reduce((s, b) => s + b.amount, 0),
    }))
  }, [])

  const pipelineByStage = useMemo(() => {
    const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won']
    return stages.map((stage) => ({
      stage: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
      value: mockData.opportunities
        .filter((o) => o.stage === stage)
        .reduce((s, o) => s + o.amount, 0),
      count: mockData.opportunities.filter((o) => o.stage === stage).length,
    }))
  }, [])

  const topCustomers = useMemo(() => {
    const map = new Map<string, number>()
    mockData.invoices
      .filter((i) => i.status === 'approved')
      .forEach((i) => map.set(i.customerName, (map.get(i.customerName) ?? 0) + i.amount))
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, amount]) => ({ name, amount }))
  }, [])

  const recentTransactions = useMemo(() => {
    const items = [
      ...mockData.invoices.map((i) => ({ ...i, kind: 'Invoice' as const })),
      ...mockData.bills.map((b) => ({ ...b, kind: 'Bill' as const })),
    ]
    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
  }, [])

  const pendingApprovalItems = useMemo(
    () => mockData.approvals.filter((a) => a.status === 'pending'),
    [],
  )

  const notificationsFeed = useMemo(
    () => mockData.notifications.filter((n) => !n.read).slice(0, 5),
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name ?? 'User'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {roleNames[user?.roleId ?? ''] ?? 'User'} &middot; Acme Corporation
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Revenue (This Month)"
          value={fmt(kpis.revenue)}
          trend="up"
          trendValue="+12.5%"
          icon={<DollarSign className="h-5 w-5" />}
          variant="glass"
        />
        <KpiCard
          label="Expenses"
          value={fmt(kpis.expenses)}
          trend="down"
          trendValue="+3.2%"
          icon={<TrendingDown className="h-5 w-5" />}
          variant="glass"
        />
        <KpiCard
          label="Net Profit"
          value={fmt(kpis.netProfit)}
          trend={kpis.netProfit >= 0 ? 'up' : 'down'}
          trendValue={kpis.netProfit >= 0 ? '+8.1%' : '-2.4%'}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="glass"
        />
        <KpiCard
          label="Cash Balance"
          value={fmt(kpis.cashBalance)}
          trend="up"
          trendValue="+2.1%"
          icon={<Wallet className="h-5 w-5" />}
          variant="glass"
        />
        <KpiCard
          label="Open Orders"
          value={kpis.openOrders}
          trend="neutral"
          trendValue="Same"
          icon={<ShoppingCart className="h-5 w-5" />}
          variant="glass"
        />
        <KpiCard
          label="Pending Approvals"
          value={kpis.pendingApprovals}
          trend={kpis.pendingApprovals > 0 ? 'down' : 'neutral'}
          trendValue={kpis.pendingApprovals > 0 ? 'Needs action' : 'All clear'}
          icon={<Clock className="h-5 w-5" />}
          variant="glass"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget title="Revenue vs Expenses" variant="glass">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
                formatter={(v) => [fmt(Number(v) || 0)]}
              />
              <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>

        <ChartWidget title="Sales Pipeline" variant="glass">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineByStage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 12, fill: '#64748b' }} width={110} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
                formatter={(v) => [fmt(Number(v) || 0), 'Value']}
              />
              <Bar dataKey="value" name="Pipeline Value" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="glass" padding="none" className="lg:col-span-2">
          <div className="border-b border-slate-100/50 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Top Customers by Revenue</h3>
          </div>
          <div className="p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100/50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="pb-2">Customer</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {topCustomers.map((c) => (
                  <tr key={c.name}>
                    <td className="py-2.5 text-slate-700">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {c.name}
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-900">
                      {fmt(c.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card variant="glass" padding="none">
          <div className="border-b border-slate-100/50 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Pending Approvals</h3>
          </div>
          <div className="divide-y divide-slate-100/50">
            {pendingApprovalItems.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No pending approvals</p>
            ) : (
              pendingApprovalItems.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {a.targetNumber}
                    </p>
                    <p className="text-xs text-slate-500">{a.type}</p>
                  </div>
                  <StatusBadge status={a.status} type="approval" />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="glass" padding="none">
          <div className="border-b border-slate-100/50 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-slate-100/50">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {t.number}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t.kind === 'Invoice' ? (t as typeof mockData.invoices[0]).customerName : (t as typeof mockData.bills[0]).vendorName}
                    {' '}&middot;{' '}
                    {fmtDate(t.date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900">{fmt(t.amount)}</span>
                  {t.kind === 'Invoice' ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="glass" padding="none">
          <div className="border-b border-slate-100/50 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
          </div>
          <div className="divide-y divide-slate-100/50">
            {notificationsFeed.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">All caught up</p>
            ) : (
              notificationsFeed.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-5 py-3">
                  <div
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                      n.type === 'error'
                        ? 'bg-red-500'
                        : n.type === 'warning'
                          ? 'bg-amber-500'
                          : n.type === 'success'
                            ? 'bg-emerald-500'
                            : 'bg-blue-500'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
