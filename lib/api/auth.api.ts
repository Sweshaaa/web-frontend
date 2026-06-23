import Cookies from 'js-cookie'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// ── Base request helper ────────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // use the same cookie name everywhere
  const token = Cookies.get('accessToken')

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // Do not set Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong.')
  }

  return data as T
}

// ── Types ──────────────────────────────────────────────────────────────────────
export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  createdAt?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success?: boolean
  message?: string
  accessToken: string
  user: User
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// ── Auth functions used by login/register pages ───────────────────────────────
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ── Auth API object used by profile/password pages ────────────────────────────
export const authAPI = {
  // GET /api/auth/whoami
  whoami: async (): Promise<User> => {
    const res = await request<ApiResponse<User>>('/auth/whoami')
    return res.data
  },

  // PATCH /api/auth/update — profile fields + optional avatar file
  updateProfile: async (formData: FormData): Promise<User> => {
    const res = await request<ApiResponse<User>>('/auth/update', {
      method: 'PATCH',
      body: formData,
    })
    return res.data
  },

  // PATCH password update
  updatePassword: async (payload: {
    currentPassword: string
    newPassword: string
  }): Promise<{ success: boolean; message: string }> => {
    const fd = new FormData()
    fd.append('currentPassword', payload.currentPassword)
    fd.append('newPassword', payload.newPassword)

    return request('/auth/update', {
      method: 'PATCH',
      body: fd,
    })
  },
}