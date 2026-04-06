'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Briefcase,
  Building,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Award,
  Heart,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('keyword', search);
    if (location) params.append('location', location);
    router.push(`/jobs?${params.toString()}`);
  };

  const stats = [
    { value: '5,000+', label: 'Healthcare Jobs', icon: Briefcase },
    { value: '1,200+', label: 'Verified Hospitals', icon: Building },
    { value: '50k+', label: 'Active Doctors', icon: Stethoscope },
    { value: '98%', label: 'Placement Rate', icon: Award },
  ];

  const specialties = [
    {
      name: 'Cardiology',
      image: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=500&auto=format&fit=crop&q=60',
      count: '1,200+',
    },
    {
      name: 'Neurology',
      image: 'https://plus.unsplash.com/premium_photo-1733306534776-d87b7fa2d6e3?q=80&w=1170&auto=format&fit=crop',
      count: '800+',
    },
    {
      name: 'Pediatrics',
      image: 'https://images.unsplash.com/photo-1632053002928-1919605ee6f7?q=80&w=1178&auto=format&fit=crop',
      count: '2,100+',
    },
    {
      name: 'Orthopedics',
      image: 'https://plus.unsplash.com/premium_photo-1726869610210-de13ad4cf226?q=80&w=1170&auto=format&fit=crop',
      count: '950+',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Profile',
      desc: 'Sign up and build your professional medical profile with your credentials.',
      icon: Sparkles,
    },
    {
      step: '02',
      title: 'Discover Jobs',
      desc: 'Browse through thousands of healthcare opportunities from top institutions.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Apply & Connect',
      desc: 'Apply to positions and connect directly with hiring hospitals.',
      icon: ArrowRight,
    },
    {
      step: '04',
      title: 'Get Hired',
      desc: 'Land your dream job and advance your medical career.',
      icon: Award,
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sharma',
      role: 'Cardiologist',
      quote: 'I found my dream job within 2 weeks using this platform. The interface is beautiful and easy to use!',
      rating: 5,
    },
    {
      name: 'Dr. Mehta',
      role: 'Neurologist',
      quote: 'The opportunities here are top-notch. I received multiple offers from prestigious hospitals.',
      rating: 5,
    },
    {
      name: 'Dr. Kaur',
      role: 'Pediatrician',
      quote: 'A seamless experience from application to placement. The support team is exceptional.',
      rating: 5,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 bg-[var(--color-bg-primary)]">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-500/10 to-fuchsia-500/20" />
          <div className="dark:hidden absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />

          {/* Animated mesh gradients */}
          <div className="mesh-gradient-1" />
          <div className="mesh-gradient-2" />
          <div className="mesh-gradient-3" />
          <div className="mesh-gradient-4" />

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                              linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />

        {/* Animated particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }} />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="fade-in">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-pulse-subtle border border-white/10">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  <span className="text-[var(--color-primary)]">50,000+</span> Medical Professionals Trust Us
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-[var(--color-text-primary)]">Find Your</span>
                <br />
                <span className="relative">
                  <span className="hero-gradient-text">Dream Job</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M0 6C50 2 150 2 200 6" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="0" y1="6" x2="200" y2="6">
                        <stop stopColor="var(--color-primary)"/>
                        <stop offset="1" stopColor="var(--color-accent)"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-lg">
                Connect with <span className="text-[var(--color-primary)] font-semibold">top hospitals</span> and medical institutions.
                Your next career move starts here.
              </p>

              {/* Search Bar - Glassmorphism */}
              <form
                onSubmit={handleSearch}
                className="glass-card rounded-2xl p-3 flex flex-col sm:flex-row gap-3 border-2 border-white/10 hover:border-[var(--color-primary)]/30 transition-all duration-300"
              >
                <div className="flex-1 flex items-center glass rounded-xl px-4 py-3 border border-white/5">
                  <Search className="h-5 w-5 text-[var(--color-primary)] mr-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Job title, keyword, or company"
                    className="bg-transparent w-full text-[var(--color-text-primary)] focus:outline-none placeholder:text-[var(--color-text-muted)]"
                  />
                </div>
                <div className="flex-1 flex items-center glass rounded-xl px-4 py-3 border border-white/5">
                  <MapPin className="h-5 w-5 text-[var(--color-accent)] mr-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or location"
                    className="bg-transparent w-full text-[var(--color-text-primary)] focus:outline-none placeholder:text-[var(--color-text-muted)]"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 transition-all hover:-translate-y-0.5"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Jobs
                </button>
              </form>

              {/* Quick links */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <span className="text-[var(--color-text-muted)] text-sm">Popular searches:</span>
                {['Cardiology', 'Neurology', 'Pediatrics', 'Surgery'].map((tag, i) => (
                  <Link
                    key={tag}
                    href={`/jobs?specialization=${tag}`}
                    className="text-sm glass px-3 py-1.5 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all border border-white/5"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Content - 3D Cards */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[550px]">
                {/* Floating cards with enhanced glassmorphism */}
                <div className="absolute top-0 right-0 w-72 glass-card p-6 rounded-2xl float border-2 border-white/10 hover:border-[var(--color-primary)]/30 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Application Sent</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Your application has been received!</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                    <span className="text-xs text-[var(--color-text-muted)]">Apollo Hospital</span>
                  </div>
                </div>

                <div
                  className="absolute bottom-24 left-0 w-80 glass-card p-6 rounded-2xl float border-2 border-white/10 hover:border-[var(--color-primary)]/30 transition-all group"
                  style={{ animationDelay: '-2s' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-purple-500/25">
                      FH
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[var(--color-text-primary)] text-lg">Fortis Hospital</h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">Senior Cardiologist</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-[var(--color-accent)]">₹3.5L - ₹5L/mo</span>
                        <span className="badge badge-success">New</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute top-1/3 right-0 w-64 glass-card p-5 rounded-2xl float border-2 border-white/10"
                  style={{ animationDelay: '-4s' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">Profile Views</span>
                    <span className="text-xs badge badge-success">Live</span>
                  </div>
                  <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">+248%</div>
                  <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full animate-pulse" />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2">vs. last month</p>
                </div>

                {/* New floating card */}
                <div
                  className="absolute bottom-0 right-10 w-56 glass-card p-4 rounded-xl float border-2 border-white/10"
                  style={{ animationDelay: '-3s' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">Top Rated</p>
                      <p className="font-bold text-[var(--color-text-primary)]">98% Success</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-[var(--color-primary)]/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-[var(--color-primary)] rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--color-bg-secondary)] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center card card-hover p-6 fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--color-primary)]/10 mb-4">
                  <stat.icon className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
                <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{stat.value}</p>
                <p className="text-[var(--color-text-secondary)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <span className="inline-block text-[var(--color-primary)] font-semibold mb-4">Explore by Specialty</span>
            <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              Discover Opportunities by Specialty
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
              Explore high-demand medical fields and find jobs tailored to your expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((item, i) => (
              <Link
                key={i}
                href={`/jobs?specialization=${item.name}`}
                className="group relative rounded-2xl overflow-hidden card card-hover fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-1">{item.name}</h3>
                      <p className="text-white/80 text-sm">{item.count} jobs available</p>
                    </div>
                    <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                      <ArrowRight className="h-5 w-5 text-white group-hover:text-[var(--color-primary)] transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 btn btn-primary"
            >
              Explore All Specialties
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[var(--color-bg-secondary)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <span className="inline-block text-[var(--color-accent)] font-semibold mb-4">How It Works</span>
            <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              Your Journey to Success
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
              Four simple steps to land your dream job in healthcare.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div
                key={i}
                className="card card-hover p-8 text-center fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-2xl blur-xl" />
                  <div className="relative h-16 w-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                <div className="text-5xl font-bold text-[var(--color-bg-tertiary)] mb-2">{step.step}</div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{step.title}</h3>
                <p className="text-[var(--color-text-secondary)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <span className="inline-block text-[var(--color-primary)] font-semibold mb-4">Featured Opportunities</span>
            <h2 className="text-4xl font-bold text-[var(--color-text-primary)]">Ready to Find Your Next Role?</h2>
            <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl mx-auto">
              Browse through thousands of healthcare positions from top hospitals and medical institutions.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 btn btn-primary mt-8"
            >
              View All Jobs
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[var(--color-bg-secondary)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 fade-in">
            <span className="inline-block text-[var(--color-primary)] font-semibold mb-4">Testimonials</span>
            <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              What Doctors Say
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
              Hear from medical professionals who found their dream jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="card card-hover p-8 fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Heart key={j} className="h-5 w-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-[var(--color-text-secondary)] mb-6 text-lg italic">"{testimonial.quote}"</p>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-text-primary)]">{testimonial.name}</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden fade-in">
            <div className="absolute inset-0 gradient-animated" />

            <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Advance Your Medical Career?
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of healthcare professionals who have found their dream jobs through DrHire.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[var(--color-primary)] px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  Create Doctor Profile
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/register?role=hospital"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}