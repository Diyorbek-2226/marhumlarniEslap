"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  token: string | null
  setToken: (token: string | null) => void
  isAuthenticated: boolean
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
    }),
    {
      name: "auth-storage",
    }
  )
)