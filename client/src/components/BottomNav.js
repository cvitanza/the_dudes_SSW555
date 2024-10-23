import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/BottomNav.css'; // import styles
import HomeIcon from '@mui/icons-material/Home';
import RecipesIcon from '@mui/icons-material/RestaurantMenu';
import UploadIcon from '@mui/icons-material/CameraAlt';
import FavoritesIcon from '@mui/icons-material/Bookmark'
import ProfileIcon from '@mui/icons-material/AccountCircle';

function BottomNav() {
  const location = useLocation(); 

  return (
    <nav className="bottom-nav">
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/" aria-label="Home">
            <HomeIcon />
          </Link>
        </li>
        <li className={location.pathname === '/recipes' ? 'active' : ''}>
          <Link to="/recipes" aria-label="Recipes">
            <RecipesIcon />
          </Link>
        </li>
        <li className={location.pathname === '/upload' ? 'active' : ''}>
          <Link to="/upload" aria-label="Upload">
            <UploadIcon />
          </Link>
        </li>
        <li className={location.pathname === '/favorites' ? 'active' : ''}>
          <Link to="/favorites" aria-label="Favorites">
            <FavoritesIcon />
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