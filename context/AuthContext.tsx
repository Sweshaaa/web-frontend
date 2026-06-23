'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import Cookies from 'js-cookie'
import { authAPI, User } from '@/lib/api/auth.api'

// ── Types ──────────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  refreshUser: () => Promise<User>
}

// ── Context ────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount by calling whoami with stored token
  const checkSession = useCallback(async () => {
    const token = Cookies.get('accessToken')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const userData = await authAPI.whoami()
      setUser(userData)
    } catch {
      // Token invalid or expired — clear it
      Cookies.remove('accessToken')
      Cookies.remove('user')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  // ── Actions ────────────────────────────────────────────────────────────────
  const login = (userData: User, token: string) => {
    Cookies.set('accessToken', token, { expires: 7, sameSite: 'lax' })
    Cookies.set('user', JSON.stringify(userData), { expires: 7, sameSite: 'lax' })
    setUser(userData)
  }

  const logout = () => {
    Cookies.remove('accessToken')
    Cookies.remove('user')
    setUser(null)
  }

  const refreshUser = async (): Promise<User> => {
    const userData = await authAPI.whoami()
    setUser(userData)
    return userData
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}