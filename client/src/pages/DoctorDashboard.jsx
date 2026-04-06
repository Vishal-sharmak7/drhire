import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, FileText, CheckCircle2, Clock, MapPin, Building2, UploadCloud, Briefcase, Award, Star, Download } from 'lucide-react';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileRes, appsRes] = await Promise.all([
                    axios.get('/api/doctors/profile'),
                    axios.get('/api/applications/doctor')
                ]);
                setProfile(profileRes.data);
                setApplications(appsRes.data.applications || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('resume', resumeFile);

        try {
            const { data } = await axios.put('/api/doctors/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile({ ...profile, resume: data.resume });
            setMessage('Resume uploaded successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to upload resume');
        } finally {
            setUploading(false);
            setResumeFile(null);
        }
    };

    const stats = [
        {
            label: 'Applications',
            value: applications?.length || 0,
            icon: Briefcase,
            color: 'blue',
        },
        {
            label: 'Saved Jobs',
            value: profile?.savedJobs?.length || 0,
            icon: Star,
            color: 'amber',
        },
        {
            label: 'Experience',
            value: `${profile?.experience || 0} Yrs`,
            icon: Award,
            color: 'emerald',
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
                    <p className="text-[var(--color-text-secondary)]">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl mb-8 fade-in">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                    <div className="relative z-10 p-8 md:p-10">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="h-24 w-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                                <User className="h-12 w-12 text-white" />
                            </div>

                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Welcome, Dr. {profile?.name || user?.name || "Doctor"}
                                </h1>
                                <p className="text-white/80">
                                    {profile?.specialization || "Specialist"} | {profile?.experience || "0"} Years Experience
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="card card-hover p-6 fade-in"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--color-text-secondary)] text-sm mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
                                </div>
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                                    stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                    stat.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                    'bg-emerald-100 text-emerald-600'
                                }`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile & Resume */}
                    <div className="space-y-6">
                        {/* Resume Management */}
                        <div className="card card-hover p-6 fade-in">
                            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                                <div className="h-10 w-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-[var(--color-primary)]" />
                                </div>
                                Resume Management
                            </h2>

                            {profile?.resume ? (
                                <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-emerald-800">Resume Uploaded</p>
                                            <a
                                                href={`http://localhost:5000${profile.resume}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                View Document
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-amber-600" />
                                        <p className="text-amber-800">You haven't uploaded a resume yet.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center hover:bg-[var(--color-bg-secondary)] transition-colors group cursor-pointer relative">
                                    <input
                                        type="file"
                                        id="resume"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setResumeFile(e.target.files[0])}
                                    />
                                    <label htmlFor="resume" className="cursor-pointer flex flex-col items-center">
                                        <div className="h-12 w-12 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <UploadCloud className="h-6 w-6 text-[var(--color-primary)]" />
                                        </div>
                                        <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                            {resumeFile ? resumeFile.name : 'Drop your resume here'}
                                        </span>
                                        <span className="text-xs text-[var(--color-text-muted)] mt-1">
                                            PDF or DOC up to 5MB
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!resumeFile || uploading}
                                    className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? 'Uploading...' : 'Upload Resume'}
                                </button>

                                {message && (
                                    <p className={`text-sm text-center font-medium ${
                                        message.includes('success') ? 'text-emerald-600' : 'text-red-500'
                                    }`}>
                                        {message}
                                    </p>
                                )}
                            </form>
                        </div>

                        {/* Skills */}
                        <div className="card card-hover p-6 fade-in">
                            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile?.skills?.length > 0 ? (
                                    profile?.skills?.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-[var(--color-text-muted)]">No skills added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Applications */}
                    <div className="lg:col-span-2">
                        <div className="card card-hover h-full fade-in">
                            <div className="p-6 border-b border-[var(--color-border)]">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-[var(--color-text-primary)]">My Applications</h2>
                                    <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold rounded-full">
                                        {applications?.length || 0} Total
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                {applications?.length > 0 ? (
                                    <div className="space-y-4">
                                        {applications?.map((app, i) => (
                                            <div
                                                key={app?._id || i}
                                                className="group p-5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-lg transition-all"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="h-12 w-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center text-white font-bold">
                                                            {app?.jobId?.hospitalId?.hospitalName?.charAt(0) || 'H'}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                                                                {app?.jobId?.title || 'Job Title'}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-[var(--color-text-secondary)]">
                                                                <span className="flex items-center gap-1">
                                                                    <Building2 className="h-4 w-4" />
                                                                    {app?.jobId?.hospitalId?.hospitalName || 'Hospital'}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="h-4 w-4" />
                                                                    {app?.jobId?.location || 'Location'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                                                            app?.status === 'Pending'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                            {app?.status === 'Pending' ? (
                                                                <><Clock className="h-3.5 w-3.5" />{app.status}</>
                                                            ) : (
                                                                <><CheckCircle2 className="h-3.5 w-3.5" />{app.status}</>
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-[var(--color-text-muted)]">
                                                            {app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="h-20 w-20 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Briefcase className="h-10 w-10 text-[var(--color-text-muted)]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No Applications Yet</h3>
                                        <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
                                            You haven't applied to any jobs. Explore our job board to find your next opportunity.
                                        </p>
                                        <a
                                            href="/jobs"
                                            className="btn btn-primary"
                                        >
                                            Browse Jobs
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
