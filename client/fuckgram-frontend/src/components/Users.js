import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users'); // Admin endpoint
      setUsers(response.data);
    } catch (err) {
      alert('Failed to fetch users');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
