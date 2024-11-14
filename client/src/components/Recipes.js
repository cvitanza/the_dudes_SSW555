import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { RecipesContext } from '../context/RecipesContext';
import './styles/Recipes.css';

function Recipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const { recipes, setRecipes } = useContext(RecipesContext);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const fetchRecipes = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const appId = process.env.REACT_APP_API_ID;
      const appKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${searchTerm}&app_id=${appId}&app_key=${appKey}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setRecipes(data.hits || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, setRecipes]);  // `searchTerm` is the main dependency

  const handleSearch = () => fetchRecipes();
  const handleKeyDown = (e) => e.key === 'Enter' && fetchRecipes();

  const renderRecipesList = () => {
    if (loading) return <p>Loading...</p>;
    if (!recipes.length) return <p>No recipes found.</p>;

    return (
      <ul>
        {recipes.map((recipeData, index) => (
          <li key={index} className="recipes-list-item">
            <Link
              to={`/recipe/${encodeURIComponent(recipeData.recipe.uri)}`}
              state={{ recipe: recipeData.recipe }}
              className="recipes-link"
            >
              {recipeData.recipe.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    if (searchTerm) {
      fetchRecipes();
    }
  }, [searchTerm]);  // Dependency array now tracks searchTerm

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
        <button onClick={handleSearch} className="recipes-button">
          Search
        </button>
      </div>
      <div className="recipes-list">{renderRecipesList()}</div>
    </div>
  );
}

export default Recipes;
