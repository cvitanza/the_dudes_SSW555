import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/RecipeDetail.css';

function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe } = location.state || {};

  const handleBackClick = () => navigate(-1);

  // Helper functions
  const formatMealType = (mealType) => {
    if (typeof mealType === 'string') {
      return mealType
        .split('/')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('/');
    }
    return mealType;
  };

  const formatNutrient = (nutrient, decimalPlaces = 1) =>
    nutrient ? nutrient.quantity.toFixed(decimalPlaces) : 'N/A';

  const renderListItems = (items, Component) =>
    items?.length ? items.map((item, index) => <Component key={index} item={item} />) : null;

  // Inner component definitions with access to helper functions
  const IngredientItem = ({ item }) => <li>- {item.text}</li>;

  const CuisineType = ({ item }) => (
    <span>{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}</span>
  );

  // Use formatMealType here directly
  const MealType = ({ item }) => (
    <span>{formatMealType(item)}</span>
  );

  const HealthLabel = ({ item }) => <span className="health-label">{item}</span>;

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
            <p><strong>Cuisine:</strong> {renderListItems(recipe.cuisineType, CuisineType)}</p>
            <p><strong>Meal Type:</strong> {renderListItems(recipe.mealType, MealType)}</p>
            {recipe.url && (
              <p>
                <strong>URL:</strong>{' '}
                <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a>
              </p>
            )}
          </div>

          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {renderListItems(recipe.ingredients, IngredientItem)}
            </ul>
          </div>

          <div className="nutrition-section">
            <h2>Nutritional Information</h2>
            <p><strong>Calories:</strong> {formatNutrient(recipe.totalNutrients?.ENERC_KCAL, 0)} kcal</p>
            <p><strong>Protein:</strong> {formatNutrient(recipe.totalNutrients?.PROCNT)} g</p>
            <p><strong>Fat:</strong> {formatNutrient(recipe.totalNutrients?.FAT)} g</p>
            <p><strong>Carbohydrates:</strong> {formatNutrient(recipe.totalNutrients?.CHOCDF)} g</p>
          </div>

          <div className="health-labels-section">
            <h2>Health Labels</h2>
            <div className="health-labels-container">
              {renderListItems(recipe.healthLabels, HealthLabel)}
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

