'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface User {
  id: string
  fullName: string
  email: string
  phone: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = Cookies.get('accessToken')
    const userData = Cookies.get('user')

    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        router.push('/login')
      }
    }
  }, [router])

  const handleLogout = () => {
    Cookies.remove('accessToken')
    Cookies.remove('user')
    router.push('/login')
  }

  if (!user) return null

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.avatar}>
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <h1 style={styles.welcome}>Welcome back, {user.fullName.split(' ')[0]}! 👋</h1>
        <p style={styles.subtitle}>You&apos;re successfully logged into BikeRent</p>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Full Name</span>
            <span style={styles.infoValue}>{user.fullName}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Email</span>
            <span style={styles.infoValue}>{user.email}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Phone</span>
            <span style={styles.infoValue}>{user.phone}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>User ID</span>
            <span style={styles.infoValue}>{user.id}</span>
          </div>
        </div>

        <div style={styles.badge}>✅ JWT stored in cookie — Sprint 2 Complete</div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
    padding: '2rem',
  },
  card: {
    background: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '16px',
    padding: '2.5rem',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    color: '#fff',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #e53e3e, #c53030)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 700,
    margin: '0 auto 1.5rem',
    color: '#fff',
  },
  welcome: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#fff',
  },
  subtitle: {
    color: '#999',
    marginBottom: '2rem',
    fontSize: '0.9rem',
  },
  infoGrid: {
    display: 'grid',
    gap: '1rem',
    textAlign: 'left',
    marginBottom: '1.5rem',
  },
  infoItem: {
    background: '#2a2a2a',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  infoLabel: {
    color: '#666',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  infoValue: {
    color: '#e2e2e2',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  badge: {
    background: '#0d2b0d',
    border: '1px solid #1a5c1a',
    color: '#4ade80',
    borderRadius: '8px',
    padding: '0.6rem 1rem',
    fontSize: '0.8rem',
    marginBottom: '1.5rem',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #444',
    color: '#999',
    borderRadius: '8px',
    padding: '0.6rem 1.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
}