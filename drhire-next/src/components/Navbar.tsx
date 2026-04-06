'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LogOut, User, Briefcase, PlusCircle, LayoutDashboard, Sun, Moon, ChevronDown, Edit, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getEditProfilePath = () => {
    if (user?.role === 'doctor') return '/doctor/edit-profile';
    if (user?.role === 'hospital') return '/hospital/edit-profile';
    return '#';
  };

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--color-primary)] rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative h-10 w-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-gradient">
                DrHire
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/jobs"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium relative group"
            >
              Find Jobs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all group-hover:w-full" />
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={`/${user.role}/dashboard`}
                  className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                {user.role === 'hospital' && (
                  <Link
                    href="/hospital/dashboard"
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Post Job
                  </Link>
                )}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="theme-toggle"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  <span className="theme-toggle-icon sun">
                    <Sun className="h-5 w-5 text-amber-500" />
                  </span>
                  <span className="theme-toggle-icon moon">
                    <Moon className="h-5 w-5 text-indigo-400" />
                  </span>
                </button>

                {/* User Dropdown */}
                <div className="relative ml-4 border-l border-[var(--color-border)] pl-4" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  >
                    <div className="h-8 w-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {user.name || user.hospitalName || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 card p-2 fade-in shadow-xl">
                      {(user.role === 'doctor' || user.role === 'hospital') && (
                        <Link
                          href={getEditProfilePath()}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                        >
                          <Edit className="h-4 w-4 text-[var(--color-text-muted)]" />
                          Edit Profile
                        </Link>
                      )}
                      <Link
                        href={`/${user.role}/dashboard`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                      >
                        <Settings className="h-4 w-4 text-[var(--color-text-muted)]" />
                        Dashboard
                      </Link>
                      <hr className="my-2 border-[var(--color-border)]" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="theme-toggle"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  <span className="theme-toggle-icon sun">
                    <Sun className="h-5 w-5 text-amber-500" />
                  </span>
                  <span className="theme-toggle-icon moon">
                    <Moon className="h-5 w-5 text-indigo-400" />
                  </span>
                </button>

                <Link
                  href="/login"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="theme-toggle-icon sun">
                <Sun className="h-5 w-5 text-amber-500" />
              </span>
              <span className="theme-toggle-icon moon">
                <Moon className="h-5 w-5 text-indigo-400" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}