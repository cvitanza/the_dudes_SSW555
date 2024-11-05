import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Upload from './components/Upload';
import Profile from './components/Profile';
import RecipeDetail from './components/RecipeDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import { RecipesProvider } from './context/RecipesContext';
import React from 'react';
import './App.css';
import Favorites from './components/Favorites';
import Recipes from './components/Recipes';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Log the token
    
    if (token) {
      // Set the Authorization header for all Axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      console.log("User is authenticated"); // Log if user is authenticated
    } else {
      setIsAuthenticated(false);
      console.log("User is not authenticated"); // Log if user is not authenticated
    }
  }, []);

  console.log("isAuthenticated state:", isAuthenticated); // Log the current isAuthenticated state

  return (
    <RecipesProvider>
      <Router>
        <div className="App">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect all other routes to login */}
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to home */}
              </>
            )}
          </Routes>

          {/* Conditionally render BottomNav if authenticated */}
          {isAuthenticated && <BottomNav />}
        </div>
      </Router>
    </RecipesProvider>
  );
}

export default App;


