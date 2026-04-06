import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Building2, Stethoscope, User, Mail, Lock, Award, MapPin, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('doctor');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        hospitalName: '',
        email: '',
        password: '',
        specialization: '',
        experience: '',
        licenseNumber: '',
        location: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { registerDoctor, registerHospital, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        else if (user.role === 'hospital') return <Navigate to="/hospital/dashboard" replace />;
        else return <Navigate to="/doctor/dashboard" replace />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (role === 'doctor') {
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    specialization: formData.specialization,
                    experience: Number(formData.experience),
                    licenseNumber: formData.licenseNumber,
                };
                await registerDoctor(payload);
                navigate('/doctor/dashboard');
            } else {
                const payload = {
                    hospitalName: formData.hospitalName,
                    email: formData.email,
                    password: formData.password,
                    location: formData.location,
                };
                await registerHospital(payload);
                navigate('/hospital/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || `Failed to register ${role}`);
        } finally {
            setIsLoading(false);
        }
    };

    const doctorFields = [
        { name: 'name', type: 'text', placeholder: 'Full Name', icon: User, required: true },
        { name: 'email', type: 'email', placeholder: 'Email Address', icon: Mail, required: true },
        { name: 'password', type: 'password', placeholder: 'Create Password', icon: Lock, required: true },
        { name: 'specialization', type: 'text', placeholder: 'Specialization (e.g. Cardiologist)', icon: Award, required: true },
        { name: 'experience', type: 'number', placeholder: 'Years of Experience', icon: Clock, required: true },
        { name: 'licenseNumber', type: 'text', placeholder: 'Medical License Number', icon: CheckCircle2, required: true },
    ];

    const hospitalFields = [
        { name: 'hospitalName', type: 'text', placeholder: 'Hospital / Organization Name', icon: Building2, required: true },
        { name: 'email', type: 'email', placeholder: 'Organization Email', icon: Mail, required: true },
        { name: 'password', type: 'password', placeholder: 'Create Password', icon: Lock, required: true },
        { name: 'location', type: 'text', placeholder: 'Location / Address', icon: MapPin, required: true },
    ];

    const currentFields = role === 'doctor' ? doctorFields : hospitalFields;

    return (
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)]" />

            {/* Decorative blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="max-w-lg w-full relative z-10">
                {/* Glass card */}
                <div className="glass-card rounded-3xl p-8 md:p-10 fade-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="relative inline-flex items-center justify-center mb-4">
                            <div className="absolute inset-0 bg-[var(--color-primary)] rounded-2xl blur opacity-30" />
                            <div className="relative h-16 w-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center">
                                <Briefcase className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
                            Create Account
                        </h2>
                        <p className="mt-2 text-[var(--color-text-secondary)]">
                            Join DrHire and start your journey
                        </p>
                    </div>

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-3 p-1 bg-[var(--color-bg-tertiary)] rounded-2xl mb-6">
                        <button
                            onClick={() => setRole('doctor')}
                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                                role === 'doctor'
                                    ? 'bg-[var(--color-bg-primary)] text-[var(--color-primary)] shadow-md'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }`}
                        >
                            <Stethoscope className="w-4 h-4" />
                            Doctor
                        </button>
                        <button
                            onClick={() => setRole('hospital')}
                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                                role === 'hospital'
                                    ? 'bg-[var(--color-bg-primary)] text-[var(--color-primary)] shadow-md'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }`}
                        >
                            <Building2 className="w-4 h-4" />
                            Hospital
                        </button>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            {currentFields.map((field) => (
                                <div key={field.name} className="relative">
                                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="input pl-12"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-3.5 mt-6"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create Account
                                    <ArrowRight className="h-5 w-5" />
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--color-border)]" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Login link */}
                    <Link
                        to="/login"
                        className="btn btn-secondary w-full py-3.5"
                    >
                        Sign in to your account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
