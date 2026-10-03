import { create } from 'zustand'

export interface SetupState {
  step: number
  companyName: string
  companyCode: string
  companyTaxId: string
  companyCurrency: string
  companyTimezone: string
  adminName: string
  adminEmail: string
  adminPassword: string
  enabledModules: string[]
  completed: boolean
  loadDemoData: boolean
  setStep: (step: number) => void
  updateCompany: (data: Partial<SetupState>) => void
  updateAdmin: (data: Partial<SetupState>) => void
  setEnabledModules: (modules: string[]) => void
  completeSetup: () => void
  isSetupComplete: () => boolean
  reset: () => void
}

export const useSetupStore = create<SetupState>((set, get) => ({
  step: 0,
  companyName: '',
  companyCode: '',
  companyTaxId: '',
  companyCurrency: 'USD',
  companyTimezone: 'UTC',
  adminName: '',
  adminEmail: '',
  adminPassword: '',
  enabledModules: ['core', 'finance', 'procurement', 'sales', 'inventory', 'hr'],
  completed: localStorage.getItem('erp_setup_complete') === 'true',
  loadDemoData: false,
  setStep: (step) => set({ step }),
  updateCompany: (data) => set((s) => ({ ...s, ...data })),
  updateAdmin: (data) => set((s) => ({ ...s, ...data })),
  setEnabledModules: (modules) => set({ enabledModules: modules }),
  completeSetup: () => {
    localStorage.setItem('erp_setup_complete', 'true')
    localStorage.setItem('erp_config', JSON.stringify({
      companyName: get().companyName,
      companyCode: get().companyCode,
      companyTaxId: get().companyTaxId,
      companyCurrency: get().companyCurrency,
      companyTimezone: get().companyTimezone,
      enabledModules: get().enabledModules,
    }))
    set({ completed: true })
  },
  isSetupComplete: () => localStorage.getItem('erp_setup_complete') === 'true',
  reset: () => {
    localStorage.removeItem('erp_setup_complete')
    localStorage.removeItem('erp_config')
    localStorage.removeItem('erp_users')
    set({
      step: 0, companyName: '', companyCode: '', companyTaxId: '',
      companyCurrency: 'USD', companyTimezone: 'UTC',
      adminName: '', adminEmail: '', adminPassword: '',
      enabledModules: ['core', 'finance', 'procurement', 'sales', 'inventory', 'hr'],
      completed: false, loadDemoData: false,
    })
  },
}))
