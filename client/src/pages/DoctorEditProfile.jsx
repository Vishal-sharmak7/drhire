import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, User, Mail, Award, Clock, FileText, CheckCircle2 } from 'lucide-react';

const DoctorEditProfile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: '',
        experience: '',
        licenseNumber: '',
        skills: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('/api/doctors/profile');
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    specialization: data.specialization || '',
                    experience: data.experience || '',
                    licenseNumber: data.licenseNumber || '',
                    skills: data.skills?.join(', ') || '',
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await axios.put('/api/doctors/update', formData);
            setUser({ ...user, ...data });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => navigate('/doctor/dashboard'), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/doctor/dashboard')}
                        className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6 text-[var(--color-text-secondary)]" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Edit Profile</h1>
                        <p className="text-[var(--color-text-secondary)]">Update your professional information</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="card card-hover p-8 fade-in">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${
                            message.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {message.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-[var(--color-text-muted)]" />
                                    Full Name
                                </div>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                placeholder="Dr. John Doe"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
                                    Email Address
                                </div>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="doctor@example.com"
                                required
                            />
                        </div>

                        {/* Specialization & Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                    <div className="flex items-center gap-2">
                                        <Award className="h-4 w-4 text-[var(--color-text-muted)]" />
                                        Specialization
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g. Cardiology"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
                                        Years of Experience
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="5"
                                    required
                                />
                            </div>
                        </div>

                        {/* License Number */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-[var(--color-text-muted)]" />
                                    Medical License Number
                                </div>
                            </label>
                            <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                className="input"
                                placeholder="e.g. MCI-12345"
                                required
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                Skills (comma separated)
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="input"
                                placeholder="e.g. Surgery, Diagnostics, Patient Care"
                            />
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">Separate multiple skills with commas</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/doctor/dashboard')}
                                className="btn btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-primary flex-1"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Save className="h-5 w-5" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorEditProfile;
