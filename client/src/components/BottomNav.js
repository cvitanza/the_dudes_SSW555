import React from 'react';
import { Link } from 'react-router-dom';
import './BottomNav.css'; // import styles
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HistoryIcon from '@mui/icons-material/History';
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
          <Link to="/explore">
            <ExploreIcon />
          </Link>
        </li>
        <li>
          <Link to="/upload">
            <CameraAltIcon />
          </Link>
        </li>
        <li>
          <Link to="/history">
            <HistoryIcon />
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
