import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'facebook', icon: 'facebook' },
    { name: 'twitter', icon: 'tag' },
    { name: 'instagram', icon: 'photo_camera' },
    { name: 'linkedin', icon: 'work' },
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
