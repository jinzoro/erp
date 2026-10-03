import { create } from 'zustand'
import type { Notification } from '@/types'
import { generateId } from '@/lib/utils'

export type Theme = 'light' | 'dark'

export interface UIState {
  sidebarCollapsed: boolean
  theme: Theme
  currentModule: string
  notifications: Notification[]
  toggleSidebar: () => void
  setTheme: (theme: Theme) => void
  setCurrentModule: (module: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  theme: 'light',
  currentModule: 'dashboard',
  notifications: [],

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setTheme: (theme) => set({ theme }),

  setCurrentModule: (currentModule) => set({ currentModule }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: generateId(),
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),
}))
