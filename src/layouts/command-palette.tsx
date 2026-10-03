import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { SIDEBAR_NAV } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  Search,
  ArrowRight,
  FileText,
  UserPlus,
  Plus,
  type LucideIcon,
} from 'lucide-react'

interface CommandItem {
  id: string
  label: string
  description: string
  category: string
  icon: LucideIcon
  action: () => void
}

export function CommandPalette() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const items = useMemo<CommandItem[]>(() => {
    const result: CommandItem[] = []

    SIDEBAR_NAV.forEach((section) => {
      section.items.forEach((item) => {
        result.push({
          id: `nav-${item.href}`,
          label: item.label,
          description: `Navigate to ${item.label}`,
          category: 'Navigate to...',
          icon: item.icon,
          action: () => navigate(item.href),
        })
      })
    })

    const createItems: CommandItem[] = [
      {
        id: 'create-invoice',
        label: 'New Invoice',
        description: 'Create a new invoice',
        category: 'Create...',
        icon: FileText,
        action: () => navigate('/finance/invoices/new'),
      },
      {
        id: 'create-user',
        label: 'New User',
        description: 'Add a new user to the system',
        category: 'Create...',
        icon: UserPlus,
        action: () => navigate('/admin/users/new'),
      },
      {
        id: 'create-order',
        label: 'New Purchase Order',
        description: 'Create a purchase order',
        category: 'Create...',
        icon: FileText,
        action: () => navigate('/procurement/orders/new'),
      },
      {
        id: 'create-product',
        label: 'New Product',
        description: 'Add a new product to inventory',
        category: 'Create...',
        icon: Plus,
        action: () => navigate('/inventory/products/new'),
      },
    ]
    result.push(...createItems)

    const actionItems: CommandItem[] = [
      {
        id: 'go-settings',
        label: 'Settings',
        description: 'Open application settings',
        category: 'Actions...',
        icon: ArrowRight,
        action: () => navigate('/settings'),
      },
      {
        id: 'go-profile',
        label: 'My Profile',
        description: 'View your profile',
        category: 'Actions...',
        icon: ArrowRight,
        action: () => navigate('/profile'),
      },
    ]
    result.push(...actionItems)

    return result
  }, [navigate])

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const lower = query.toLowerCase()
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower),
    )
  }, [query, items])

  const grouped = useMemo(() => {
    const groups: { category: string; items: CommandItem[] }[] = []
    const seen = new Set<string>()
    for (const item of filtered) {
      if (!seen.has(item.category)) {
        seen.add(item.category)
        groups.push({ category: item.category, items: [] })
      }
      const group = groups.find((g) => g.category === item.category)
      if (group) group.items.push(item)
    }
    return groups
  }, [filtered])

  const flatItems = useMemo(() => filtered, [filtered])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    const handleCustom = () => setOpen(true)

    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleCustom)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleCustom)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % flatItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(
          (prev) => (prev - 1 + flatItems.length) % flatItems.length,
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (flatItems[selectedIndex]) {
          flatItems[selectedIndex].action()
          setOpen(false)
        }
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    },
    [flatItems, selectedIndex],
  )

  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`,
      )
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onKeyDown={handleKeyDown}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-xl animate-scale-in rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center border-b border-slate-100 px-4">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, actions, and more..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            className="flex-1 border-0 bg-transparent px-3 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:flex">
            ESC
          </kbd>
        </div>

        <div ref={resultsRef} className="max-h-[360px] overflow-y-auto p-2">
          {grouped.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Search className="mb-2 h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No results found</p>
              <p className="text-xs text-slate-400">
                Try a different search term
              </p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.category} className="mb-2 last:mb-0">
                <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {group.category}
                </p>
                {group.items.map((item) => {
                  const flatIdx = flatItems.findIndex(
                    (i) => i.id === item.id,
                  )
                  const selected = flatIdx === selectedIndex

                  return (
                    <button
                      key={item.id}
                      data-index={flatIdx}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                        selected
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-slate-700 hover:bg-slate-50',
                      )}
                      onClick={() => {
                        item.action()
                        setOpen(false)
                      }}
                      onMouseEnter={() => setSelectedIndex(flatIdx)}
                    >
                      <item.icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          selected ? 'text-primary-500' : 'text-slate-400',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'font-medium',
                            selected && 'text-primary-700',
                          )}
                        >
                          {item.label}
                        </p>
                        <p
                          className={cn(
                            'text-xs',
                            selected
                              ? 'text-primary-500'
                              : 'text-slate-400',
                          )}
                        >
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight
                        className={cn(
                          'h-4 w-4 shrink-0 opacity-0 transition-opacity',
                          selected && 'opacity-100',
                        )}
                      />
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {grouped.length > 0 && (
          <div className="flex items-center gap-4 border-t border-slate-100 px-4 py-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px]">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px]">
                ⏎
              </kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px]">
                Esc
              </kbd>
              <span>Close</span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
