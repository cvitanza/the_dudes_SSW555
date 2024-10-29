import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { RecipesContext } from '../context/RecipesContext';

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
      const appId = '82ccafe2';
      const appKey = 'e56201c68f9f6dc852d51840340d490c';
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
      
      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          style={{
            flex: '1',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleSearchClick}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007BFF',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div style={{ padding: '20px', paddingBottom: '60px' }}> {/* Added paddingBottom for space below */}
        {recipes.length > 0 ? (
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}> {/* Remove bullet points */}
            {recipes.map((recipe, index) => (
              <li key={index} style={{ padding: '10px 0', fontSize: '18px', textAlign: 'left' }}> {/* Left-align links */}
                <Link
                  to={`/recipe/${encodeURIComponent(recipe.recipe.uri)}`}
                  state={{ recipe: recipe.recipe }}
                  style={{
                    textDecoration: 'none',
                    color: '#007BFF',
                    display: 'block', // Make the link span the full width
                  }}
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
