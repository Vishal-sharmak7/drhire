'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import JobCard from '@/components/JobCard';
import { Briefcase, Filter, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import type { Job } from '@/types';

type JobFilters = {
  keyword: string;
  specialization: string;
  location: string;
  experience: string;
};

const emptyFilters: JobFilters = {
  keyword: '',
  specialization: '',
  location: '',
  experience: '',
};

export default function JobsListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    keyword: searchParams.get('keyword') || '',
    specialization: searchParams.get('specialization') || '',
    location: searchParams.get('location') || '',
    experience: searchParams.get('experience') || '',
  });

  const fetchJobs = async (nextFilters = filters) => {
    setLoading(true);
    try {
      const validFilters = Object.fromEntries(
        Object.entries(nextFilters).filter(([, value]) => value !== '')
      );
      const query = new URLSearchParams(validFilters).toString();
      router.push(query ? `/jobs?${query}` : '/jobs');
      const { data } = await api.get<Job[]>(`/api/jobs?${query}`);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filters.experience !== (searchParams.get('experience') || '')) {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.experience]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchJobs();
  };

  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    fetchJobs(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="border-b border-[#d9d9d9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-3 lg:flex-row">
            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center rounded-md border border-[#b7b7b7] bg-white px-4 py-3 focus-within:border-[#2557a7] focus-within:ring-1 focus-within:ring-[#2557a7]">
                <Search className="mr-3 h-5 w-5 text-[#595959]" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or hospital"
                  className="w-full bg-transparent text-[#2d2d2d] outline-none"
                  value={filters.keyword}
                  onChange={(event) => setFilters({ ...filters, keyword: event.target.value })}
                />
              </div>
              <div className="flex items-center rounded-md border border-[#b7b7b7] bg-white px-4 py-3 focus-within:border-[#2557a7] focus-within:ring-1 focus-within:ring-[#2557a7]">
                <MapPin className="mr-3 h-5 w-5 text-[#595959]" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  className="w-full bg-transparent text-[#2d2d2d] outline-none"
                  value={filters.location}
                  onChange={(event) => setFilters({ ...filters, location: event.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-md bg-[#2557a7] px-7 py-3 font-semibold text-white hover:bg-[#164081]"
            >
              Find jobs
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex w-full items-center justify-center rounded-md border border-[#d9d9d9] bg-white px-4 py-3 font-semibold text-[#2d2d2d]"
            >
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 rounded-full bg-[#2557a7] px-2 py-0.5 text-xs text-white">Active</span>
              )}
            </button>
          </div>

          <aside className={`lg:w-72 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 rounded-md border border-[#d9d9d9] bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-[#2d2d2d]">
                  <Filter className="h-5 w-5" />
                  Filters
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm font-semibold text-[#2557a7]"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#2d2d2d]">Experience level</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Any experience', value: '' },
                      { label: 'Entry level, up to 2 years', value: '2' },
                      { label: 'Mid level, up to 5 years', value: '5' },
                      { label: 'Senior level, up to 10 years', value: '10' },
                    ].map((level) => (
                      <label key={level.label} className="flex cursor-pointer items-center gap-3 text-[#595959]">
                        <input
                          type="radio"
                          name="experience"
                          checked={filters.experience === level.value}
                          onChange={() => handleFilterChange('experience', level.value)}
                          className="h-4 w-4"
                        />
                        <span>{level.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#e4e2e0] pt-5">
                  <h3 className="mb-3 text-sm font-semibold text-[#2d2d2d]">Specialization</h3>
                  <div className="space-y-2">
                    {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Surgery'].map((spec) => (
                      <label key={spec} className="flex cursor-pointer items-center gap-3 text-[#595959]">
                        <input
                          type="checkbox"
                          checked={filters.specialization === spec}
                          onChange={() =>
                            handleFilterChange('specialization', filters.specialization === spec ? '' : spec)
                          }
                          className="h-4 w-4 rounded"
                        />
                        <span>{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-[#2d2d2d]">
                {loading ? 'Loading jobs...' : `${jobs.length} medical jobs`}
              </h1>
              <p className="mt-1 text-sm text-[#595959]">Search results from verified hospitals</p>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-[178px] rounded-md border border-[#d9d9d9] bg-white shimmer" />
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-[#d9d9d9] bg-white p-12 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f2f1]">
                  <Briefcase className="h-8 w-8 text-[#767676]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[#2d2d2d]">No jobs found</h3>
                <p className="mb-6 text-[#595959]">Try adjusting your search or removing a filter.</p>
                <button onClick={clearFilters} className="rounded-md bg-[#2557a7] px-5 py-3 font-semibold text-white">
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
