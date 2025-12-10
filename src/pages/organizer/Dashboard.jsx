import { useAuth } from '@hooks/useAuth';
import { StatCard, AnalyticsChart } from '@features/analytics/components';
import { Card, Button } from '@components/common';
import { Link } from 'react-router-dom';

const OrganizerDashboard = () => {
  // const { user } = useAuth(); // Reserved for future use

  const stats = [
    { title: 'Total Events', value: '8', change: '+2 this month', changeType: 'positive', icon: 'event', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Total Revenue', value: '$12,450', change: '+15%', changeType: 'positive', icon: 'payments', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { title: 'Tickets Sold', value: '1,234', change: '+8%', changeType: 'positive', icon: 'confirmation_number', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { title: 'Avg. Rating', value: '4.8', change: '+0.2', changeType: 'positive', icon: 'star', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  ];

  const revenueChartData = {
    series: [{
      name: 'Revenue',
      data: [4000, 3000, 5000, 4500, 6000, 7500, 8000, 7000, 9000, 8500, 10000, 12450]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  const recentEvents = [
    { id: 1, title: 'Tech Conference', date: '2024-03-15', tickets: 423, revenue: '$126,577', status: 'active' },
    { id: 2, title: 'Startup Workshop', date: '2024-03-10', tickets: 156, revenue: '$7,800', status: 'active' },
    { id: 3, title: 'Networking Night', date: '2024-02-28', tickets: 89, revenue: '$4,450', status: 'completed' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="text-gray-500">Manage your events and track performance</p>
        </div>
        <Link to="/organizer/create">
          <Button>
            <span className="material-icons-outlined mr-2">add</span>
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts & Tables */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card title="Revenue Overview">
            <AnalyticsChart type="area" data={revenueChartData} height={350} />
          </Card>
        </div>

        {/* Quick Stats */}
        <div>
          <Card title="This Week">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">New Bookings</span>
                <span className="font-bold text-gray-900">45</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Page Views</span>
                <span className="font-bold text-gray-900">2,340</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-bold text-green-600">12.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Check-ins Today</span>
                <span className="font-bold text-gray-900">28</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Events Table */}
      <Card title="Recent Events" className="mt-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Event</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tickets Sold</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{event.title}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{event.date}</td>
                  <td className="py-3 px-4 text-gray-600">{event.tickets}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{event.revenue}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OrganizerDashboard;
