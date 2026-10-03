import {
  LayoutDashboard,
  type LucideIcon,
  Building2,
  Wallet,
  ShoppingCart,
  ChartLine,
  Warehouse,
  Users,
  Briefcase,
  FileText,
} from 'lucide-react'

export const MODULES = [
  { id: 'dashboard', name: 'Dashboard', description: 'Overview and analytics', icon: 'LayoutDashboard', enabled: true },
  { id: 'admin', name: 'Administration', description: 'Manage users, roles, and company settings', icon: 'Building2', enabled: true },
  { id: 'finance', name: 'Finance', description: 'Accounting, invoicing, and payments', icon: 'Wallet', enabled: true },
  { id: 'procurement', name: 'Procurement', description: 'Purchase orders and vendor management', icon: 'ShoppingCart', enabled: true },
  { id: 'sales', name: 'Sales', description: 'CRM, quotations, and sales orders', icon: 'ChartLine', enabled: true },
  { id: 'inventory', name: 'Inventory', description: 'Products, warehouses, and stock control', icon: 'Warehouse', enabled: true },
  { id: 'hr', name: 'HR', description: 'Employees, payroll, and attendance', icon: 'Users', enabled: true },
  { id: 'projects', name: 'Projects', description: 'Project and task management', icon: 'Briefcase', enabled: true },
  { id: 'reports', name: 'Reports', description: 'Business intelligence and reporting', icon: 'FileText', enabled: true },
] as const

export const DOCUMENT_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' },
  { value: 'completed', label: 'Completed', color: 'blue' },
] as const

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
] as const

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
] as const

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: '+00:00' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)', offset: '-05:00' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)', offset: '-06:00' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)', offset: '-07:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)', offset: '-08:00' },
  { value: 'America/Sao_Paulo', label: 'Brasilia Time', offset: '-03:00' },
  { value: 'America/Mexico_City', label: 'Central Mexico', offset: '-06:00' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina Time', offset: '-03:00' },
  { value: 'Europe/London', label: 'London (GMT)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Central European Time', offset: '+01:00' },
  { value: 'Europe/Berlin', label: 'Central European Time (Berlin)', offset: '+01:00' },
  { value: 'Europe/Moscow', label: 'Moscow Time', offset: '+03:00' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time', offset: '+04:00' },
  { value: 'Asia/Kolkata', label: 'India Standard Time', offset: '+05:30' },
  { value: 'Asia/Shanghai', label: 'China Standard Time', offset: '+08:00' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time', offset: '+09:00' },
  { value: 'Asia/Singapore', label: 'Singapore Time', offset: '+08:00' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong Time', offset: '+08:00' },
  { value: 'Asia/Seoul', label: 'Korean Standard Time', offset: '+09:00' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time', offset: '+10:00' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time', offset: '+12:00' },
  { value: 'Africa/Cairo', label: 'Eastern European Time (Cairo)', offset: '+02:00' },
  { value: 'Africa/Johannesburg', label: 'South Africa Standard Time', offset: '+02:00' },
  { value: 'Africa/Lagos', label: 'West Africa Time', offset: '+01:00' },
] as const

export const PAYMENT_TERMS = [
  { value: 'due_on_receipt', label: 'Due on Receipt', days: 0 },
  { value: 'net_15', label: 'Net 15', days: 15 },
  { value: 'net_30', label: 'Net 30', days: 30 },
  { value: 'net_45', label: 'Net 45', days: 45 },
  { value: 'net_60', label: 'Net 60', days: 60 },
  { value: 'net_90', label: 'Net 90', days: 90 },
  { value: '2_10_net_30', label: '2/10 Net 30', days: 30 },
] as const

export interface SidebarItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
  children?: SidebarItem[]
}

export interface SidebarSection {
  label: string
  items: SidebarItem[]
}

export const SIDEBAR_NAV: SidebarSection[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Roles', href: '/admin/roles', icon: Building2 },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Dashboard', href: '/finance', icon: Wallet },
      { label: 'Chart of Accounts', href: '/finance/accounts', icon: Wallet },
      { label: 'Journal Entries', href: '/finance/journal', icon: FileText },
      { label: 'Invoices', href: '/finance/invoices', icon: FileText },
      { label: 'Bills', href: '/finance/bills', icon: FileText },
      { label: 'Payments', href: '/finance/payments', icon: Wallet },
      { label: 'Budgets', href: '/finance/budgets', icon: Wallet },
      { label: 'Tax Rates', href: '/finance/taxes', icon: FileText },
    ],
  },
  {
    label: 'Procurement',
    items: [
      { label: 'Dashboard', href: '/procurement', icon: ShoppingCart },
      { label: 'Vendors', href: '/procurement/vendors', icon: Building2 },
      { label: 'Requisitions', href: '/procurement/requisitions', icon: FileText },
      { label: 'Purchase Orders', href: '/procurement/orders', icon: ShoppingCart },
      { label: 'Goods Receipt', href: '/procurement/goods-receipt', icon: Warehouse },
      { label: 'Contracts', href: '/procurement/contracts', icon: FileText },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Dashboard', href: '/sales', icon: ChartLine },
      { label: 'Leads', href: '/sales/leads', icon: Users },
      { label: 'Opportunities', href: '/sales/opportunities', icon: ChartLine },
      { label: 'Quotations', href: '/sales/quotations', icon: FileText },
      { label: 'Sales Orders', href: '/sales/orders', icon: ShoppingCart },
      { label: 'Customers', href: '/sales/customers', icon: Users },
      { label: 'Support Tickets', href: '/sales/tickets', icon: FileText },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { label: 'Dashboard', href: '/inventory', icon: Warehouse },
      { label: 'Products', href: '/inventory/products', icon: Warehouse },
      { label: 'Categories', href: '/inventory/categories', icon: FileText },
      { label: 'Warehouses', href: '/inventory/warehouses', icon: Building2 },
      { label: 'Stock Movements', href: '/inventory/movements', icon: Warehouse },
      { label: 'Transfers', href: '/inventory/transfers', icon: Warehouse },
      { label: 'Cycle Counts', href: '/inventory/cycle-counts', icon: FileText },
    ],
  },
  {
    label: 'Human Resources',
    items: [
      { label: 'Dashboard', href: '/hr', icon: Users },
      { label: 'Employees', href: '/hr/employees', icon: Users },
      { label: 'Attendance', href: '/hr/attendance', icon: FileText },
      { label: 'Leaves', href: '/hr/leaves', icon: FileText },
      { label: 'Payroll', href: '/hr/payroll', icon: Wallet },
      { label: 'Expense Claims', href: '/hr/expenses', icon: Wallet },
      { label: 'Recruitment', href: '/hr/recruitment', icon: Users },
    ],
  },
  {
    label: 'Projects',
    items: [
      { label: 'Dashboard', href: '/projects', icon: Briefcase },
      { label: 'Projects', href: '/projects/list', icon: Briefcase },
      { label: 'Tasks', href: '/projects/tasks', icon: FileText },
      { label: 'Timesheets', href: '/projects/timesheets', icon: FileText },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Financial Reports', href: '/reports/financial', icon: FileText },
      { label: 'Sales Reports', href: '/reports/sales', icon: ChartLine },
      { label: 'Purchase Reports', href: '/reports/purchase', icon: ShoppingCart },
      { label: 'Inventory Reports', href: '/reports/inventory', icon: Warehouse },
      { label: 'HR Reports', href: '/reports/hr', icon: Users },
    ],
  },
]
