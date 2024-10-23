import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Upload from './components/Upload';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import Recipes from './components/Recipes';
import RecipeDetail from './components/RecipeDetail';
import { RecipesProvider } from './context/RecipesContext'; 
import React from 'react';
import './App.css';

function App() {
  return (
    <RecipesProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </RecipesProvider>
  );
}

export default App;

