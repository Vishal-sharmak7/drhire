'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { Building2, Stethoscope } from 'lucide-react';

export default function CompleteOAuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role') === 'hospital' ? 'hospital' : 'doctor';
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    licenseNumber: '',
    hospitalName: '',
    location: '',
    description: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload =
        role === 'hospital'
          ? {
              hospitalName: formData.hospitalName,
              location: formData.location,
              description: formData.description,
            }
          : {
              name: formData.name,
              specialization: formData.specialization,
              experience: Number(formData.experience),
              licenseNumber: formData.licenseNumber,
            };

      await api.post('/api/auth/oauth/complete', payload);
      router.push(role === 'hospital' ? '/hospital/dashboard' : '/doctor/dashboard');
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || 'Could not complete registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[#f7f7f7] px-4 py-12">
      <div className="mx-auto max-w-xl rounded-md border border-[#d9d9d9] bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#eef3fe] text-[#2557a7]">
            {role === 'hospital' ? <Building2 className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#2d2d2d]">Complete your {role} profile</h1>
            <p className="text-sm text-[#595959]">Add the required details to finish your Google sign up.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'hospital' ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2d2d2d]">Hospital name</label>
                <input
                  required
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Apollo Hospital"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2d2d2d]">Location</label>
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input"
                  placeholder="Mumbai, Maharashtra"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2d2d2d]">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input min-h-28 resize-none"
                  placeholder="Briefly describe your institution"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2d2d2d]">Full name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Dr. Ananya Sharma"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2d2d2d]">Specialization</label>
                <input
                  required
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="input"
                  placeholder="Cardiology"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2d2d2d]">Years of experience</label>
                <input
                  required
                  type="number"
                  min="0"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="input"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2d2d2d]">Medical license number</label>
                <input
                  required
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="input"
                  placeholder="MCI-123456"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-[#2557a7] px-5 py-3 font-semibold text-white hover:bg-[#164081] disabled:opacity-60"
          >
            {submitting ? 'Finishing...' : 'Finish registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
