import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './styles/Login.css'; // Import the CSS file
import Header from './Header';

// Constants to avoid duplicated literals
const TOKEN_KEY = 'token';
const API_URL = process.env.REACT_APP_API_URL || `http://localhost:${process.env.REACT_APP_PORT || 5000}`;

const Login = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null); // State for error message

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, userData);
      const { token } = res.data;

      // Store the token in localStorage
      localStorage.setItem(TOKEN_KEY, token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      // Display an error message to the user
      setError("Login failed. Please check your credentials and try again.");
      console.log("Login failed", error);
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <>
      <Header title="Diet Analyzer" />
      <div className="login-page"> {/* Wrapper div for centering */}
        <div className="login-container">
          <h1 className="login-title">Login</h1>
          
          {/* Show error message if login fails */}
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              className="login-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              className="login-input"
            />
            <button type="submit" className="login-button">Login</button>
          </form>

          <p className="signup-link">Don't have an account?</p>
          <button onClick={goToSignup} className="signup-link-button">Go to Signup</button>
        </div>
      </div>
    </>
  );
};

export default Login;
