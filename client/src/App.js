import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Upload from './components/Upload';
import Profile from './components/Profile';
import React from 'react';
import './App.css';
import Favorites from './components/Favorites';
import Recipes from './components/Recipes';

function App() {
  return (
    <Router>
      <div className="App">

        {/* Define the routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes/>} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/favorites" element={<Favorites/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>

        {/* Fixed bottom navigation bar */}
        <BottomNav />

      </div>
    </Router>
  );
}

export default App;