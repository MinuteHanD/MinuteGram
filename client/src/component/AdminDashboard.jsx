import React, { useState, useEffect } from 'react';
import api from '../service/apiClient';
import { Shield, Users, Activity, Clock, MoreVertical } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.post(`/admin/users/${userId}/role?newRole=${newRole}`);
      fetchUsers();
      alert('Role updated successfully');
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Failed to update role');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/ban`);
      fetchUsers();
      alert('User banned successfully');
    } catch (err) {
      console.error('Failed to ban user:', err);
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/unban`);
      fetchUsers();
      alert('User unbanned successfully');
    } catch (err) {
      console.error('Failed to unban user:', err);
      alert('Failed to unban user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600/10 rounded-lg">
              <Shield className="text-red-600" size={28} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[['Total Users', users.length, 'blue', Users],
            ['Active Users', users.filter(u => !u.banned).length, 'green', Activity],
            ['Banned Users', users.filter(u => u.banned).length, 'red', Clock]
          ].map(([title, count, color, Icon]) => (
            <div key={title} className="bg-dark-200/50 backdrop-blur border-dark-300/10 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400/60 text-sm font-medium mb-1">{title}</p>
                  <h3 className="text-3xl font-bold">{count}</h3>
                </div>
                <div className={`p-3 bg-${color}-500/10 rounded-lg`}>
                  <Icon className={`text-${color}-500`} size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-dark-200/50 backdrop-blur border-dark-300/10 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-300/10">
                  <th className="py-4 px-4 text-left text-dark-400/60 font-medium">Name</th>
                  <th className="py-4 px-4 text-left text-dark-400/60 font-medium">Email</th>
                  <th className="py-4 px-4 text-left text-dark-400/60 font-medium">Role</th>
                  <th className="py-4 px-4 text-left text-dark-400/60 font-medium">Status</th>
                  <th className="py-4 px-4 text-left text-dark-400/60 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-dark-300/10 hover:bg-dark-300/5 transition-colors">
                    <td className="py-4 px-4">{user.name}</td>
                    <td className="py-4 px-4 text-dark-400/80">{user.email}</td>
                    <td className="py-4 px-4">
                      <select
                        value={user.roles[0]}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        className="bg-dark-300/20 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                      >
                        <option value="USER">User</option>
                        <option value="MODERATOR">Moderator</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.banned ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {user.banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => user.banned ? handleUnbanUser(user.id) : handleBanUser(user.id)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${user.banned ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                      >
                        {user.banned ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;