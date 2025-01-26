import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <button style={styles.button} onClick={() => navigate('/')}>
        Home
      </button>
      {token ? (
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <button style={styles.button} onClick={() => navigate('/login')}>
          Login
        </button>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '50px',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    zIndex: 1000,
    color: '#fff',
  },
  button: {
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    margin: '0 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Navbar;
