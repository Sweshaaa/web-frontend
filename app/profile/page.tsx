'use client';

import { useState, useRef, useEffect } from 'react';

import Link from 'next/link';

import { authAPI } from '@/lib/api/auth.api';
import { profileSchema, ProfileFormData } from '@/lib/validations/auth.schemas';
import styles from './profile.module.css';

import { ZodObject, ZodString } from 'zod';
import { $strip } from 'zod/v4/core';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_AVATAR = '/default-avatar.png';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Pre-fill form once user is available from context
  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email });
    }
  }, [user, reset]);

  // ── File picker ────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setServerError('Please select an image file (JPEG, PNG, WEBP, GIF).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setServerError('Image must be smaller than 5 MB.');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setServerError('');
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: ProfileFormData) => {
    setServerError('');
    setSuccessMsg('');
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('email', data.email);
      if (avatarFile) fd.append('avatar', avatarFile);

      await authAPI.updateProfile(fd);
      await refreshUser(); // sync context
      setAvatarFile(null);
      setSuccessMsg('Profile updated successfully!');
    } catch (err: any) {
      setServerError(err.message || 'Failed to update profile.');
    }
  };

  const avatarSrc =
    avatarPreview ||
    (user?.avatar ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${user.avatar}` : DEFAULT_AVATAR);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Profile</h1>
          <Link href="/profile/password" className={styles.passwordLink}>
            Change password →
          </Link>
        </div>

        {/* ── Avatar picker ────────────────────────────────────────────────── */}
        <div className={styles.avatarSection}>
          <button
            type="button"
            className={styles.avatarBtn}
            onClick={() => fileRef.current?.click()}
            aria-label="Change profile photo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt="Profile"
              className={styles.avatarImg}
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
              }}
            />
            <span className={styles.avatarOverlay}>Change photo</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
          <p className={styles.avatarHint}>Click to upload · Max 5 MB</p>
          {avatarFile && (
            <p className={styles.avatarFileName}>📎 {avatarFile.name}</p>
          )}
        </div>

        {/* ── Status messages ───────────────────────────────────────────────── */}
        {successMsg && <div className={`${styles.banner} ${styles.success}`}>{successMsg}</div>}
        {serverError && <div className={`${styles.banner} ${styles.error}`}>{serverError}</div>}

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Full name</label>
            <input
              id="name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Your name"
              {...register('name')}
            />
            {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
function useForm<T>(arg0: { resolver: any; }): { register: any; handleSubmit: any; reset: any; formState: { errors: any; isSubmitting: any; }; } {
    throw new Error('Function not implemented.');
}

function zodResolver(profileSchema: ZodObject<{ name: ZodString; email: ZodString; }, $strip>): any {
    throw new Error('Function not implemented.');
}

