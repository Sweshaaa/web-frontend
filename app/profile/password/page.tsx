'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';
import { authAPI } from '@/lib/api/auth.api';
import { passwordSchema, PasswordFormData } from '@/lib/validations/auth.schemas';
import styles from './password.module.css';
import { ZodObject, ZodString } from 'zod';
import { $strip } from 'zod/v4/core';

// ── Password strength helper ───────────────────────────────────────────────────
function getStrength(pw: string): { label: string; level: number } | null {
  if (!pw) return null;
  if (pw.length < 6) return { label: 'Too short', level: 0 };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const score = [hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (pw.length < 8) return { label: 'Weak', level: 1 };
  if (score === 0) return { label: 'Fair', level: 2 };
  if (score === 1) return { label: 'Good', level: 3 };
  return { label: 'Strong', level: 4 };
}

export default function PasswordPage() {
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showAll, setShowAll] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const newPasswordValue = watch('newPassword', '');
  const strength = getStrength(newPasswordValue);

  const onSubmit = async (data: PasswordFormData) => {
    setServerError('');
    setSuccessMsg('');
    try {
      await authAPI.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
      setSuccessMsg('Password changed successfully!');
    } catch (err: any) {
      setServerError(err.message || 'Failed to update password.');
    }
  };

  const inputType = showAll ? 'text' : 'password';

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Change Password</h1>
            <p className={styles.subtitle}>
              Use a strong password you haven't used before.
            </p>
          </div>
          <Link href="/profile" className={styles.backLink}>
            ← Profile
          </Link>
        </div>

        {/* ── Status banners ────────────────────────────────────────────────── */}
        {successMsg && <div className={`${styles.banner} ${styles.success}`}>{successMsg}</div>}
        {serverError && <div className={`${styles.banner} ${styles.error}`}>{serverError}</div>}

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          {/* Current password */}
          <div className={styles.field}>
            <label htmlFor="currentPassword" className={styles.label}>
              Current password
            </label>
            <input
              id="currentPassword"
              type={inputType}
              autoComplete="current-password"
              className={`${styles.input} ${errors.currentPassword ? styles.inputError : ''}`}
              placeholder="Enter current password"
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <span className={styles.fieldError}>{errors.currentPassword.message}</span>
            )}
          </div>

          {/* New password + strength */}
          <div className={styles.field}>
            <label htmlFor="newPassword" className={styles.label}>
              New password
            </label>
            <input
              id="newPassword"
              type={inputType}
              autoComplete="new-password"
              className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
              placeholder="At least 6 characters"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <span className={styles.fieldError}>{errors.newPassword.message}</span>
            )}

            {strength && (
              <div className={styles.strengthRow}>
                <div className={styles.strengthTrack}>
                  <div
                    className={styles.strengthFill}
                    style={{
                      width: `${[10, 30, 55, 75, 100][strength.level]}%`,
                      background: ['#fca5a5', '#fca5a5', '#fbbf24', '#34d399', '#10b981'][strength.level],
                    }}
                  />
                </div>
                <span className={styles.strengthLabel}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type={inputType}
              autoComplete="new-password"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="Repeat new password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className={styles.fieldError}>{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Show/hide toggle */}
          <label className={styles.showToggle}>
            <input
              type="checkbox"
              checked={showAll}
              onChange={() => setShowAll((v) => !v)}
            />
            Show passwords
          </label>

          <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
function zodResolver(passwordSchema: ZodObject<{ currentPassword: ZodString; newPassword: ZodString; confirmPassword: ZodString; }, $strip>): import("react-hook-form").Resolver<{ currentPassword: string; newPassword: string; confirmPassword: string; }, any, { currentPassword: string; newPassword: string; confirmPassword: string; }> | undefined {
    throw new Error('Function not implemented.');
}

