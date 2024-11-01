import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/RecipeDetail.css';

function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe } = location.state || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  // Helper function to format meal type
  const formatMealType = (mealType) => {
    return mealType
      .split('/')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('/');
  };

  return (
    <div className="recipe-detail-container">
      <button onClick={handleBackClick} className="back-button">
        ← <span style={{ marginLeft: '15px' }}>Back</span>
      </button>

      {recipe ? (
        <>
          <div className="recipe-title">
            <h1>{recipe.label}</h1>
          </div>

          <div className="recipe-image-container">
            <img src={recipe.image} alt={recipe.label} className="recipe-image" />
          </div>

          <div className="recipe-details">
            <h2>Recipe Details</h2>
            <p><strong>Cuisine:</strong> {recipe.cuisineType?.map(type => type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()).join(', ')}</p>
            <p><strong>Meal Type:</strong> {recipe.mealType?.map(type => formatMealType(type)).join(', ')}</p>
            {recipe.url && (
              <p>
                <strong>URL:</strong> <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a>
              </p>
            )}
          </div>

          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>- {ingredient.text}</li>
              ))}
            </ul>
          </div>

          <div className="nutrition-section">
            <h2>Nutritional Information</h2>
            <p><strong>Calories:</strong> {recipe.totalNutrients?.ENERC_KCAL?.quantity.toFixed(0)} kcal</p>
            <p><strong>Protein:</strong> {recipe.totalNutrients?.PROCNT?.quantity.toFixed(1)} g</p>
            <p><strong>Fat:</strong> {recipe.totalNutrients?.FAT?.quantity.toFixed(1)} g</p>
            <p><strong>Carbohydrates:</strong> {recipe.totalNutrients?.CHOCDF?.quantity.toFixed(1)} g</p>
          </div>

          <div className="health-labels-section">
            <h2>Health Labels</h2>
            <div className="health-labels-container">
              {recipe.healthLabels?.map((label, index) => (
                <span key={index} className="health-label">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>No recipe details found.</p>
      )}
    </div>
  );
}

export default RecipeDetail;
