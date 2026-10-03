import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ChartOfAccounts } from './coa/chart-of-accounts'
import { JournalEntries } from './gl/journal-entries'
import { AccountsPayable } from './ap/accounts-payable'
import { AccountsReceivable } from './ar/accounts-receivable'
import { FinancialReports } from './reports/financial-reports'
import { BookOpen, FileText, CreditCard, Receipt, BarChart3 } from 'lucide-react'

const tabs = [
  { value: 'coa', label: 'Chart of Accounts', icon: BookOpen, component: ChartOfAccounts },
  { value: 'gl', label: 'Journal Entries', icon: FileText, component: JournalEntries },
  { value: 'ap', label: 'Accounts Payable', icon: CreditCard, component: AccountsPayable },
  { value: 'ar', label: 'Accounts Receivable', icon: Receipt, component: AccountsReceivable },
  { value: 'reports', label: 'Reports', icon: BarChart3, component: FinancialReports },
]

export function FinanceLayout() {
  const [activeTab, setActiveTab] = useState('coa')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
          <p className="mt-1 text-sm text-slate-500">Manage accounts, transactions, and financial reports</p>
        </div>
      </div>

      <Tabs variant="glass" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
