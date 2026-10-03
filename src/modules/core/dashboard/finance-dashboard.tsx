import { useMemo } from 'react'
import { mockData } from '@/data/mockData'
import { KpiCard } from '@/components/kpi-card'
import { ChartWidget } from '@/components/chart-widget'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Landmark,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)

const PIE_COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6']

export function FinanceDashboard() {
  const kpis = useMemo(() => {
    const totalRevenue = mockData.invoices
      .filter((i) => i.status === 'approved')
      .reduce((s, i) => s + i.amount, 0)

    const totalExpenses = mockData.bills
      .filter((b) => b.status === 'approved')
      .reduce((s, b) => s + b.amount, 0)

    const arBalance = mockData.invoices
      .filter((i) => i.status !== 'cancelled')
      .reduce((s, i) => s + i.balance, 0)

    const apBalance = mockData.bills
      .filter((b) => b.status !== 'cancelled')
      .reduce((s, b) => s + b.balance, 0)

    const cashAccounts = mockData.accounts.filter((a) =>
      ['1000', '1100'].includes(a.code),
    )
    const cashBalance = cashAccounts.reduce((s, a) => s + a.balance, 0)

    return {
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      arBalance,
      apBalance,
      cashBalance,
    }
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

  const expenseBreakdown = useMemo(() => {
    const expenseAccounts = mockData.accounts.filter((a) => a.type === 'expense')
    return expenseAccounts.map((a) => ({
      name: a.name,
      value: Math.abs(a.balance),
    }))
  }, [])

  const arAging = useMemo(() => {
    const now = new Date('2026-05-17')
    const buckets = [
      { label: 'Current', days: 0, color: '#10b981' },
      { label: '1-30 days', days: 30, color: '#3b82f6' },
      { label: '31-60 days', days: 60, color: '#f59e0b' },
      { label: '61-90 days', days: 90, color: '#ef4444' },
      { label: '90+ days', days: Infinity, color: '#8b5cf6' },
    ]
    const invoices = mockData.invoices.filter((i) => i.status === 'approved' && i.balance > 0)
    return buckets.map((b) => {
      const prevDays = b.days === 0 ? -1 : buckets[buckets.indexOf(b) - 1]?.days ?? -1
      const value = invoices
        .filter((i) => {
          const due = new Date(i.dueDate)
          const diff = (now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
          return diff > prevDays && diff <= b.days
        })
        .reduce((s, i) => s + i.balance, 0)
      return { label: b.label, value, color: b.color }
    })
  }, [])

  const recentJournalEntries = useMemo(
    () => mockData.journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [],
  )

  const budgets = useMemo(
    () => mockData.accounts.filter((a) => a.type === 'expense' || a.type === 'income').slice(0, 8),
    [],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Finance Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Financial overview and analytics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Revenue" value={fmt(kpis.totalRevenue)} trend="up" trendValue="+15.3%" icon={<DollarSign className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Total Expenses" value={fmt(kpis.totalExpenses)} trend="down" trendValue="+4.1%" icon={<TrendingDown className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Net Income" value={fmt(kpis.netIncome)} trend={kpis.netIncome >= 0 ? 'up' : 'down'} trendValue={kpis.netIncome >= 0 ? '+11.2%' : '-3.5%'} icon={<TrendingUp className="h-5 w-5" />} variant="glass" />
        <KpiCard label="AR Balance" value={fmt(kpis.arBalance)} trend="down" trendValue="-2.1%" icon={<Receipt className="h-5 w-5" />} variant="glass" />
        <KpiCard label="AP Balance" value={fmt(kpis.apBalance)} trend="up" trendValue="+5.7%" icon={<Wallet className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Cash Balance" value={fmt(kpis.cashBalance)} trend="up" trendValue="+1.8%" icon={<Landmark className="h-5 w-5" />} variant="glass" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget title="Revenue vs Expenses Trend" variant="glass">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                formatter={(v) => [fmt(Number(v) || 0)]}
              />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" fill="url(#expGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWidget>

        <ChartWidget title="Expense Breakdown" variant="glass">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {expenseBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={(v) => [fmt(Number(v) || 0)]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => <span className="text-slate-700">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget title="AR Aging" variant="glass">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={arAging}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={(v) => [fmt(Number(v) || 0)]}
              />
              <Bar dataKey="value" name="Balance" radius={[4, 4, 0, 0]}>
                {arAging.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>

        <ChartWidget title="Budget vs Actual" variant="glass">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgets.map((a) => ({ name: a.name.split(' ').slice(0, 2).join(' '), budget: a.balance * 1.1, actual: a.balance }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={(v) => [fmt(Number(v) || 0)]}
              />
              <Bar dataKey="budget" name="Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>

      <Card variant="glass" padding="none">
        <div className="border-b border-slate-100/50 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Recent Journal Entries</h3>
        </div>
        <div className="p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100/50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="pb-2">Number</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Description</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {recentJournalEntries.map((je) => (
                <tr key={je.id}>
                  <td className="py-2.5 font-medium text-slate-900">{je.number}</td>
                  <td className="py-2.5 text-slate-600">{new Date(je.date).toLocaleDateString()}</td>
                  <td className="py-2.5 text-slate-600">{je.description}</td>
                  <td className="py-2.5">
                    <StatusBadge status={je.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
