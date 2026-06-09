// lib/api/auth.api.ts
// All auth-related API calls live here (Component → Action → Api pattern)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// ── Types ──────────────────────────────────────────────────────────────────
export interface RegisterPayload {
  fullName: string
  email: string
  phone: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  fullName: string
  email: string
  phone: string
}

export interface RegisterResponse {
  message: string
  user: AuthUser
}

export interface LoginResponse {
  message: string
  accessToken: string
  user: AuthUser
}

export interface ApiError {
  message: string | string[]
  statusCode: number
  error?: string
}

// ── Helper ─────────────────────────────────────────────────────────────────
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json()
  if (!res.ok) {
    const err = data as ApiError
    // NestJS validation errors come as an array — join them for display
    const msg = Array.isArray(err.message)
      ? err.message.join(', ')
      : err.message
    throw new Error(msg || 'Something went wrong')
  }
  return data as T
}

// ── Register ───────────────────────────────────────────────────────────────
export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<RegisterResponse>(res)
}

// ── Login ──────────────────────────────────────────────────────────────────
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<LoginResponse>(res)
}