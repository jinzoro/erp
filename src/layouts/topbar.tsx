import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import {
  Menu,
  Search,
  Command,
  Sun,
  Moon,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { NotificationsDropdown } from './notifications-dropdown'
import { UserMenu } from './user-menu'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useUIStore()
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)

  const pathParts = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = pathParts.map((part, index) => ({
    label: part
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    path: '/' + pathParts.slice(0, index + 1).join('/'),
  }))

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {breadcrumbs.length > 0 && (
          <nav className="hidden items-center gap-2 text-sm sm:flex">
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 transition-colors hover:text-slate-600"
            >
              Home
            </button>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                <button
                  onClick={() => navigate(crumb.path)}
                  className={cn(
                    'whitespace-nowrap transition-colors',
                    i === breadcrumbs.length - 1
                      ? 'font-medium text-slate-900'
                      : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  {crumb.label}
                </button>
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div
          ref={searchRef}
          className={cn(
            'relative transition-all duration-200',
            searchFocused ? 'w-56 sm:w-72' : 'w-40 sm:w-48',
          )}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <button
          onClick={() =>
            window.dispatchEvent(new CustomEvent('open-command-palette'))
          }
          className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-100 sm:flex"
        >
          <Command className="h-3.5 w-3.5" />
          <span>K</span>
        </button>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <NotificationsDropdown />

        <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
          <Plus className="h-5 w-5" />
        </button>

        <UserMenu />
      </div>
    </header>
  )
}
