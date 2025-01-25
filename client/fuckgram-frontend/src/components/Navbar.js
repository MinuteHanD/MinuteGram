import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      <button style={styles.button} onClick={() => navigate('/')}>
        Home
      </button>
      {/* Add more buttons here as needed */}
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
