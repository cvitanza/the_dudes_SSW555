import React, { useState, useEffect } from 'react';
import Header from './Header';
import Signout from './Signout';
import axios from 'axios';
import './styles/Profile.css';

function Profile({ setIsAuthenticated }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No token found, please log in.');
          setLoading(false);
          return;
        }

        // Make API call to the profile endpoint with Authorization header
        const port = process.env.REACT_APP_PORT || 5000;
        const response = await axios.get(`http://localhost:${port}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data); // Set the response data in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        console.error('Error fetching profile:', err);

        // If error is unauthorized (401), log out the user
        if (err.response && err.response.status === 401) {
          setError('Session expired, please log in again.');
          setIsAuthenticated(false); // Log out the user by clearing the authentication state
          localStorage.removeItem('token'); // Clear token from localStorage
        } else {
          setError('Failed to fetch profile data');
        }

        setLoading(false);
      }
    };

    fetchProfile();
  }, [setIsAuthenticated]); // Add setIsAuthenticated as a dependency

  return (
    <div>
      <Header title="My Profile" />
      
      <div className='profile-container'>
        
        {/* Loading state */}
        {loading && <p>Loading profile data...</p>}

        {/* Display error message if fetching profile fails */}
        {error && <p>{error}</p>}

        {/* Render profile info if available */}
        {userData && !loading && !error ? (
          <div>
            <div className="profile-info">
              <div className="profile-info-content">
                <span className="profile-info-left">{userData?.firstName && userData?.lastName ? `${userData.firstName} ${userData.lastName}` : 'Name not available'}</span>
                <span className="profile-info-right">{userData?.email || 'Email not available'}</span>
              </div>
            </div>
            <div className="profile-header-container">
              <Signout setIsAuthenticated={setIsAuthenticated} className="signout-button" />
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}

export default Profile;