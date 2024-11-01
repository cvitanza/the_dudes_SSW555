import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import './styles/Signup.css'; // Import specific Signup CSS
import Header from './Header';

const Signup = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const port = process.env.REACT_APP_PORT || 5000;
      const response = await axios.post(`http://localhost:${port}/api/auth/signup`, formData);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set Axios default header if needed
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set authenticated state and navigate to home
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  const goToLogin = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <>
      <Header title="Diet Analyzer" />
      <div className="signup-page">
        <div className="signup-container">
          <h1 className="signup-title">Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              className="signup-input"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="signup-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="signup-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="signup-input"
            />
            <button type="submit" className="signup-button">Sign Up</button>
          </form>

          {/* Button to redirect to login */}
          <p className="have-account">Already have an account?</p>
          <button onClick={goToLogin} className="go-to-login-button">Go to Login</button>
        </div>
      </div>
    </>
  );
};

export default Signup;