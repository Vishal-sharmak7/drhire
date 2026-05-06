'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import RoleRoute from '@/components/RoleRoute';
import { ArrowLeft, Save, Building2, Mail, MapPin, FileText, CheckCircle2 } from 'lucide-react';

export default function HospitalEditProfilePage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    hospitalName: '',
    email: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/hospitals/profile');
        setFormData({
          hospitalName: data.hospitalName || '',
          email: data.email || '',
          location: data.location || '',
          description: data.description || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await api.put('/api/hospitals/update', formData);
      setUser({ ...user, ...data });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => router.push('/hospital/dashboard'), 1500);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <RoleRoute allowedRoles={['hospital']}>
      <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/hospital/dashboard')}
              className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-[var(--color-text-secondary)]" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Edit Profile</h1>
              <p className="text-[var(--color-text-secondary)]">Update your hospital information</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="card card-hover p-8 fade-in">
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hospital Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[var(--color-text-muted)]" />
                    Hospital Name
                  </div>
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. Apollo Hospital"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="hospital@example.com"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[var(--color-text-muted)]" />
                    Location
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. New Delhi, India"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[var(--color-text-muted)]" />
                    Description
                  </div>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input resize-none"
                  placeholder="Describe your hospital, its specialties, and what makes it unique..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/hospital/dashboard')}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary flex-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Save className="h-5 w-5" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </RoleRoute>
  );
}