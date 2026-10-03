import { useState, useMemo } from 'react'
import { Table, type Column } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal'
import { StatusBadge } from '@/components/status-badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { mockData } from '@/data/mockData'
import { Search, Plus, Eye } from 'lucide-react'
import type { Account } from '@/types/finance'

const accountTypes = [
  { value: '', label: 'All Types' },
  { value: 'asset', label: 'Asset' },
  { value: 'liability', label: 'Liability' },
  { value: 'equity', label: 'Equity' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

export function ChartOfAccounts() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    let items = mockData.accounts
    if (search) {
      const q = search.toLowerCase()
      items = items.filter((a) => a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))
    }
    if (typeFilter) {
      items = items.filter((a) => a.type === typeFilter)
    }
    return items
  }, [search, typeFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const columns: Column<Account>[] = [
    { key: 'code', header: 'Code', width: '100px' },
    { key: 'name', header: 'Name' },
    {
      key: 'type',
      header: 'Type',
      width: '120px',
      render: (a) => <span className="capitalize">{a.type}</span>,
    },
    {
      key: 'subtype',
      header: 'Subtype',
      width: '150px',
      render: (a) => <span className="capitalize text-slate-500">{a.subtype.replace(/-/g, ' ')}</span>,
    },
    {
      key: 'balance',
      header: 'Balance',
      width: '150px',
      className: 'text-right font-medium',
      render: (a) => (
        <span className={a.balance < 0 ? 'text-red-600' : 'text-slate-900'}>
          {formatCurrency(a.balance, a.currency)}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      width: '100px',
      render: (a) => (
        <StatusBadge status={a.isActive ? 'active' : 'inactive'} type="employee" />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardContent className="p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Chart of Accounts</h2>
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              New Account
            </Button>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search accounts..."
                leftIcon={<Search className="h-4 w-4" />}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <div className="w-44">
              <Select
                options={accountTypes}
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
              />
            </div>
          </div>
          <Table<Account>
            columns={columns}
            data={paginated}
            keyExtractor={(a) => a.id}
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            onRowClick={setSelectedAccount}
            emptyState={
              <div className="py-8 text-center text-sm text-slate-500">No accounts found</div>
            }
          />
        </CardContent>
      </Card>

      <Modal open={!!selectedAccount} onClose={() => setSelectedAccount(null)} size="lg">
        {selectedAccount && (
          <>
            <ModalHeader onClose={() => setSelectedAccount(null)}>
              {selectedAccount.code} - {selectedAccount.name}
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500">Account Code</label>
                  <p className="text-sm text-slate-900">{selectedAccount.code}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Name</label>
                  <p className="text-sm text-slate-900">{selectedAccount.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Type</label>
                  <p className="text-sm capitalize text-slate-900">{selectedAccount.type}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Subtype</label>
                  <p className="text-sm capitalize text-slate-900">{selectedAccount.subtype.replace(/-/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Balance</label>
                  <p className="text-sm text-slate-900">{formatCurrency(selectedAccount.balance, selectedAccount.currency)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Currency</label>
                  <p className="text-sm text-slate-900">{selectedAccount.currency}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Status</label>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedAccount.isActive ? 'active' : 'inactive'} type="employee" />
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  )
}
