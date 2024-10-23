import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe } = location.state || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {recipe ? (
        <>
          {/* Container for the header section */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            {/* Back Button */}
            <button
              onClick={handleBackClick}
              style={{
                background: 'none',
                border: 'none',
                color: '#007BFF',
                fontSize: '18px',
                cursor: 'pointer',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              ← <span style={{ marginLeft: '5px' }}>Back</span>
            </button>

            {/* Centered Recipe Title */}
            <h1 style={{ textAlign: 'center', margin: '0' }}>{recipe.label}</h1>
          </div>

          {/* Recipe Image and Details */}
          <img src={recipe.image} alt={recipe.label} style={{ width: '300px', height: '300px' }} />
          <p><strong>Cuisine:</strong> {recipe.cuisineType?.join(', ')}</p>
          <p><strong>Meal Type:</strong> {recipe.mealType?.join(', ')}</p>
          <p><strong>Ingredients:</strong></p>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.text}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>No recipe details found.</p>
      )}
    </div>
  );
}

export default RecipeDetail;

