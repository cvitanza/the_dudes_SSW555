import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/BottomNav.css'; // import styles
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark'
import ProfileIcon from '@mui/icons-material/AccountCircle';

function BottomNav() {
  const location = useLocation(); // Get current location (active route)

  return (
    <nav className="bottom-nav">
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <HomeIcon />
          </Link>
        </li>
        <li className={location.pathname === '/recipes' ? 'active' : ''}>
          <Link to="/recipes">
            <RestaurantMenuIcon/>
          </Link>
        </li>
        <li className={location.pathname === '/upload' ? 'active' : ''}>
          <Link to="/upload">
            <CameraAltIcon />
          </Link>
        </li>
        <li className={location.pathname === '/favorites' ? 'active' : ''}>
          <Link to="/favorites">
            <BookmarkIcon />
          </Link>
        </li>
        <li className={location.pathname === '/profile' ? 'active' : ''}>
          <Link to="/profile">
            <ProfileIcon />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default BottomNav;