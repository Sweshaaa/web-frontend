'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.brand}>
        <div className={styles.logoMark}>
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
            <ellipse cx="8" cy="20" rx="7" ry="7" stroke="#2563EB" strokeWidth="2.5"/>
            <ellipse cx="28" cy="20" rx="7" ry="7" stroke="#2563EB" strokeWidth="2.5"/>
            <path d="M8 20 L14 8 L22 8 L28 20" stroke="#2563EB" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
            <path d="M14 8 L18 4 L24 8" stroke="#1D4ED8" strokeWidth="2" strokeLinejoin="round" fill="none"/>
            <circle cx="22" cy="10" r="2" fill="#2563EB"/>
          </svg>
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>BIKE</span>
          <span className={styles.brandAccent}>RENT</span>
        </div>
      </Link>

      <ul className={styles.navLinks}>
        <li><Link href="#" className={styles.navLink}>Home</Link></li>
        <li><Link href="#" className={styles.navLink}>Available</Link></li>
        <li><Link href="#" className={styles.navLink}>Favourite</Link></li>
        <li><Link href="#" className={styles.navLink}>About Us</Link></li>
      </ul>

      <div className={styles.authButtons}>
        <Link
          href="/login"
          className={`${styles.btnLogin} ${pathname === '/login' ? styles.active : ''}`}
        >
          Login
        </Link>
        <Link
          href="/register"
          className={`${styles.btnSignup} ${pathname === '/register' ? styles.activeSignup : ''}`}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  )
}
