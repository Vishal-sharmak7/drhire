import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Building2, PlusCircle, Users, Activity, CheckCircle, Clock, Briefcase, Trash2, XCircle, MapPin, Award, Mail, FileText } from 'lucide-react';

const HospitalDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ activeJobsCount: 0, totalApplicants: 0, profileViews: 0 });
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        specialization: '',
        experienceRequired: '',
        salaryRange: '',
        location: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/hospitals/stats');
                setProfile(data.profile);
                setStats(data.stats);
                setJobs(data.jobs || []);
            } catch (error) {
                console.error('Error fetching hospital data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                experienceRequired: Number(formData.experienceRequired),
            };
            const { data } = await axios.post('/api/jobs', payload);
            setJobs([...jobs, { ...data, applicants: [] }]);
            setIsPosting(false);
            setFormData({ title: '', description: '', specialization: '', experienceRequired: '', salaryRange: '', location: '' });
        } catch (error) {
            alert('Failed to post job: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job posting?")) return;
        try {
            await axios.delete(`/api/jobs/${id}`);
            setJobs(jobs.filter(job => job._id !== id));
        } catch (error) {
            alert('Failed to delete job: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
        );
    }

    const statusConfig = {
        approved: { icon: CheckCircle, color: 'emerald', text: 'Verified Institution' },
        pending: { icon: Clock, color: 'amber', text: 'Pending Verification' },
        rejected: { icon: XCircle, color: 'rose', text: 'Verification Rejected' },
    };

    const status = statusConfig[profile?.status] || statusConfig.pending;

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Card */}
                <div className="card card-hover p-6 mb-8 fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{profile?.hospitalName}</h1>
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                                        status.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                                        status.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                                        'bg-rose-100 text-rose-700'
                                    }`}>
                                        <status.icon className="h-4 w-4" />
                                        {status.text}
                                    </span>
                                    <span className="text-[var(--color-text-muted)]">•</span>
                                    <span className="text-[var(--color-text-secondary)] flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {profile?.location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsPosting(!isPosting)}
                            className="btn btn-primary"
                        >
                            <PlusCircle className="h-5 w-5" />
                            {isPosting ? 'Cancel' : 'Post New Job'}
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Active Jobs', value: stats.activeJobsCount, icon: Briefcase, color: 'blue' },
                        { label: 'Total Applicants', value: stats.totalApplicants, icon: Users, color: 'emerald' },
                        { label: 'Profile Views', value: stats.profileViews, icon: Activity, color: 'purple' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="card card-hover p-6 fade-in"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex items-center">
                                <div className={`h-14 w-14 rounded-xl flex items-center justify-center mr-4 ${
                                    stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                    stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                    'bg-purple-100 text-purple-600'
                                }`}
>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-[var(--color-text-secondary)] text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Post Job Form */}
                {isPosting && (
                    <div className="card card-hover p-8 mb-8 scale-in">
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Create Job Posting</h2>

                        {profile?.status === 'pending' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                                <div className="flex items-start gap-3">
                                    <Clock className="h-6 w-6 text-amber-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-amber-900">Account Under Verification</h3>
                                        <p className="text-amber-700 mt-1">Your account is being reviewed by our team. You'll be able to post jobs once approved.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {profile?.status === 'rejected' && (
                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 mb-6">
                                <div className="flex items-start gap-3">
                                    <XCircle className="h-6 w-6 text-rose-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-rose-900">Verification Rejected</h3>
                                        <p className="text-rose-700 mt-1">Your account verification was rejected. Please contact support for more information.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Job Title</label>
                                <input
                                    required
                                    type="text"
                                    disabled={profile?.status !== 'approved'}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="input"
                                    placeholder="e.g. Senior Cardiologist"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Job Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    disabled={profile?.status !== 'approved'}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="input resize-none"
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Specialization</label>
                                <input
                                    required
                                    type="text"
                                    disabled={profile?.status !== 'approved'}
                                    value={formData.specialization}
                                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                    className="input"
                                    placeholder="e.g. Cardiology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Location</label>
                                <input
                                    required
                                    type="text"
                                    disabled={profile?.status !== 'approved'}
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="input"
                                    placeholder="e.g. New York, NY"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Experience Required (Years)</label>
                                <input
                                    required
                                    type="number"
                                    disabled={profile?.status !== 'approved'}
                                    value={formData.experienceRequired}
                                    onChange={e => setFormData({ ...formData, experienceRequired: e.target.value })}
                                    className="input"
                                    placeholder="5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Salary Range (Optional)</label>
                                <input
                                    type="text"
                                    disabled={profile?.status !== 'approved'}
                                    value={formData.salaryRange}
                                    onChange={e => setFormData({ ...formData, salaryRange: e.target.value })}
                                    className="input"
                                    placeholder="e.g. $200k - $300k"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profile?.status !== 'approved'}
                                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Publish Job
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Jobs List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Posted Jobs</h2>

                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div key={job._id} className="card card-hover overflow-hidden fade-in">
                                <div className="p-6 border-b border-[var(--color-border)]">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">{job.title}</h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                                                <span className="flex items-center gap-1">
                                                    <Award className="h-4 w-4" />
                                                    {job.specialization}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {job.location}
                                                </span>
                                                <span>•</span>
                                                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="px-4 py-2 bg-[var(--color-primary)]/10 rounded-xl">
                                                <span className="text-2xl font-bold text-[var(--color-primary)]">{job.applicants?.length || 0}</span>
                                                <span className="text-sm text-[var(--color-text-secondary)] ml-1">Applicants</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteJob(job._id)}
                                                className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                                title="Delete Job"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-[var(--color-bg-secondary)]/50">
                                    {job.applicants?.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {job.applicants.map((applicant) => (
                                                <div
                                                    key={applicant._id}
                                                    className="card p-4 hover:shadow-md transition-all"
                                                >
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="h-10 w-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center text-white font-bold">
                                                            {applicant.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-[var(--color-text-primary)]">{applicant.name}</p>
                                                            <p className="text-xs text-[var(--color-text-muted)]">{applicant.specialization} • {applicant.experience} yrs</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <a
                                                            href={`mailto:${applicant.email}`}
                                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                            Contact
                                                        </a>
                                                        {applicant.resume && (
                                                            <a
                                                                href={`http://localhost:5000${applicant.resume}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-border)] transition-colors"
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                                View CV
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-[var(--color-text-muted)] py-8">No applicants yet for this position.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card p-12 text-center">
                            <div className="h-16 w-16 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="h-8 w-8 text-[var(--color-text-muted)]" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No Jobs Posted</h3>
                            <p className="text-[var(--color-text-secondary)]">Start hiring by posting your first job opening.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
