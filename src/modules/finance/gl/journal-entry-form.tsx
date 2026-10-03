import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatCurrency, generateId } from '@/lib/utils'
import { mockData } from '@/data/mockData'
import { Plus, Trash2, Save, Send } from 'lucide-react'
import type { JournalLine } from '@/types/finance'

interface JournalEntryFormProps {
  open: boolean
  onClose: () => void
}

const accountOptions = mockData.accounts.map((a) => ({
  value: a.id,
  label: `${a.code} - ${a.name}`,
}))

const costCenterOptions = [
  { value: '', label: 'None' },
  { value: 'cc-1', label: 'CC-001 - Administration' },
  { value: 'cc-2', label: 'CC-002 - Sales & Marketing' },
  { value: 'cc-3', label: 'CC-003 - Operations' },
]

interface LineItem {
  id: string
  accountId: string
  description: string
  debit: number
  credit: number
  costCenterId: string
}

function createLine(): LineItem {
  return { id: generateId(), accountId: '', description: '', debit: 0, credit: 0, costCenterId: '' }
}

export function JournalEntryForm({ open, onClose }: JournalEntryFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')
  const [reference, setReference] = useState('')
  const [lines, setLines] = useState<LineItem[]>([createLine()])

  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0)
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001
  const hasEmptyLines = lines.some((l) => !l.accountId || !l.description)

  const updateLine = (id: string, field: keyof LineItem, value: string | number) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    )
  }

  const removeLine = (id: string) => {
    if (lines.length === 1) return
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  const addLine = () => {
    setLines((prev) => [...prev, createLine()])
  }

  const handleSave = (status: 'draft' | 'pending') => {
    console.log('Save journal entry', { date, description, reference, lines, status })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <ModalHeader onClose={onClose}>New Journal Entry</ModalHeader>
      <ModalBody>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input
            label="Reference"
            placeholder="e.g. INV-001"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <Input
            label="Description"
            placeholder="Brief description of the entry"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">Line Items</h4>
          <Button variant="ghost" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={addLine}>
            Add Line
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-48 px-4 py-2 text-xs font-semibold uppercase text-slate-600">Account</th>
                <th className="px-4 py-2 text-xs font-semibold uppercase text-slate-600">Description</th>
                <th className="w-28 px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Debit</th>
                <th className="w-28 px-4 py-2 text-right text-xs font-semibold uppercase text-slate-600">Credit</th>
                <th className="w-36 px-4 py-2 text-xs font-semibold uppercase text-slate-600">Cost Center</th>
                <th className="w-10 px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lines.map((line) => (
                <tr key={line.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <Select
                      options={accountOptions}
                      value={line.accountId}
                      placeholder="Select account"
                      onChange={(e) => updateLine(line.id, 'accountId', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      placeholder="Line description"
                      value={line.description}
                      onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={line.debit || ''}
                      onChange={(e) => updateLine(line.id, 'debit', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={line.credit || ''}
                      onChange={(e) => updateLine(line.id, 'credit', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Select
                      options={costCenterOptions}
                      value={line.costCenterId}
                      onChange={(e) => updateLine(line.id, 'costCenterId', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLine(line.id)}
                      leftIcon={<Trash2 className="h-4 w-4 text-red-500" />}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-slate-200 bg-slate-50 font-medium">
              <tr>
                <td colSpan={2} className="px-4 py-2 text-right text-sm text-slate-700">
                  Totals
                </td>
                <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(totalDebit)}</td>
                <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(totalCredit)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {!isBalanced && lines.length > 0 && (
          <p className="mt-2 text-sm text-red-600">
            Debits ({formatCurrency(totalDebit)}) must equal credits ({formatCurrency(totalCredit)})
          </p>
        )}
        {isBalanced && totalDebit > 0 && (
          <p className="mt-2 text-sm text-emerald-600">Entry is balanced</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="default" onClick={() => handleSave('draft')} leftIcon={<Save className="h-4 w-4" />}>
          Save as Draft
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSave('pending')}
          leftIcon={<Send className="h-4 w-4" />}
          disabled={!isBalanced || !description || hasEmptyLines}
        >
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  )
}
