import { Heart, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    forDoctors: [
      { label: 'Browse Jobs', href: '/jobs' },
      { label: 'Create Profile', href: '/register' },
      { label: 'Career Resources', href: '#' },
      { label: 'Success Stories', href: '#' },
    ],
    forHospitals: [
      { label: 'Post a Job', href: '/register' },
      { label: 'Pricing Solutions', href: '#' },
      { label: 'Enterprise', href: '#' },
      { label: 'Success Stories', href: '#' },
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  };

  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">DrHire</span>
            </Link>

            <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm">
              Connecting brilliant healthcare professionals with leading medical institutions worldwide. Your career in medicine starts here.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:contact@drhire.com"
                className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Mail className="h-4 w-4" />
                contact@drhire.com
              </a>
              <a
                href="tel:+91-1234567890"
                className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91-1234567890
              </a>
              <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                <MapPin className="h-4 w-4" />
                New Delhi, India
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] mb-4">For Doctors</h3>
            <ul className="space-y-3">
              {footerLinks.forDoctors.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] mb-4">For Hospitals</h3>
            <ul className="space-y-3">
              {footerLinks.forHospitals.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--color-text-muted)] text-sm">
              © {currentYear} DrHire Platform. All rights reserved.
            </p>

            <p className="text-[var(--color-text-muted)] text-sm flex items-center">
              Made with<Heart className="h-4 w-4 text-red-500 mx-1.5 fill-current" />for medical professionals
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}