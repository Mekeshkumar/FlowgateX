import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: 'Twitter', // X (formerly Twitter)
      url: 'https://twitter.com',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-5 h-5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  const companyLinks = ['About Us', 'How It Works', 'Pricing', 'Blog', 'Careers'];
  const userLinks = ['Browse Events', 'My Bookings', 'Help Center', 'Mobile App'];
  const organizerLinks = ['Create Event', 'Dashboard', 'API Docs', 'Resources'];
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Settings'];

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <span className="material-icons-outlined text-3xl text-[var(--brand-primary)]">auto_awesome</span>
              <span
                className="text-2xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                FlowGate<span className="text-[var(--brand-primary)]">X</span>
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] mb-6 max-w-xs">
              The most advanced event management platform powered by IoT and AI technology.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={`https://${social.name}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] transition-all"
                >
                  <span className="material-icons-outlined text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">For Users</h4>
            <ul className="space-y-3">
              {userLinks.map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">For Organizers</h4>
            <ul className="space-y-3">
              {organizerLinks.map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                <span className="material-icons-outlined text-base text-[var(--brand-primary)]">email</span>
                support@flowgatex.com
              </li>
              <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                <span className="material-icons-outlined text-base text-[var(--brand-primary)]">phone</span>
                +91 1800-123-4567
              </li>
              <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                <span className="material-icons-outlined text-base text-[var(--brand-primary)]">location_on</span>
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-primary)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-tertiary)]">
            © {currentYear} FlowGateX. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            {legalLinks.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(' ', '-')}`}
                className="text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
