'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (user) {
    if (user.role === 'admin') router.replace('/admin/dashboard');
    else if (user.role === 'hospital') router.replace('/hospital/dashboard');
    else router.replace('/doctor/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') router.push('/admin/dashboard');
      else if (userData.role === 'hospital') router.push('/hospital/dashboard');
      else router.push('/doctor/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)]" />

      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-md w-full relative z-10">
        {/* Glass card */}
        <div className="glass-card rounded-3xl p-8 md:p-10 fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-[var(--color-primary)] rounded-2xl blur opacity-30" />
              <div className="relative h-16 w-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Welcome back
            </h2>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              Sign in to access your DrHire account
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pr-4"
                  placeholder="doctor@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                <span className="text-[var(--color-text-secondary)]">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3.5 text-base"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">
                Don&apos;t have an account?
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="/api/auth/google?role=doctor"
              className="btn btn-secondary w-full py-3.5 text-base"
            >
              Continue with Google as Doctor
            </a>
            <a
              href="/api/auth/google?role=hospital"
              className="btn btn-secondary w-full py-3.5 text-base"
            >
              Continue with Google as Hospital
            </a>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">
                New to DrHire?
              </span>
            </div>
          </div>

          {/* Register link */}
          <Link
            href="/register"
            className="btn btn-secondary w-full py-3.5 text-base"
          >
            Create an account
          </Link>

          {/* Admin hint */}
          <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
            Admin access: Press Ctrl+1 on any page
          </p>
        </div>
      </div>
    </div>
  );
}
