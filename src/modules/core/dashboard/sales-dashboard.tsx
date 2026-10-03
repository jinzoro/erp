import { useMemo } from 'react'
import { mockData } from '@/data/mockData'
import { KpiCard } from '@/components/kpi-card'
import { ChartWidget } from '@/components/chart-widget'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import {
  Users,
  TrendingUp,
  Target,
  Award,
  DollarSign,
  Phone,
} from 'lucide-react'
import {
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

const PIE_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const stageOrder = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']

export function SalesDashboard() {
  const kpis = useMemo(() => {
    const newLeads = mockData.leads.filter((l) => l.status === 'new').length
    const oppValue = mockData.opportunities.reduce((s, o) => s + o.amount, 0)
    const wonLeads = mockData.leads.filter((l) => l.status === 'won').length
    const lostLeads = mockData.leads.filter((l) => l.status === 'lost').length
    const totalClosed = wonLeads + lostLeads
    const conversionRate = totalClosed > 0 ? Math.round((wonLeads / totalClosed) * 100) : 0
    const wonOpps = mockData.opportunities.filter((o) => o.stage === 'closed-won')
    const avgDealSize = wonOpps.length > 0
      ? wonOpps.reduce((s, o) => s + o.amount, 0) / wonOpps.length
      : 0

    return { newLeads, oppValue, conversionRate, wonDeals: wonLeads, avgDealSize }
  }, [])

  const pipelineByStage = useMemo(() => {
    return stageOrder.map((stage) => ({
      stage: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
      value: mockData.opportunities
        .filter((o) => o.stage === stage)
        .reduce((s, o) => s + o.amount, 0),
      count: mockData.opportunities.filter((o) => o.stage === stage).length,
    }))
  }, [])

  const monthlyRevenue = useMemo(() => {
    const months = ['2026-04', '2026-05']
    return months.map((m) => ({
      month: new Date(m + '-01').toLocaleString('en-US', { month: 'short' }),
      revenue: mockData.invoices
        .filter((i) => i.status === 'approved' && i.date.startsWith(m))
        .reduce((s, i) => s + i.amount, 0),
    }))
  }, [])

  const topProducts = useMemo(() => {
    const map = new Map<string, { revenue: number; qty: number }>()
    mockData.invoices
      .filter((i) => i.status === 'approved')
      .forEach((i) => {
        i.lines.forEach((l) => {
          const existing = map.get(l.description) ?? { revenue: 0, qty: 0 }
          existing.revenue += l.amount
          existing.qty += l.quantity
          map.set(l.description, existing)
        })
      })
    return Array.from(map.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }))
  }, [])

  const recentLeads = useMemo(
    () => mockData.leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [],
  )

  const salesTeamPerformance = useMemo(() => {
    const map = new Map<string, { won: number; total: number; value: number }>()
    mockData.opportunities.forEach((o) => {
      const existing = map.get(o.assignedTo) ?? { won: 0, total: 0, value: 0 }
      existing.total++
      existing.value += o.amount
      if (o.stage === 'closed-won') existing.won++
      map.set(o.assignedTo, existing)
    })
    const userMap = new Map(mockData.users.map((u) => [u.id, u.name]))
    return Array.from(map.entries()).map(([userId, data]) => ({
      name: userMap.get(userId) ?? 'Unknown',
      ...data,
      winRate: data.total > 0 ? Math.round((data.won / data.total) * 100) : 0,
    }))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sales Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Sales performance and pipeline analytics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="New Leads" value={kpis.newLeads} trend="up" trendValue="+3" icon={<Users className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Opportunities Value" value={fmt(kpis.oppValue)} trend="up" trendValue="+8.5%" icon={<DollarSign className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Conversion Rate" value={`${kpis.conversionRate}%`} trend={kpis.conversionRate >= 50 ? 'up' : 'down'} trendValue={kpis.conversionRate >= 50 ? 'Good' : 'Needs focus'} icon={<Target className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Won Deals" value={kpis.wonDeals} trend="up" trendValue="+2" icon={<Award className="h-5 w-5" />} variant="glass" />
        <KpiCard label="Avg Deal Size" value={fmt(kpis.avgDealSize)} trend="up" trendValue="+5.2%" icon={<TrendingUp className="h-5 w-5" />} variant="glass" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget title="Pipeline by Stage" variant="glass">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineByStage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 12, fill: '#64748b' }} width={100} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                formatter={(v) => [fmt(Number(v) || 0), 'Value']}
              />
              <Bar dataKey="value" name="Pipeline Value" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>

        <ChartWidget title="Monthly Revenue" variant="glass">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={(v) => [fmt(Number(v) || 0)]}
              />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="glass" padding="none" className="lg:col-span-2">
          <div className="border-b border-slate-100/50 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Top Products by Revenue</h3>
          </div>
          <div className="p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100/50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="pb-2">Product</th>
                  <th className="pb-2 text-right">Quantity</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {topProducts.map((p) => (
                  <tr key={p.name}>
                    <td className="py-2.5 text-slate-700">{p.name}</td>
                    <td className="py-2.5 text-right text-slate-600">{p.qty}</td>
                    <td className="py-2.5 text-right font-medium text-slate-900">{fmt(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card variant="glass" padding="none">
          <div className="border-b border-slate-100/50 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Sales Team</h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {salesTeamPerformance.map((p) => (
                <div key={p.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{p.name}</span>
                    <span className="text-xs text-slate-500">{p.winRate}% win</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${p.winRate}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>{fmt(p.value)} pipeline</span>
                    <span>{p.won} won / {p.total} total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card variant="glass" padding="none">
        <div className="border-b border-slate-100/50 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Recent Leads</h3>
        </div>
        <div className="p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100/50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="pb-2">Company</th>
                <th className="pb-2">Contact</th>
                <th className="pb-2">Source</th>
                <th className="pb-2">Score</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {recentLeads.map((l) => (
                <tr key={l.id}>
                  <td className="py-2.5 font-medium text-slate-900">{l.company}</td>
                  <td className="py-2.5 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {l.contactName}
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-600">{l.source}</td>
                  <td className="py-2.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        l.score >= 80
                          ? 'bg-emerald-100 text-emerald-700'
                          : l.score >= 60
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {l.score}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={l.status} type="lead" />
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
