import React from 'react';
import { useLocation } from 'react-router-dom';

function RecipeDetail() {
  const location = useLocation();
  const { recipe } = location.state || {};

  return (
    <div style={{ padding: '20px' }}>
      {recipe ? (
        <>
          <h1>{recipe.label}</h1>
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
