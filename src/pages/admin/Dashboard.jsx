import { StatCard, AnalyticsChart } from '@features/analytics/components';
import { Card, Badge } from '@components/common';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '52,340', change: '+12%', changeType: 'positive', icon: 'people', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Total Events', value: '1,234', change: '+8%', changeType: 'positive', icon: 'event', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { title: 'Platform Revenue', value: '$245,678', change: '+23%', changeType: 'positive', icon: 'payments', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { title: 'Active IoT Devices', value: '156', change: '3 offline', changeType: 'negative', icon: 'sensors', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  ];

  const systemHealth = [
    { name: 'API Server', status: 'operational', uptime: '99.99%' },
    { name: 'Database', status: 'operational', uptime: '99.95%' },
    { name: 'WebSocket Server', status: 'operational', uptime: '99.90%' },
    { name: 'IoT Gateway', status: 'degraded', uptime: '98.50%' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'organizer', joined: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'attendee', joined: '5 hours ago' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'organizer', joined: '1 day ago' },
  ];

  const usersChartData = {
    series: [{
      name: 'New Users',
      data: [120, 150, 180, 200, 250, 300, 350, 400, 380, 450, 500, 520]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-2">
          <Card title="User Growth">
            <AnalyticsChart type="bar" data={usersChartData} height={350} />
          </Card>
        </div>

        {/* System Health */}
        <div>
          <Card title="System Health">
            <div className="space-y-4">
              {systemHealth.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-gray-700 font-medium">{service.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{service.uptime}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="mt-6">
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <span className="material-icons-outlined text-2xl text-gray-600 mb-1">person_add</span>
                <p className="text-sm text-gray-600">Add User</p>
              </button>
              <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <span className="material-icons-outlined text-2xl text-gray-600 mb-1">add_circle</span>
                <p className="text-sm text-gray-600">Add Event</p>
              </button>
              <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <span className="material-icons-outlined text-2xl text-gray-600 mb-1">assessment</span>
                <p className="text-sm text-gray-600">Reports</p>
              </button>
              <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <span className="material-icons-outlined text-2xl text-gray-600 mb-1">settings</span>
                <p className="text-sm text-gray-600">Settings</p>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Users Table */}
      <Card title="Recent Users" className="mt-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.role === 'organizer' ? 'primary' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.joined}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View
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

export default AdminDashboard;
