import React from 'react';
import { Link } from 'react-router-dom';
import './BottomNav.css'; // import styles
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ProfileIcon from '@mui/icons-material/AccountCircle';

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <ul>
        <li>
          <Link to="/">
            <HomeIcon />
          </Link>
        </li>
        <li>
          <Link to="/recipes">
            <RestaurantMenuIcon />
          </Link>
        </li>
        <li>
          <Link to="/upload">
            <CameraAltIcon />
          </Link>
        </li>
        <li>
          <Link to="/favorites">
            <BookmarkIcon />
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <ProfileIcon />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default BottomNav;
