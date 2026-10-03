import { create } from 'zustand'

export interface AppConfig {
  companyName: string
  companyCode: string
  companyTaxId: string
  companyCurrency: string
  companyTimezone: string
  enabledModules: string[]
}

export interface ConfigState {
  config: AppConfig | null
  loaded: boolean
  loadConfig: () => void
  getConfig: () => AppConfig | null
  isModuleEnabled: (moduleId: string) => boolean
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: null,
  loaded: false,

  loadConfig: () => {
    try {
      const raw = localStorage.getItem('erp_config')
      if (raw) {
        const config = JSON.parse(raw) as AppConfig
        set({ config, loaded: true })
      } else {
        set({ loaded: true })
      }
    } catch {
      set({ loaded: true })
    }
  },

  getConfig: () => get().config,

  isModuleEnabled: (moduleId: string) => {
    const { config } = get()
    if (!config) return true
    return config.enabledModules.includes(moduleId)
  },
}))
