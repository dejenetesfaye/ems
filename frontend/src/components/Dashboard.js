import React, { useEffect, useState } from 'react';
import ModernDashboard from './ModernDashboard';
import ManagerDashboard from './ManagerDashboard';
import BrideDashboard from './BrideDashboard';
import SupervisorDashboard from './SupervisorDashboard';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (token && userData) {
      setUser(userData);
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case 'systemadmin':
    case 'superadmin':
      return <ModernDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'bride':
      return <BrideDashboard />;
    case 'supervisor':
      return <SupervisorDashboard />;
    default:
      return <div>Invalid role</div>;
  }
};

export default Dashboard;