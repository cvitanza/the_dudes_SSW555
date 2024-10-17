import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/BottomNav.css'; // import styles
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HistoryIcon from '@mui/icons-material/History';
import ProfileIcon from '@mui/icons-material/AccountCircle';

function BottomNav() {
  const location = useLocation(); // Get current location (active route)

  return (
    <nav className="bottom-nav">
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/" aria-label="Home">
            <HomeIcon />
          </Link>
        </li>
        <li className={location.pathname === '/explore' ? 'active' : ''}>
          <Link to="/explore" aria-label="Explore">
            <ExploreIcon />
          </Link>
        </li>
        <li className={location.pathname === '/upload' ? 'active' : ''}>
          <Link to="/upload" aria-label="Upload">
            <CameraAltIcon />
          </Link>
        </li>
        <li className={location.pathname === '/history' ? 'active' : ''}>
          <Link to="/history" aria-label="History">
            <HistoryIcon />
          </Link>
        </li>
        <li className={location.pathname === '/profile' ? 'active' : ''}>
          <Link to="/profile" aria-label="Profile">
            <ProfileIcon />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default BottomNav;