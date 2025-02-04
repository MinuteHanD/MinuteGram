import React, { useState, useEffect } from 'react';
import api from '../service/apiClient';
import { Shield, Users, MessageSquare, Bookmark } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-dark-100 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="text-red-600" size={24} />
          <h1 className="text-2xl font-bold text-dark-400">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-200 p-4 rounded-lg">
            <Users className="text-dark-300 mb-2" />
            <h3 className="font-semibold">Total Users</h3>
            <p className="text-2xl">{users.length}</p>
          </div>
          
        </div>

        <div className="bg-dark-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-dark-300/20">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-dark-300/10">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <select
                        value={user.roles[0]}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-dark-100 rounded p-1"
                      >
                        <option value="USER">User</option>
                        <option value="MODERATOR">Moderator</option>
                      </select>
                    </td>
                    <td className="p-2">
                      {user.banned ? (
                        <span className="text-red-500">Banned</span>
                      ) : (
                        <span className="text-green-500">Active</span>
                      )}
                    </td>
                    <td className="p-2">
                    <button
                    onClick={() => user.banned ? handleUnbanUser(user.id) : handleBanUser(user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
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