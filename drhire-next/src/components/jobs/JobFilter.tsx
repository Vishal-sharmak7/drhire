'use client';

import { Search, MapPin, Briefcase } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JobFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || '');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (specialization) params.append('specialization', specialization);
    
    // We update the URL which will trigger the page to refetch jobs if we use server components
    // or trigger a useEffect in client components.
    router.push(`/?${params.toString()}`);
  };

  const specialties = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Surgery', 'General Medicine'
  ];

  return (
    <div className="bg-white dark:bg-[var(--color-bg-secondary)] rounded-2xl shadow-sm border border-[var(--color-border)] p-4 md:p-6 w-full max-w-6xl mx-auto -mt-10 relative z-20">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-gray-50 dark:bg-[var(--color-bg-tertiary)] rounded-xl px-4 py-3 border border-transparent focus-within:border-[var(--color-primary)] transition-colors">
          <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, keyword"
            className="bg-transparent w-full focus:outline-none text-[var(--color-text-primary)] placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex-1 flex items-center bg-gray-50 dark:bg-[var(--color-bg-tertiary)] rounded-xl px-4 py-3 border border-transparent focus-within:border-[var(--color-primary)] transition-colors">
          <MapPin className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or location"
            className="bg-transparent w-full focus:outline-none text-[var(--color-text-primary)] placeholder:text-gray-400"
          />
        </div>

        <div className="flex-1 flex items-center bg-gray-50 dark:bg-[var(--color-bg-tertiary)] rounded-xl px-4 py-3 border border-transparent focus-within:border-[var(--color-primary)] transition-colors">
          <Briefcase className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="bg-transparent w-full focus:outline-none text-[var(--color-text-primary)] appearance-none cursor-pointer"
          >
            <option value="">All Specialties</option>
            {specialties.map(spec => (
              <option key={spec} value={spec} className="dark:bg-[var(--color-bg-tertiary)]">{spec}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg shrink-0"
        >
          Find Jobs
        </button>
      </form>
    </div>
  );
}
