import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Explore from './components/Explore';
import Upload from './components/Upload';
import History from './components/History';
import Profile from './components/Profile';
import React from 'react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">

        {/* Define the routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore/>} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/History" element={<History/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>

        {/* Fixed bottom navigation bar */}
        <BottomNav />

      </div>
    </Router>
  );
}

export default App;