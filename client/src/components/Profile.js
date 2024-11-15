import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Signout from './Signout';
import axios from 'axios';
import './styles/Profile.css';

function Profile({ setIsAuthenticated }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get the token from localStorage to use in both functions
  const token = localStorage.getItem('token');

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    const port = process.env.REACT_APP_PORT || 5000;

    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:${port}/api/auth/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          alert("Account deleted successfully.");
          setIsAuthenticated(false); // Clear authentication state
          localStorage.removeItem('token'); // Remove token from storage
          navigate('/login'); // Redirect to login page
        } else {
          alert("Failed to delete account.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setError('No token found, please log in.');
          setLoading(false);
          return;
        }

        const port = process.env.REACT_APP_PORT || 5000;
        const response = await axios.get(`http://localhost:${port}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);

        if (err.response && err.response.status === 401) {
          setError('Session expired, please log in again.');
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        } else {
          setError('Failed to fetch profile data');
        }

        setLoading(false);
      }
    };

    fetchProfile();
  }, [setIsAuthenticated, token]);

  return (
    <div>
      <Header title="My Profile" />
      
      <div className='profile-container'>
        
        {loading && <p>Loading profile data...</p>}
        {error && <p>{error}</p>}

        {userData && !loading && !error ? (
          <div>
            <div className="profile-info">
              <div className="profile-info-content">
                <span className="profile-info-left">
                  {userData?.firstName && userData?.lastName ? `${userData.firstName} ${userData.lastName}` : 'Name not available'}
                </span>
                <span className="profile-info-right">{userData?.email || 'Email not available'}</span>
              </div>
            </div>
            <div className="profile-header-container">
              <Signout setIsAuthenticated={setIsAuthenticated} className="signout-button" />
              <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Profile;