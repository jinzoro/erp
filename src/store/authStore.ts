import { create } from 'zustand'
import type { User } from '@/types'

export interface StoredUser {
  id: string
  name: string
  email: string
  password: string
  role: string
  companyId: string
  isActive: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  registerUser: (data: { name: string; email: string; password: string; role?: string }) => StoredUser
  getUsers: () => StoredUser[]
  getUserByEmail: (email: string) => StoredUser | undefined
  getCurrentUser: () => User | null
}

function loadUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem('erp_users') || '[]')
  } catch { return [] }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem('erp_users', JSON.stringify(users))
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const users = loadUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    if (!found.isActive) throw new Error('Account is deactivated')
    const user: User = {
      id: found.id,
      email: found.email,
      name: found.name,
      roleId: found.role,
      companyId: found.companyId || '1',
      branchIds: [],
      isActive: found.isActive,
      createdAt: found.createdAt,
    }
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  registerUser: (data) => {
    const users = loadUsers()
    const existing = users.find((u) => u.email === data.email)
    if (existing) throw new Error('Email already registered')
    const newUser: StoredUser = {
      id: generateId(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'admin',
      companyId: '1',
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsers(users)
    return newUser
  },

  getUsers: () => loadUsers(),

  getUserByEmail: (email: string) => {
    return loadUsers().find((u) => u.email === email)
  },

  getCurrentUser: () => get().user,
}))
