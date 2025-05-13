// src/pages/Dashboard.jsx
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Button } from 'antd';

export default function Dashboard() {
  const { authUser, logout } = useContext(UserContext);
  console.log('Dashboard - authUser:', authUser);
  const role = authUser?.role || 'Unknown';

  return (
    <div>
      <h1>Dashboard - {role}</h1>
      <Button type="primary" danger onClick={logout}>
        Logout
      </Button>

      {role === 'System Administrator' && <div>Admin Panel (Manage Users, etc)</div>}
      {role === 'Store Owner' && <div>Store Panel (Your Store & Ratings)</div>}
      {role === 'User' && <div>Rate Stores / View Ratings</div>}
    </div>
  );
}
