import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signout = ({ setIsAuthenticated }) => { // Destructure setIsAuthenticated from props
  const navigate = useNavigate(); // Initialize useNavigate to redirect

  const handleSignout = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found. User is not authenticated.');
        navigate('/login'); // Redirect to login if there's no token
        return;
      }

      // Send request to backend to invalidate the token with Authorization header
      const port = process.env.REACT_APP_PORT || 5000;
      await axios.post(
        `http://localhost:${port}/api/auth/signout`,
        {}, // Pass an empty body if not sending any additional data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      // Remove the token from localStorage after backend confirms
      localStorage.removeItem('token');

      // Clear the Axios authorization header
      delete axios.defaults.headers.common['Authorization'];

      // Update isAuthenticated to false
      setIsAuthenticated(false); // This should now work properly

      // Redirect the user to the login page
      navigate('/login');
    } catch (error) {
      console.error('Error during signout', error);
    }
  };

  return (
    <button onClick={handleSignout}>Sign Out</button>
  );
};

export default Signout;