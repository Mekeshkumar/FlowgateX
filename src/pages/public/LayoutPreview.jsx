import { Layout } from '@components/layout/layout';

const LayoutPreview = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Welcome to FlowGateX Layout Preview
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            This is a preview of the premium admin layout with a collapsible sidebar, responsive header, and modern design system.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full text-xs font-semibold">
              Collapsible Sidebar
            </span>
            <span className="px-3 py-1 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full text-xs font-semibold">
              Responsive Design
            </span>
            <span className="px-3 py-1 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full text-xs font-semibold">
              Dark/Light Theme
            </span>
            <span className="px-3 py-1 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full text-xs font-semibold">
              Mobile Support
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 hover:border-[var(--brand-primary)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white">
                  <span className="material-icons-outlined">analytics</span>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">Card {i}</h3>
                  <p className="text-xs text-[var(--text-muted)]">Sample data</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                This is a sample card demonstrating the design system and layout structure.
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            Layout Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="material-icons-outlined text-[var(--brand-primary)]">
                check_circle
              </span>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Collapsible Sidebar</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Toggle sidebar with Ctrl+B or click the menu button
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-icons-outlined text-[var(--brand-primary)]">
                check_circle
              </span>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Theme Toggle</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Switch between dark and light themes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-icons-outlined text-[var(--brand-primary)]">
                check_circle
              </span>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Responsive Header</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Header adapts on scroll with smooth animations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-icons-outlined text-[var(--brand-primary)]">
                check_circle
              </span>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Mobile Sidebar</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Full mobile support with slide-out sidebar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LayoutPreview;

