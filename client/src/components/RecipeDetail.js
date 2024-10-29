import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Fixed Back Button */}
      <button
        onClick={handleBackClick}
        style={{
          background: 'none',
          border: 'none',
          color: '#007BFF',
          fontSize: '18px',
          cursor: 'pointer',
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000, // Ensure it stays on top
        }}
      >
        ← <span style={{ marginLeft: '15px' }}>Back</span>
      </button>

      {recipe ? (
        <>
          {/* Recipe Title */}
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <h1 style={{ margin: '0', padding: '0' }}>{recipe.label}</h1>
          </div>

          {/* Recipe Image */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <img
              src={recipe.image}
              alt={recipe.label}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                borderRadius: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>

          {/* Recipe Details with Cuisine, Meal Type, and URL */}
          <div style={{
            backgroundColor: '#eaf1ff',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '15px',
          }}>
            <h2 style={{ marginBottom: '10px' }}>Recipe Details</h2>
            <p><strong>Cuisine:</strong> {recipe.cuisineType?.map(type => type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()).join(', ')}</p>
            <p><strong>Meal Type:</strong> {recipe.mealType?.map(type => formatMealType(type)).join(', ')}</p>
            {recipe.url && (
              <p>
                <strong>URL:</strong> <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a>
              </p>
            )}
          </div>

          {/* Ingredients Section */}
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '15px',
          }}>
            <h2 style={{ marginBottom: '10px' }}>Ingredients</h2>
            <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'none' }}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} style={{ marginBottom: '5px', textAlign: 'left' }}>
                  - {ingredient.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Nutritional Information */}
          <div style={{
            backgroundColor: '#f4f4f4',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '15px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ marginBottom: '10px' }}>Nutritional Information</h2>
            <p><strong>Calories:</strong> {recipe.totalNutrients?.ENERC_KCAL?.quantity.toFixed(0)} kcal</p>
            <p><strong>Protein:</strong> {recipe.totalNutrients?.PROCNT?.quantity.toFixed(1)} g</p>
            <p><strong>Fat:</strong> {recipe.totalNutrients?.FAT?.quantity.toFixed(1)} g</p>
            <p><strong>Carbohydrates:</strong> {recipe.totalNutrients?.CHOCDF?.quantity.toFixed(1)} g</p>
          </div>

          {/* Health Labels Section */}
          <div style={{
            backgroundColor: '#fffbea',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '15px',
          }}>
            <h2 style={{ marginBottom: '10px' }}>Health Labels</h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              {recipe.healthLabels?.map((label, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#d1e7ff',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    color: '#333',
                  }}
                >
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
