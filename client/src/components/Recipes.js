import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

function Recipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchRecipes = async () => {
    if (searchTerm.trim() === '') {
      return; // Don't search if the search term is empty
    }

    setLoading(true);
    try {
      const appId = '82ccafe2';
      const appKey = 'e56201c68f9f6dc852d51840340d490c';
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${searchTerm}&app_id=${appId}&app_key=${appKey}`
      );
      const data = await response.json();

      const topRecipes = data.hits.slice(0, 10);
      setRecipes(topRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  const handleSearchClick = () => {
    fetchRecipes();
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

      <div style={{ padding: '20px' }}>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index} style={{ padding: '10px 0', fontSize: '18px' }}>
                <Link
                  to={`/recipe/${encodeURIComponent(recipe.recipe.uri)}`}
                  state={{ recipe: recipe.recipe }} // Pass the entire recipe object
                  style={{ textDecoration: 'none', color: '#007BFF' }}
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
