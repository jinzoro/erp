import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetupStore } from '@/store/setupStore'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Building2, Settings, DollarSign, ShoppingCart, Users, Package, Factory,
  UserCheck, Briefcase, Truck, Globe, Check, ChevronRight, ChevronLeft,
  Eye, EyeOff, AlertCircle, Mail, Lock, User, Database, ShieldCheck,
} from 'lucide-react'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CNY', 'BRL', 'AUD', 'CAD']

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney',
]

const ALL_MODULES = [
  { id: 'core', name: 'Core Platform', description: 'Users, roles, companies, settings', icon: 'Settings' },
  { id: 'finance', name: 'Finance & Accounting', description: 'Chart of accounts, GL, AP, AR, reports', icon: 'DollarSign' },
  { id: 'procurement', name: 'Procurement', description: 'Vendors, POs, goods receipt', icon: 'ShoppingCart' },
  { id: 'sales', name: 'Sales & CRM', description: 'Leads, opportunities, orders, tickets', icon: 'Users' },
  { id: 'inventory', name: 'Inventory & Warehouse', description: 'Items, warehouses, stock movements', icon: 'Package' },
  { id: 'manufacturing', name: 'Manufacturing', description: 'BOM, work orders, quality', icon: 'Factory' },
  { id: 'hr', name: 'HR & Payroll', description: 'Employees, attendance, leave, payroll', icon: 'UserCheck' },
  { id: 'projects', name: 'Project Management', description: 'Projects, tasks, timesheets', icon: 'Briefcase' },
  { id: 'supply-chain', name: 'Supply Chain', description: 'Logistics, shipments, tracking', icon: 'Truck' },
] as const

const STEPS = [
  { label: 'Welcome', subtitle: 'Language & preferences' },
  { label: 'Company', subtitle: 'Business information' },
  { label: 'Admin', subtitle: 'Administrator account' },
  { label: 'Modules', subtitle: 'Feature selection' },
  { label: 'Install', subtitle: 'Review & install' },
]

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings, DollarSign, ShoppingCart, Users, Package, Factory,
  UserCheck, Briefcase, Truck,
}

function getPasswordStrength(password: string): { score: number; label: string; color: string; width: string } {
  if (!password) return { score: 0, label: '', color: '', width: '0%' }
  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  const map = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500']
  const widths = ['0%', '20%', '40%', '60%', '80%', '100%']
  return { score, label: map[score], color: colors[score], width: widths[score] }
}

function generateCompanyCode(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 10)
}

export function SetupPage() {
  const navigate = useNavigate()
  const store = useSetupStore()
  const registerUser = useAuthStore((s) => s.registerUser)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [installing, setInstalling] = useState(false)
  const [installError, setInstallError] = useState('')
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const strength = useMemo(() => getPasswordStrength(store.adminPassword), [store.adminPassword])

  function handleCompanyNameChange(name: string) {
    store.updateCompany({ companyName: name, companyCode: generateCompanyCode(name) })
  }

  function toggleModule(id: string) {
    const next = store.enabledModules.includes(id)
      ? store.enabledModules.filter((m) => m !== id)
      : [...store.enabledModules, id]
    store.setEnabledModules(next)
  }

  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {}
    switch (step) {
      case 1:
        if (!store.companyName.trim()) newErrors.companyName = 'Company name is required'
        if (!store.companyCode.trim()) newErrors.companyCode = 'Company code is required'
        break
      case 2:
        if (!store.adminName.trim()) newErrors.adminName = 'Admin name is required'
        if (!store.adminEmail.trim()) newErrors.adminEmail = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.adminEmail)) newErrors.adminEmail = 'Invalid email format'
        if (!store.adminPassword) newErrors.adminPassword = 'Password is required'
        else if (store.adminPassword.length < 6) newErrors.adminPassword = 'Minimum 6 characters'
        if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
        else if (store.adminPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
        break
      case 3:
        if (store.enabledModules.length === 0) newErrors.modules = 'Select at least one module'
        break
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (validateStep(store.step)) {
      setDirection('forward')
      store.setStep(store.step + 1)
      setErrors({})
      setInstallError('')
    }
  }

  function handleBack() {
    setDirection('backward')
    store.setStep(store.step - 1)
    setErrors({})
    setInstallError('')
  }

  async function handleInstall() {
    setInstalling(true)
    setInstallError('')
    try {
      registerUser({
        name: store.adminName,
        email: store.adminEmail,
        password: store.adminPassword,
      })

      if (store.loadDemoData) {
        await new Promise((r) => setTimeout(r, 500))
      }

      store.completeSetup()
      navigate('/login', { state: { setupComplete: true } })
    } catch (err) {
      setInstallError(err instanceof Error ? err.message : 'Installation failed')
    } finally {
      setInstalling(false)
    }
  }

  function renderWelcomeStep() {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome to Acme ERP</h2>
        <p className="mt-2 max-w-md text-sm text-slate-300 leading-relaxed">
          This wizard will guide you through setting up your ERP system.
          Configure your company, create the administrator account, and choose
          the modules that fit your business.
        </p>

        <div className="mt-8 w-full max-w-xs">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Globe className="h-5 w-5 text-slate-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-white">English (US)</p>
              <p className="text-xs text-slate-400">Language selection</p>
            </div>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10">
          <input
            type="checkbox"
            checked={store.loadDemoData}
            onChange={(e) => useSetupStore.setState({ loadDemoData: e.target.checked })}
            className="h-5 w-5 rounded border-white/30 bg-white/10 text-indigo-600 focus:ring-indigo-500/40"
          />
          <div className="text-left">
            <span className="flex items-center gap-2 text-sm font-medium text-white">
              <Database className="h-4 w-4 text-indigo-400" />
              Load Demo Data
            </span>
            <p className="text-xs text-slate-400">Pre-populate the system with sample companies, transactions, and users</p>
          </div>
        </label>
      </div>
    )
  }

  function renderCompanyStep() {
    return (
      <div className="space-y-5">
        <Input
          label="Company Name"
          placeholder="e.g. Acme Corporation"
          value={store.companyName}
          onChange={(e) => handleCompanyNameChange(e.target.value)}
          error={errors.companyName}
          leftIcon={<Building2 className="h-4 w-4" />}
          variant="glass"
        />
        <Input
          label="Company Code"
          placeholder="AUTO-GENERATED"
          value={store.companyCode}
          onChange={(e) => store.updateCompany({ companyCode: e.target.value.toUpperCase().slice(0, 10) })}
          error={errors.companyCode}
          variant="glass"
        />
        <Input
          label="Tax ID / VAT Number"
          placeholder="Optional"
          value={store.companyTaxId}
          onChange={(e) => store.updateCompany({ companyTaxId: e.target.value })}
          variant="glass"
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Default Currency"
            value={store.companyCurrency}
            onChange={(e) => store.updateCompany({ companyCurrency: e.target.value })}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="Timezone"
            value={store.companyTimezone}
            onChange={(e) => store.updateCompany({ companyTimezone: e.target.value })}
            options={TIMEZONES.map((t) => ({ value: t, label: t }))}
          />
        </div>
      </div>
    )
  }

  function renderAdminStep() {
    return (
      <div className="space-y-5">
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          value={store.adminName}
          onChange={(e) => store.updateAdmin({ adminName: e.target.value })}
          error={errors.adminName}
          leftIcon={<User className="h-4 w-4" />}
          variant="glass"
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@company.com"
          value={store.adminEmail}
          onChange={(e) => store.updateAdmin({ adminEmail: e.target.value })}
          error={errors.adminEmail}
          leftIcon={<Mail className="h-4 w-4" />}
          variant="glass"
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Minimum 6 characters"
          value={store.adminPassword}
          onChange={(e) => store.updateAdmin({ adminPassword: e.target.value })}
          error={errors.adminPassword}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-300" tabIndex={-1}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          variant="glass"
        />
        {store.adminPassword && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Password strength</span>
              <span className={cn('font-medium', strength.color.replace('bg-', 'text-'))}>{strength.label}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className={cn('h-full rounded-full transition-all duration-300', strength.color)} style={{ width: strength.width }} />
            </div>
          </div>
        )}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 hover:text-slate-300" tabIndex={-1}>
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          variant="glass"
        />
      </div>
    )
  }

  function renderModulesStep() {
    return (
      <div>
        {errors.modules && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-300" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.modules}
          </div>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ALL_MODULES.map((mod) => {
            const enabled = store.enabledModules.includes(mod.id)
            const Icon = MODULE_ICONS[mod.icon] || Settings
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => toggleModule(mod.id)}
                className={cn(
                  'group relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200',
                  enabled
                    ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                  enabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-slate-400 group-hover:text-slate-300',
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm font-medium', enabled ? 'text-white' : 'text-slate-300')}>{mod.name}</span>
                    {enabled && <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{mod.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  function renderCompleteStep() {
    const currencyLabel = CURRENCIES.find((c) => c === store.companyCurrency) || store.companyCurrency
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Setup Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Company</span>
              <span className="text-white font-medium">{store.companyName}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Code</span>
              <span className="text-white font-medium">{store.companyCode}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Tax ID</span>
              <span className="text-white font-medium">{store.companyTaxId || '—'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Currency</span>
              <span className="text-white font-medium">{currencyLabel}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Timezone</span>
              <span className="text-white font-medium">{store.companyTimezone}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Admin</span>
              <span className="text-white font-medium">{store.adminName}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Email</span>
              <span className="text-white font-medium">{store.adminEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Modules</span>
              <span className="text-white font-medium">{store.enabledModules.length} selected</span>
            </div>
          </div>
        </div>

        {store.loadDemoData && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <Database className="h-5 w-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300">Demo data will be loaded after installation</p>
          </div>
        )}

        {installError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-300" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {installError}
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          loading={installing}
          onClick={handleInstall}
        >
          {installing ? 'Installing...' : 'Install Acme ERP'}
        </Button>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]">
        <defs>
          <pattern id="setup-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#setup-grid)" />
      </svg>

      <Card
        variant="glass"
        padding="none"
        className="relative z-10 mx-4 w-full max-w-2xl px-8 py-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Acme ERP</h1>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex flex-1 flex-col items-center">
                <div className="flex items-center w-full">
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300',
                    i < store.step ? 'bg-emerald-500 text-white' :
                    i === store.step ? 'bg-indigo-500 text-white ring-2 ring-indigo-400/50' :
                    'bg-white/10 text-slate-400',
                  )}>
                    {i < store.step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn(
                      'mx-1 h-0.5 flex-1 transition-colors duration-300',
                      i < store.step ? 'bg-emerald-500/60' : 'bg-white/10',
                    )} />
                  )}
                </div>
                <span className={cn(
                  'mt-1.5 text-xs whitespace-nowrap transition-colors duration-300',
                  i === store.step ? 'text-white font-medium' : 'text-slate-500',
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div key={store.step} className={direction === 'forward' ? 'animate-slide-up' : 'animate-slide-down'}>
          {store.step === 0 && renderWelcomeStep()}
          {store.step === 1 && renderCompanyStep()}
          {store.step === 2 && renderAdminStep()}
          {store.step === 3 && renderModulesStep()}
          {store.step === 4 && renderCompleteStep()}
        </div>

        {store.step < 4 && (
          <div className="mt-8 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={store.step === 0}
              className={store.step === 0 ? 'invisible' : ''}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            <div className="text-xs text-slate-500">
              Step {store.step + 1} of {STEPS.length - 1}
            </div>
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
