import styles from './AuthLayout.module.css'
import Image from 'next/image'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.formSide}>
        {children}
      </div>

      <div className={styles.heroSide}>
        <div className={styles.heroContent}>

          <div className={styles.bikeContainer}>
            <div className={styles.bikeGlow} />

            <Image
              src="/bike.png"
              width={500}
              height={300}
              alt="Premium Motorcycle"
              className={styles.bikeImage}
            />
          </div>

          <div className={styles.waveBottom} />
        </div>
      </div>
    </div>
  )
}