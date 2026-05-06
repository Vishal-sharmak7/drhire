'use client';

import { Bookmark, Building2, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/types';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="rounded-md border border-[#d9d9d9] bg-white p-5 shadow-sm transition hover:border-[#2557a7]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href={`/jobs/${job._id}`} className="block">
            <h2 className="text-xl font-semibold leading-snug text-[#2557a7] hover:underline">
              {job.title}
            </h2>
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#2d2d2d]">
            <Building2 className="h-4 w-4 text-[#767676]" />
            {job.hospitalId?.hospitalName || 'Verified hospital'}
          </p>
        </div>
        <button
          className="rounded-full p-2 text-[#595959] hover:bg-[#eef3fe] hover:text-[#2557a7]"
          aria-label="Save job"
        >
          <Bookmark className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded bg-[#f3f2f1] px-2.5 py-1 font-medium text-[#2d2d2d]">
          {job.specialization}
        </span>
        <span className="rounded bg-[#f3f2f1] px-2.5 py-1 font-medium text-[#2d2d2d]">
          {job.experienceRequired}+ years
        </span>
        <span className="rounded bg-[#e7f3e7] px-2.5 py-1 font-medium text-[#1f662b]">
          {job.salaryRange || 'Competitive salary'}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-[#595959]">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#767676]" />
          {job.location}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#767676]" />
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </p>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#595959]">{job.description}</p>

      <div className="mt-5">
        <Link
          href={`/jobs/${job._id}`}
          className="inline-flex rounded-md border border-[#2557a7] px-4 py-2 text-sm font-semibold text-[#2557a7] hover:bg-[#eef3fe]"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
