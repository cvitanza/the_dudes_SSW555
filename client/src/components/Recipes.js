import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { RecipesContext } from '../context/RecipesContext';
import './styles/Recipes.css';

function Recipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const { recipes, setRecipes } = useContext(RecipesContext);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchRecipes = async () => {
    if (searchTerm.trim() === '') {
      return;
    }

    setLoading(true);
    try {
      const appId = process.env.REACT_APP_API_ID;
      const appKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${searchTerm}&app_id=${appId}&app_key=${appKey}`
      );
      const data = await response.json();
      const recipes = data.hits;
      setRecipes(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  const handleSearchClick = () => {
    fetchRecipes();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchRecipes();
    }
  };

  return (
    <div>
      <Header title="Explore Recipes" />
      
      <div className="recipes-container">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="recipes-input"
        />
        <button onClick={handleSearchClick} className="recipes-button">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="recipes-list">
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index} className="recipes-list-item">
                <Link
                  to={`/recipe/${encodeURIComponent(recipe.recipe.uri)}`}
                  state={{ recipe: recipe.recipe }}
                  className="recipes-link"
                >
                  {recipe.recipe.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
}

export default Recipes;

