import { MapPin, Briefcase, Clock, Building, Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    return (
        <div className="card card-hover p-6 flex flex-col h-full group fade-in">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {/* Hospital Avatar */}
                    <div className="h-12 w-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {job.hospitalId?.hospitalName?.charAt(0) || 'H'}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                            {job.title}
                        </h3>
                        <p className="text-[var(--color-text-secondary)] flex items-center gap-1.5 text-sm">
                            <Building className="h-3.5 w-3.5" />
                            {job.hospitalId?.hospitalName || 'Top Hospital'}
                        </p>
                    </div>
                </div>
                <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors">
                    <Bookmark className="h-5 w-5" />
                </button>
            </div>

            {/* Specialization Badge */}
            <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold rounded-full">
                    {job.specialization}
                </span>
            </div>

            {/* Job Details */}
            <div className="space-y-2.5 mb-6 flex-grow">
                <div className="flex items-center text-[var(--color-text-secondary)] text-sm">
                    <div className="h-8 w-8 bg-[var(--color-bg-tertiary)] rounded-lg flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-[var(--color-text-muted)]" />
                    </div>
                    {job.location}
                </div>
                <div className="flex items-center text-[var(--color-text-secondary)] text-sm">
                    <div className="h-8 w-8 bg-[var(--color-bg-tertiary)] rounded-lg flex items-center justify-center mr-3">
                        <Briefcase className="h-4 w-4 text-[var(--color-text-muted)]" />
                    </div>
                    {job.experienceRequired} + years experience
                </div>
                <div className="flex items-center text-[var(--color-text-secondary)] text-sm">
                    <div className="h-8 w-8 bg-[var(--color-bg-tertiary)] rounded-lg flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
                    </div>
                    Full-time
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-5 border-t border-[var(--color-border)]">
                <span className="font-bold text-lg text-[var(--color-primary)]">
                    {job.salaryRange || 'Competitive'}
                </span>
                <Link
                    to={`/jobs/${job._id}`}
                    className="group/btn flex items-center gap-2 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-primary)] px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                    View Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
