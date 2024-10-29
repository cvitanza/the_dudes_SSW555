import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './styles/Login.css'; // Import the CSS file
import Header from './Header';

const Login = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

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
      const res = await axios.post('http://localhost:5000/api/auth/login', userData);
      const { token } = res.data;

      // Store the token in localStorage
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.log("Login failed");
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
          <h1 className="login-title">Login</h1> {/* Added h1 with a unique class */}
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