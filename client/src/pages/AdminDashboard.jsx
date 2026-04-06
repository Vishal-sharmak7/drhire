import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Activity, Users, Building2, Briefcase, CheckCircle2, XCircle, Clock, LayoutDashboard, FileCheck } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ doctors: 0, hospitals: 0, jobs: 0 });
    const [hospitals, setHospitals] = useState([]);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [pendingHospitalsState, setPendingHospitalsState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, hospitalsRes, usersRes, jobsRes, pendingRes] = await Promise.all([
                    axios.get('/api/admin/stats'),
                    axios.get('/api/admin/hospitals'),
                    axios.get('/api/admin/users'),
                    axios.get('/api/admin/jobs'),
                    axios.get('/api/admin/pending-hospitals'),
                ]);
                setStats(statsRes.data);
                setHospitals(hospitalsRes.data);
                setUsers(usersRes.data);
                setJobs(jobsRes.data);
                setPendingHospitalsState(pendingRes.data.hospitals || []);
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleApprove = async (id) => {
        try {
            const { data } = await axios.put(`http://localhost:5000/api/admin/approve/${id}`);
            setPendingHospitalsState(prev => prev.filter(h => h._id !== id));
            setHospitals(prev => {
                const exists = prev.find(h => h._id === id);
                if (exists) {
                    return prev.map(h => h._id === id ? data : h);
                } else {
                    return [...prev, data];
                }
            });
        } catch (error) {
            alert('Failed to approve hospital');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || user?.role !== "admin") {
        return <Navigate to="/" />;
    }

    const pendingHospitals = pendingHospitalsState;
    const verifiedHospitals = (hospitals || []).filter(h => h.status === 'approved');

    const renderSidebarItem = (id, icon, label, badgeCount) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === id
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary-glow)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
        >
            {icon}
            <span>{label}</span>
            {badgeCount > 0 && (
                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === id ? 'bg-white text-[var(--color-primary)]' : 'bg-rose-100 text-rose-600'
                }`}>
                    {badgeCount}
                </span>
            )}
        </button>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[var(--color-bg-secondary)] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-bg-primary)] border-r border-[var(--color-border)] p-6 flex flex-col gap-2 overflow-y-auto hidden md:flex">
                <div className="flex items-center gap-3 mb-6 px-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Admin</h2>
                </div>
                {renderSidebarItem('overview', <LayoutDashboard className="h-5 w-5" />, 'Overview')}
                {renderSidebarItem('approvals', <FileCheck className="h-5 w-5" />, 'Approvals', pendingHospitals.length)}
                {renderSidebarItem('hospitals', <Building2 className="h-5 w-5" />, 'Hospitals')}
                {renderSidebarItem('doctors', <Users className="h-5 w-5" />, 'Doctors')}
                {renderSidebarItem('jobs', <Briefcase className="h-5 w-5" />, 'Jobs')}
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {/* Mobile tabs */}
                <div className="flex md:hidden overflow-x-auto gap-2 mb-6 pb-2">
                    {['overview', 'approvals', 'hospitals', 'doctors', 'jobs'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium capitalize ${
                                activeTab === tab
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                            }`}
                        >
                            {tab}
                            {tab === 'approvals' && pendingHospitals.length > 0 && ` (${pendingHospitals.length})`}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && (
                    <div className="fade-in">
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">Platform Overview</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {[
                                { label: 'Pending Approvals', value: pendingHospitals.length, icon: FileCheck, color: 'rose' },
                                { label: 'Total Doctors', value: users?.length || 0, icon: Users, color: 'emerald' },
                                { label: 'Verified Hospitals', value: verifiedHospitals.length, icon: Building2, color: 'blue' },
                                { label: 'Jobs Posted', value: jobs?.length || 0, icon: Briefcase, color: 'amber' },
                            ].map((stat, i) => (
                                <div key={i} className="card card-hover p-6">
                                    <div className="flex items-center">
                                        <div className={`h-14 w-14 rounded-xl flex items-center justify-center mr-4 ${
                                            stat.color === 'rose' ? 'bg-rose-100 text-rose-600' :
                                            stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                            stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                            'bg-amber-100 text-amber-600'
                                        }`}>
                                            <stat.icon className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
                                            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'approvals' && (
                    <div className="fade-in">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Hospital Approvals</h1>
                                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Review and approve hospital accounts</p>
                            </div>
                            {pendingHospitals.length > 0 && (
                                <span className="bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-full text-sm">
                                    {pendingHospitals.length} Pending
                                </span>
                            )}
                        </div>

                        <div className="card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
                                        <tr className="text-[var(--color-text-secondary)] text-sm font-semibold whitespace-nowrap">
                                            <th className="py-4 px-6">Hospital Name</th>
                                            <th className="py-4 px-6">Email</th>
                                            <th className="py-4 px-6">Location</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border)]">
                                        {pendingHospitals.map(hospital => (
                                            <tr key={hospital._id} className="hover:bg-[var(--color-bg-secondary)]/50 transition-colors">
                                                <td className="py-4 px-6 font-semibold text-[var(--color-text-primary)] whitespace-nowrap">{hospital.hospitalName}</td>
                                                <td className="py-4 px-6 text-[var(--color-text-secondary)] whitespace-nowrap">{hospital.email}</td>
                                                <td className="py-4 px-6 text-[var(--color-text-secondary)] whitespace-nowrap">{hospital.location}</td>
                                                <td className="py-4 px-6 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleApprove(hospital._id)}
                                                        className="btn btn-primary text-sm"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {pendingHospitals.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center py-12 text-[var(--color-text-muted)]">
                                                    No pending approvals
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'hospitals' && (
                    <div className="fade-in">
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">Verified Hospitals</h1>
                        <div className="card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
                                        <tr className="text-[var(--color-text-secondary)] text-sm font-semibold whitespace-nowrap">
                                            <th className="py-4 px-6">Hospital Name</th>
                                            <th className="py-4 px-6">Email</th>
                                            <th className="py-4 px-6">Location</th>
                                            <th className="py-4 px-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border)]">
                                        {verifiedHospitals.map(hospital => (
                                            <tr key={hospital._id} className="hover:bg-[var(--color-bg-secondary)]/50 transition-colors">
                                                <td className="py-4 px-6 font-semibold text-[var(--color-text-primary)] whitespace-nowrap">{hospital.hospitalName}</td>
                                                <td className="py-4 px-6 text-[var(--color-text-secondary)] whitespace-nowrap">{hospital.email}</td>
                                                <td className="py-4 px-6 text-[var(--color-text-secondary)] whitespace-nowrap">{hospital.location}</td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className="badge badge-success">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {verifiedHospitals.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center py-12 text-[var(--color-text-muted)]">
                                                    No verified hospitals yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'doctors' && (
                    <div className="fade-in">
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">Registered Doctors</h1>
                        <div className="card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
                                        <tr className="text-[var(--color-text-secondary)] text-sm font-semibold whitespace-nowrap">
                                            <th className="py-4 px-6">Doctor Name</th>
                                            <th className="py-4 px-6">Email</th>
                                            <th className="py-4 px-6">Specialization</th>
                                            <th className="py-4 px-6">Experience</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border)]">
                                        {(users || []).map(doctor => (
                                            <tr key={doctor._id} className="hover:bg-[var(--color-bg-secondary)]/50 transition-colors">
                                                <td className="py-4 px-6 font-semibold text-[var(--color-text-primary)] whitespace-nowrap">{doctor.name}</td>
                                                <td className="py-4 px-6 text-[var(--color-text-secondary)] whitespace-nowrap">{doctor.email}</td>
                                                <td className="py-4 px-6 text-[var(--color-text-secondary)] whitespace-nowrap">{doctor.specialization}</td>
                                                <td className="py-4 px-6 text-[var(--color-text-secondary)] whitespace-nowrap">{doctor.experience} Years</td>
                                            </tr>
                                        ))}
                                        {(!users || users.length === 0) && (
                                            <tr>
                                                <td colSpan="4" className="text-center py-12 text-[var(--color-text-muted)]">
                                                    No doctors registered yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <div className="fade-in">
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">All Jobs Posted</h1>
                        <div className="card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
                                        <tr className="text-[var(--color-text-secondary)] text-sm font-semibold whitespace-nowrap">
                                            <th className="py-4 px-6">Job Title</th>
                                            <th className="py-4 px-6">Hospital</th>
                                            <th className="py-4 px-6">Location</th>
                                            <th className="py-4 px-6">Applicants</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border)]">
                                        {(jobs || []).map(job => (
                                            <tr key={job._id} className="hover:bg-[var(--color-bg-secondary)]/50 transition-colors">
                                                <td className="py-4 px-6 font-semibold text-[var(--color-text-primary)] whitespace-nowrap">{job.title}</td>
                                                <td className="py-4 px-6 text-[var(--color-text-secondary)] whitespace-nowrap">{job.hospitalId?.hospitalName || 'Unknown'}</td>
                                                <td className="py-4 px-6 text-[var(--color-text-secondary)] whitespace-nowrap">{job.location}</td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-bold">
                                                        {job.applicants?.length || 0}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!jobs || jobs.length === 0) && (
                                            <tr>
                                                <td colSpan="4" className="text-center py-12 text-[var(--color-text-muted)]">
                                                    No jobs posted yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
