import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RecipesContext } from '../context/RecipesContext';
import './styles/RecipeDetail.css';

function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe } = location.state || {};
  const { setFavorites } = useContext(RecipesContext);

  console.log('Recipe data:', recipe);
  console.log('Image URL:', recipe?.imageUrl);

  const handleBackClick = () => navigate(-1);

  const handleAddToFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:${process.env.REACT_APP_PORT}/api/favorites`, {
        label: recipe.label,
        imageUrl: recipe.imageUrl,
        nutritionData: {
          calories: {
            value: parseFloat(recipe.totalNutrients?.ENERC_KCAL?.quantity) || 0,
            unit: 'kcal',
          },
          protein: {
            value: parseFloat(recipe.totalNutrients?.PROCNT?.quantity) || 0,
            unit: 'g',
          },
          carbohydrates: {
            value: parseFloat(recipe.totalNutrients?.CHOCDF?.quantity) || 0,
            unit: 'g',
          },
          fat: {
            value: parseFloat(recipe.totalNutrients?.FAT?.quantity) || 0,
            unit: 'g',
          },
        },
        ingredients: recipe.ingredients.map(ingredient => ingredient.text),
        cuisineType: recipe.cuisineType[0],
        mealType: recipe.mealType[0],
        url: recipe.url,
        healthLabels: recipe.healthLabels || [],
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setFavorites(prev => [...prev, response.data.data]);
        alert('Recipe added to favorites!');
      } else {
        console.error('Failed to add to favorites:', response.data.message);
        alert('Failed to add to favorites.');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites.');
    }
  };

  const formatMealType = (mealType) => {
    if (typeof mealType === 'string') {
      return mealType
        .split('/')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('/');
    }
    return mealType;
  };

  const renderListItems = (items, ItemComponent) => {
    if (!Array.isArray(items)) {
      console.error('Expected an array but received:', items);
      return null; // or return a fallback UI
    }
    return items.map((item, index) => <ItemComponent key={index} item={item} />);
  };

  const IngredientItem = ({ item }) => <li>- {item.text || item}</li>;

  const CuisineType = ({ item }) => (
    <span>{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}</span>
  );

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

          <button onClick={handleAddToFavorites} className="add-to-favorites-button">Add to Favorites</button>

          <div className="recipe-image-container">
            <img src={recipe.imageUrl} alt={recipe.label} className="recipe-image" />
          </div>

          <div className="recipe-details">
            <h2>Recipe Details</h2>
            <p><strong>Cuisine:</strong> {renderListItems(Array.isArray(recipe.cuisineType) ? recipe.cuisineType : [recipe.cuisineType], CuisineType)}</p>
            <p><strong>Meal Type:</strong> {renderListItems(Array.isArray(recipe.mealType) ? recipe.mealType : [recipe.mealType], MealType)}</p>
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
            <p><strong>Calories:</strong> {recipe.nutritionData?.calories?.value ? parseFloat(recipe.nutritionData.calories.value).toFixed(1) : 'N/A'} {recipe.nutritionData?.calories?.unit || ''}</p>
            <p><strong>Protein:</strong> {recipe.nutritionData?.protein?.value ? parseFloat(recipe.nutritionData.protein.value).toFixed(1) : 'N/A'} {recipe.nutritionData?.protein?.unit || ''}</p>
            <p><strong>Fat:</strong> {recipe.nutritionData?.fat?.value ? parseFloat(recipe.nutritionData.fat.value).toFixed(1) : 'N/A'} {recipe.nutritionData?.fat?.unit || ''}</p>
            <p><strong>Carbohydrates:</strong> {recipe.nutritionData?.carbohydrates?.value ? parseFloat(recipe.nutritionData.carbohydrates.value).toFixed(1) : 'N/A'} {recipe.nutritionData?.carbohydrates?.unit || ''}</p>
          </div>

          <div className="health-labels-section">
            <h2>Health Labels</h2>
            <div className="health-labels-container">
              {renderListItems(recipe.healthLabels || [], HealthLabel)}
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

