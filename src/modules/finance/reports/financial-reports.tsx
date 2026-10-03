import { useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { mockData } from '@/data/mockData'
import { Download, FileText } from 'lucide-react'
import type { Account } from '@/types/finance'

const today = '2026-05-17'

function TrialBalanceReport() {
  const items = useMemo(() => {
    return mockData.accounts.map((a) => {
      const isDebitNormal = a.type === 'asset' || a.type === 'expense'
      const debit = isDebitNormal && a.balance > 0 ? a.balance : !isDebitNormal && a.balance < 0 ? -a.balance : 0
      const credit = !isDebitNormal && a.balance > 0 ? a.balance : isDebitNormal && a.balance < 0 ? -a.balance : 0
      return { ...a, debit, credit }
    })
  }, [])

  const totalDebit = items.reduce((s, i) => s + i.debit, 0)
  const totalCredit = items.reduce((s, i) => s + i.credit, 0)

  return (
    <div>
      <div className="mb-4 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Code</th>
              <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Account</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Debit</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-mono text-xs text-slate-500">{i.code}</td>
                <td className="px-4 py-2 text-slate-900">{i.name}</td>
                <td className="px-4 py-2 text-right text-slate-900">
                  {i.debit > 0 ? formatCurrency(i.debit) : '-'}
                </td>
                <td className="px-4 py-2 text-right text-slate-900">
                  {i.credit > 0 ? formatCurrency(i.credit) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-slate-200 bg-slate-50 font-medium">
            <tr>
              <td colSpan={2} className="px-4 py-2 text-right text-sm text-slate-700">Totals</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(totalDebit)}</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(totalCredit)}</td>
            </tr>
            <tr>
              <td colSpan={2} className="px-4 py-2 text-right text-sm text-slate-500">
                Difference
              </td>
              <td
                colSpan={2}
                className={`px-4 py-2 text-right text-sm font-semibold ${Math.abs(totalDebit - totalCredit) < 0.01 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {Math.abs(totalDebit - totalCredit) < 0.01
                  ? 'Balanced'
                  : formatCurrency(totalDebit - totalCredit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function ProfitLossReport() {
  const report = useMemo(() => {
    const income = mockData.accounts.filter((a) => a.type === 'income')
    const expense = mockData.accounts.filter((a) => a.type === 'expense')
    const totalIncome = income.reduce((s, i) => s + i.balance, 0)
    const totalExpense = expense.reduce((s, e) => s + e.balance, 0)
    const netIncome = totalIncome - totalExpense
    return { income, expense, totalIncome, totalExpense, netIncome }
  }, [])

  return (
    <div>
      <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Account</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="bg-slate-50">
              <td colSpan={2} className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">
                Income
              </td>
            </tr>
            {report.income.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-900">{a.name}</td>
                <td className="px-4 py-2 text-right text-slate-900">{formatCurrency(a.balance)}</td>
              </tr>
            ))}
            <tr className="border-t border-slate-200 bg-slate-50 font-medium">
              <td className="px-4 py-2 text-right text-sm text-slate-700">Total Income</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(report.totalIncome)}</td>
            </tr>
            <tr className="bg-slate-50">
              <td colSpan={2} className="px-4 py-2 pt-4 text-xs font-semibold uppercase text-slate-600">
                Expenses
              </td>
            </tr>
            {report.expense.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-900">{a.name}</td>
                <td className="px-4 py-2 text-right text-slate-900">{formatCurrency(a.balance)}</td>
              </tr>
            ))}
            <tr className="border-t border-slate-200 bg-slate-50 font-medium">
              <td className="px-4 py-2 text-right text-sm text-slate-700">Total Expenses</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(report.totalExpense)}</td>
            </tr>
          </tbody>
          <tfoot className="border-t-2 border-slate-300 bg-slate-100 font-bold">
            <tr>
              <td className="px-4 py-2 text-right text-sm text-slate-900">Net Income</td>
              <td
                className={`px-4 py-2 text-right text-sm ${report.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {formatCurrency(report.netIncome)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function BalanceSheetReport() {
  const report = useMemo(() => {
    const assets = mockData.accounts.filter((a) => a.type === 'asset')
    const liabilities = mockData.accounts.filter((a) => a.type === 'liability')
    const equity = mockData.accounts.filter((a) => a.type === 'equity')
    const income = mockData.accounts.filter((a) => a.type === 'income')
    const expense = mockData.accounts.filter((a) => a.type === 'expense')

    const totalAssets = assets.reduce((s, a) => s + a.balance, 0)
    const totalLiabilities = liabilities.reduce((s, l) => s + l.balance, 0)
    const totalEquity = equity.reduce((s, e) => s + e.balance, 0)
    const netIncome =
      income.reduce((s, i) => s + i.balance, 0) - expense.reduce((s, e) => s + e.balance, 0)

    return { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity, netIncome }
  }, [])

  return (
    <div>
      <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Account</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="bg-slate-50">
              <td colSpan={2} className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">
                Assets
              </td>
            </tr>
            {report.assets.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-900">{a.name}</td>
                <td className="px-4 py-2 text-right text-slate-900">{formatCurrency(a.balance)}</td>
              </tr>
            ))}
            <tr className="border-t border-slate-200 bg-slate-50 font-medium">
              <td className="px-4 py-2 text-right text-sm text-slate-700">Total Assets</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(report.totalAssets)}</td>
            </tr>

            <tr className="bg-slate-50">
              <td colSpan={2} className="px-4 py-2 pt-4 text-xs font-semibold uppercase text-slate-600">
                Liabilities
              </td>
            </tr>
            {report.liabilities.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-900">{l.name}</td>
                <td className="px-4 py-2 text-right text-slate-900">{formatCurrency(l.balance)}</td>
              </tr>
            ))}
            <tr className="border-t border-slate-200 bg-slate-50 font-medium">
              <td className="px-4 py-2 text-right text-sm text-slate-700">Total Liabilities</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(report.totalLiabilities)}</td>
            </tr>

            <tr className="bg-slate-50">
              <td colSpan={2} className="px-4 py-2 pt-4 text-xs font-semibold uppercase text-slate-600">
                Equity
              </td>
            </tr>
            {report.equity.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-900">{e.name}</td>
                <td className="px-4 py-2 text-right text-slate-900">{formatCurrency(e.balance)}</td>
              </tr>
            ))}
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 text-slate-900">Net Income (Current)</td>
              <td
                className={`px-4 py-2 text-right ${report.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {formatCurrency(report.netIncome)}
              </td>
            </tr>
            <tr className="border-t border-slate-200 bg-slate-50 font-medium">
              <td className="px-4 py-2 text-right text-sm text-slate-700">Total Equity</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">
                {formatCurrency(report.totalEquity + report.netIncome)}
              </td>
            </tr>
          </tbody>
          <tfoot className="border-t-2 border-slate-300 bg-slate-100 font-bold">
            <tr>
              <td className="px-4 py-2 text-right text-sm text-slate-900">
                Liabilities + Equity
              </td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">
                {formatCurrency(report.totalLiabilities + report.totalEquity + report.netIncome)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function CashFlowReport() {
  const cashAccount = mockData.accounts.find((a) => a.code === '1000' || a.name === 'Cash')
  const bankAccount = mockData.accounts.find((a) => a.code === '1100')

  return (
    <div>
      <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Category</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="bg-slate-50">
              <td colSpan={2} className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">
                Operating Activities
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 text-slate-900">Net Income</td>
              <td className="px-4 py-2 text-right text-slate-900">
                {formatCurrency(3200000 + 850000 - 1850000 - 1200000 - 240000 - 72000 - 35000 - 90000 - 320000)}
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 text-slate-900">Depreciation & Amortization</td>
              <td className="px-4 py-2 text-right text-slate-900">{formatCurrency(90000)}</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 text-slate-500">(Increase) / Decrease in AR</td>
              <td className="px-4 py-2 text-right text-slate-900">{formatCurrency(-890000)}</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 text-slate-500">Increase / (Decrease) in AP</td>
              <td className="px-4 py-2 text-right text-slate-900">{formatCurrency(520000)}</td>
            </tr>
            <tr className="border-t border-slate-200 bg-slate-50 font-medium">
              <td className="px-4 py-2 text-right text-sm text-slate-700">Net Operating Cash Flow</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">
                {formatCurrency(3200000 + 850000 - 1850000 - 1200000 - 240000 - 72000 - 35000 - 90000 - 320000 + 90000 - 890000 + 520000)}
              </td>
            </tr>

            <tr className="bg-slate-50">
              <td colSpan={2} className="px-4 py-2 pt-4 text-xs font-semibold uppercase text-slate-600">
                Investing Activities
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 text-slate-500">Purchase of Fixed Assets</td>
              <td className="px-4 py-2 text-right text-red-600">{formatCurrency(-3200000)}</td>
            </tr>
            <tr className="border-t border-slate-200 bg-slate-50 font-medium">
              <td className="px-4 py-2 text-right text-sm text-slate-700">Net Investing Cash Flow</td>
              <td className="px-4 py-2 text-right text-sm text-red-600">{formatCurrency(-3200000)}</td>
            </tr>

            <tr className="bg-slate-50">
              <td colSpan={2} className="px-4 py-2 pt-4 text-xs font-semibold uppercase text-slate-600">
                Financing Activities
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 text-slate-500">Share Capital Issued</td>
              <td className="px-4 py-2 text-right text-slate-900">{formatCurrency(5000000)}</td>
            </tr>
            <tr className="border-t border-slate-200 bg-slate-50 font-medium">
              <td className="px-4 py-2 text-right text-sm text-slate-700">Net Financing Cash Flow</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(5000000)}</td>
            </tr>
          </tbody>
          <tfoot className="border-t-2 border-slate-300 bg-slate-100 font-bold">
            <tr>
              <td className="px-4 py-2 text-right text-sm text-slate-900">Net Change in Cash</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">
                {formatCurrency(
                  3200000 + 850000 - 1850000 - 1200000 - 240000 - 72000 - 35000 - 90000 - 320000 +
                    90000 - 890000 + 520000 - 3200000 + 5000000,
                )}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-2 text-right text-sm text-slate-500">Beginning Cash</td>
              <td className="px-4 py-2 text-right text-sm text-slate-500">{formatCurrency(0)}</td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-2 text-right text-sm text-slate-900">Ending Cash</td>
              <td className="px-4 py-2 text-right text-sm text-slate-900">
                {formatCurrency(
                  3200000 + 850000 - 1850000 - 1200000 - 240000 - 72000 - 35000 - 90000 - 320000 +
                    90000 - 890000 + 520000 - 3200000 + 5000000,
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function ArAgingReport() {
  const aging = useMemo(() => {
    const buckets: Record<string, { invoices: typeof mockData.invoices; total: number }> = {
      current: { invoices: [], total: 0 },
      '1-30': { invoices: [], total: 0 },
      '31-60': { invoices: [], total: 0 },
      '61-90': { invoices: [], total: 0 },
      '90+': { invoices: [], total: 0 },
    }

    mockData.invoices
      .filter((inv) => inv.balance > 0)
      .forEach((inv) => {
        const due = new Date(inv.dueDate)
        const now = new Date(today)
        const diffDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
        let bucket: string
        if (diffDays <= 0) bucket = 'current'
        else if (diffDays <= 30) bucket = '1-30'
        else if (diffDays <= 60) bucket = '31-60'
        else if (diffDays <= 90) bucket = '61-90'
        else bucket = '90+'

        buckets[bucket].invoices.push(inv)
        buckets[bucket].total += inv.balance
      })

    return buckets
  }, [])

  const grandTotal = Object.values(aging).reduce((s, b) => s + b.total, 0)

  const buckets = ['current', '1-30', '31-60', '61-90', '90+'] as const

  return (
    <div>
      <div className="mb-4 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Customer</th>
              <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Invoice</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Current</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">1-30 Days</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">31-60 Days</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">61-90 Days</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">90+ Days</th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockData.invoices
              .filter((inv) => inv.balance > 0)
              .map((inv) => {
                const due = new Date(inv.dueDate)
                const now = new Date(today)
                const diffDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
                const isCurrent = diffDays <= 0
                const is1_30 = diffDays > 0 && diffDays <= 30
                const is31_60 = diffDays > 30 && diffDays <= 60
                const is61_90 = diffDays > 60 && diffDays <= 90
                const is90plus = diffDays > 90

                return (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-900">{inv.customerName}</td>
                    <td className="px-4 py-2 text-slate-700">{inv.number}</td>
                    <td className="px-4 py-2 text-right text-slate-900">
                      {isCurrent ? formatCurrency(inv.balance) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-900">
                      {is1_30 ? formatCurrency(inv.balance) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-900">
                      {is31_60 ? formatCurrency(inv.balance) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-900">
                      {is61_90 ? formatCurrency(inv.balance) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-900">
                      {is90plus ? formatCurrency(inv.balance) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-slate-900">
                      {formatCurrency(inv.balance)}
                    </td>
                  </tr>
                )
              })}
          </tbody>
          <tfoot className="border-t-2 border-slate-300 bg-slate-100 font-bold">
            <tr>
              <td colSpan={2} className="px-4 py-2 text-right text-sm text-slate-700">
                Totals
              </td>
              {buckets.map((b) => (
                <td key={b} className="px-4 py-2 text-right text-sm text-slate-900">
                  {aging[b].total > 0 ? formatCurrency(aging[b].total) : '-'}
                </td>
              ))}
              <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(grandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

const reportTabs = [
  { value: 'trial-balance', label: 'Trial Balance', component: TrialBalanceReport },
  { value: 'profit-loss', label: 'Profit & Loss', component: ProfitLossReport },
  { value: 'balance-sheet', label: 'Balance Sheet', component: BalanceSheetReport },
  { value: 'cash-flow', label: 'Cash Flow', component: CashFlowReport },
  { value: 'ar-aging', label: 'AR Aging', component: ArAgingReport },
]

export function FinancialReports() {
  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardContent className="p-5">
          <Tabs variant="pills" defaultValue="trial-balance">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Financial Reports</h2>
              <Button variant="default" leftIcon={<Download className="h-4 w-4" />}>
                Export
              </Button>
            </div>
            <TabsList className="mb-6">
              {reportTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {reportTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <div className="flex items-center justify-end gap-2 mb-3">
                  <span className="text-xs text-slate-400">As of {today}</span>
                  <Button variant="ghost" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
                    PDF
                  </Button>
                  <Button variant="ghost" size="sm" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                    CSV
                  </Button>
                </div>
                <tab.component />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
