import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { removeToken, getToken } from '../components/authService';

const DEFAULT_PORT = 5000; // Set fallback port as a constant

function Signout({ setIsAuthenticated, className }) {
  const navigate = useNavigate();

  const redirectToLogin = () => navigate('/login');
  
  const handleSignout = async () => {
    try {
      const token = getToken();

      if (!token) {
        console.error('No token found. User is not authenticated.');
        redirectToLogin(); // First navigate replaced
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || `http://localhost:${DEFAULT_PORT}`}/api/auth/signout`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      removeToken();
      setIsAuthenticated(false);
      redirectToLogin(); // Second navigate replaced
    } catch (error) {
      console.error('Error during signout', error);
    }
  };

  return (
    <button 
      className={className}
      onClick={handleSignout}
    >
      Sign Out
    </button>
  );
}

export default Signout;