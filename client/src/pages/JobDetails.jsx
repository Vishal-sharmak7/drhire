import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, Briefcase, DollarSign, Clock, CheckCircle, ArrowLeft, Award, Users, Calendar } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applyMessage, setApplyMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axios.get(`/api/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error('Failed to fetch job', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            setApplyMessage({ text: 'Please login to apply', type: 'error' });
            return;
        }
        setApplying(true);
        try {
            await axios.post(`/api/applications/${id}`);
            setApplyMessage({ text: 'Application submitted successfully!', type: 'success' });
            setJob(prev => ({
                ...prev,
                applicants: [...(prev.applicants || []), user._id]
            }));
        } catch (error) {
            setApplyMessage({
                text: error.response?.data?.message || 'Failed to apply',
                type: 'error'
            });
        } finally {
            setApplying(false);
            setTimeout(() => setApplyMessage({ text: '', type: '' }), 5000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Job Not Found</h2>
                    <p className="text-[var(--color-text-secondary)] mb-6">The job you're looking for doesn't exist or has been removed.</p>
                    <Link to="/jobs" className="btn btn-primary">
                        Browse All Jobs
                    </Link>
                </div>
            </div>
        );
    }

    const hasApplied = job?.applicants?.some(a => a === user?._id || a?._id === user?._id);

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/jobs" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" /> Back to jobs
                </Link>

                <div className="card overflow-hidden fade-in">
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                        <div className="relative z-10 p-8 sm:p-10">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="text-white">
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
                                        <Award className="h-4 w-4" />
                                        <span className="text-sm font-medium">{job.specialization}</span>
                                    </div>

                                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">{job.title}</h1>

                                    <div className="flex flex-wrap items-center gap-6 text-white/80">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5" />
                                            <span>{job.hospitalId?.hospitalName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            <span>{job.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                                        <span className="text-3xl font-bold text-white">{job.hospitalId?.hospitalName?.charAt(0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Job Description</h2>
                                    <div className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">{job.description}</div>
                                </section>

                                <section className="pt-6 border-t border-[var(--color-border)]">
                                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">About the Hospital</h2>
                                    <div className="card p-6 bg-[var(--color-bg-secondary)]/50">
                                        <div className="flex items-start gap-4">
                                            <div className="h-14 w-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                                {job.hospitalId?.hospitalName?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[var(--color-text-primary)] text-lg">{job.hospitalId?.hospitalName}</h3>
                                                <p className="text-[var(--color-text-secondary)] mt-1">{job.hospitalId?.description || 'A leading healthcare institution committed to providing exceptional patient care.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <div className="card p-6 bg-[var(--color-bg-secondary)]/50">
                                    <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Job Overview</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center"><Briefcase className="h-5 w-5 text-[var(--color-primary)]" /></div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-text-primary)]">Experience Required</p>
                                                <p className="text-sm text-[var(--color-text-secondary)]">{job.experienceRequired}+ years</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center"><DollarSign className="h-5 w-5 text-[var(--color-primary)]" /></div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-text-primary)]">Salary Range</p>
                                                <p className="text-sm text-[var(--color-text-secondary)]">{job.salaryRange || 'Competitive'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center"><Calendar className="h-5 w-5 text-[var(--color-primary)]" /></div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-text-primary)]">Posted On</p>
                                                <p className="text-sm text-[var(--color-text-secondary)]">{new Date(job.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center"><Users className="h-5 w-5 text-[var(--color-primary)]" /></div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-text-primary)]">Applicants</p>
                                                <p className="text-sm text-[var(--color-text-secondary)]">{job.applicants?.length || 0} applied</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card p-6">
                                    <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Apply for this Position</h3>

                                    {user?.role === 'doctor' ? (
                                        <div className="space-y-4">
                                            {hasApplied ? (
                                                <div className="flex items-center justify-center gap-2 py-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                                    <span className="font-semibold text-emerald-700">Application Submitted</span>
                                                </div>
                                            ) : (
                                                <button onClick={handleApply} disabled={applying} className="btn btn-primary w-full py-4">
                                                    {applying ? 'Submitting...' : 'Apply Now'}
                                                </button>
                                            )}

                                            {applyMessage.text && (
                                                <div className={`p-4 rounded-xl flex items-center gap-2 ${applyMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                    {applyMessage.type === 'success' && <CheckCircle className="h-5 w-5" />}
                                                    {applyMessage.text}
                                                </div>
                                            )}
                                        </div>
                                    ) : user?.role === 'hospital' ? (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                            <p className="text-amber-700 text-sm">You are logged in as a hospital. Only doctors can apply to jobs.</p>
                                        </div>
                                    ) : (
                                        <Link to="/login" className="btn btn-primary w-full">Log in to Apply</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
