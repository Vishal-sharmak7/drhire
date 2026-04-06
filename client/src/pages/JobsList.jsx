import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { Search, MapPin, Filter, SlidersHorizontal, X, Briefcase } from 'lucide-react';

const JobsList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        specialization: searchParams.get('specialization') || '',
        location: searchParams.get('location') || '',
        experience: searchParams.get('experience') || '',
    });

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const validFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
            const query = new URLSearchParams(validFilters).toString();
            setSearchParams(validFilters, { replace: true });
            const { data } = await axios.get(`/api/jobs?${query}`);
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [searchParams.get('keyword'), searchParams.get('specialization')]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (filters.experience !== (searchParams.get('experience') || '')) {
            fetchJobs();
        }
    }, [filters.experience]);

    const clearFilters = () => {
        setFilters({ keyword: '', specialization: '', location: '', experience: '' });
        fetchJobs();
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
            {/* Hero Search Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-8 fade-in">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-3">
                            Find Your Next Healthcare Role
                        </h1>
                        <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                            Browse through thousands of opportunities from top hospitals and medical institutions
                        </p>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="glass-card rounded-2xl p-3 max-w-4xl mx-auto fade-in"
                        style={{ animationDelay: '100ms' }}
                    >
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 flex items-center bg-[var(--color-bg-primary)] rounded-xl px-4 py-3">
                                <Search className="h-5 w-5 text-[var(--color-text-muted)] mr-3" />
                                <input
                                    type="text"
                                    placeholder="Job title or keyword"
                                    className="bg-transparent w-full text-[var(--color-text-primary)] focus:outline-none"
                                    value={filters.keyword}
                                    onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                />
                            </div>
                            <div className="flex-1 flex items-center bg-[var(--color-bg-primary)] rounded-xl px-4 py-3">
                                <MapPin className="h-5 w-5 text-[var(--color-text-muted)] mr-3" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="bg-transparent w-full text-[var(--color-text-primary)] focus:outline-none"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary whitespace-nowrap"
                            >
                                Search Jobs
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn btn-secondary w-full"
                        >
                            <SlidersHorizontal className="h-5 w-5 mr-2" />
                            Filters {hasActiveFilters && <span className="ml-2 px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded-full">Active</span>}
                        </button>
                    </div>

                    {/* Sidebar Filters */}
                    <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="card sticky top-24 p-6 fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold">
                                    <Filter className="h-5 w-5" />
                                    Filters
                                </div>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] flex items-center gap-1"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Experience Filter */}
                                <div>
                                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Experience Level</h3>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Any Experience', value: '' },
                                            { label: 'Entry Level (≤ 2 Yrs)', value: '2' },
                                            { label: 'Mid Level (≤ 5 Yrs)', value: '5' },
                                            { label: 'Senior Level (≤ 10 Yrs)', value: '10' }
                                        ].map((level) => (
                                            <label
                                                key={level.label}
                                                className="flex items-center gap-3 cursor-pointer group"
                                            >
                                                <input
                                                    type="radio"
                                                    name="experience"
                                                    checked={filters.experience === level.value}
                                                    onChange={() => handleFilterChange('experience', level.value)}
                                                    className="w-4 h-4 text-[var(--color-primary)] border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                                                />
                                                <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                                                    {level.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-[var(--color-border)] pt-6">
                                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Specialization</h3>
                                    <div className="space-y-2">
                                        {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Surgery'].map((spec) => (
                                            <label key={spec} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.specialization === spec}
                                                    onChange={() => handleFilterChange('specialization', filters.specialization === spec ? '' : spec)}
                                                    className="rounded text-[var(--color-primary)] border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                                                />
                                                <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                                                    {spec}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Job Listings */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                                    {loading ? 'Loading jobs...' : `${jobs.length} Jobs Available`}
                                </h2>
                                <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                                    Find your perfect healthcare position
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="card p-6 h-[200px] shimmer rounded-xl" />
                                ))}
                            </div>
                        ) : jobs.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {jobs.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <div className="card p-12 text-center fade-in">
                                <div className="h-20 w-20 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Briefcase className="h-10 w-10 text-[var(--color-text-muted)]" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No jobs found</h3>
                                <p className="text-[var(--color-text-secondary)] mb-6">
                                    Try adjusting your search criteria or browse all available positions
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="btn btn-primary"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsList;
