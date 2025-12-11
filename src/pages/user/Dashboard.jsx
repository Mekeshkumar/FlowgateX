import { useAuth } from '@hooks/useAuth';
import { StatCard } from '@features/analytics/components';
import { EventCard } from '@features/events/components';
import { Button, Card } from '@components/common';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Upcoming Events', value: '3', icon: 'event', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-500' },
    { title: 'Total Bookings', value: '12', icon: 'confirmation_number', iconBg: 'bg-green-500/20', iconColor: 'text-green-500' },
    { title: 'Events Attended', value: '8', icon: 'check_circle', iconBg: 'bg-purple-500/20', iconColor: 'text-purple-500' },
    { title: 'Saved Events', value: '5', icon: 'favorite', iconBg: 'bg-red-500/20', iconColor: 'text-red-500' },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
      date: '2024-03-15',
      time: '09:00',
      location: 'Convention Center',
      category: 'Tech',
    },
    {
      id: 2,
      title: 'Music Festival',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
      date: '2024-03-20',
      time: '14:00',
      location: 'Central Park',
      category: 'Music',
    },
  ];

  return (
    <div className="p-0 md:p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-[var(--text-muted)]">Here&apos;s what&apos;s happening with your events.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <Card
            title="Upcoming Events"
            headerAction={
              <Link to="/events" className="text-[var(--brand-primary)] text-sm font-medium hover:text-[var(--brand-primary-hover)]">
                View All
              </Link>
            }
          >
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="compact" />
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Link to="/events">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <span className="material-icons-outlined">search</span>
                  Browse Events
                </Button>
              </Link>
              <Link to="/my-bookings">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <span className="material-icons-outlined">confirmation_number</span>
                  My Tickets
                </Button>
              </Link>
              <Link to="/favorites">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <span className="material-icons-outlined">favorite_border</span>
                  Saved Events
                </Button>
              </Link>
              <Link to="/dashboard"> {/* Changed from /profile which doesn't exist */}
                <Button variant="outline" className="w-full justify-start gap-3">
                  <span className="material-icons-outlined">person</span>
                  Edit Profile
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" className="mt-6">
            <div className="space-y-4">
              {[
                { action: 'Booked ticket', event: 'Tech Conference', time: '2 hours ago' },
                { action: 'Saved event', event: 'Music Festival', time: '1 day ago' },
                { action: 'Attended', event: 'Startup Meetup', time: '3 days ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full mt-2" />
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">
                      {activity.action}: <span className="font-medium">{activity.event}</span>
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

import Layout from '@components/layout/Layout';

const UserDashboardWithLayout = (props) => (
  <Layout>
    <UserDashboard {...props} />
  </Layout>
);

export default UserDashboardWithLayout;

