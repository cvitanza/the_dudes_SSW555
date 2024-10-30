import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './styles/Home.css';

// Import the placeholder image
import placeholderImage from './dummy/placeholder_meal.jpg';

function Home() {
  const navigate = useNavigate();

  // TODO: backend instead of random display
  const fetchLastMeal = () => {
    // Generate random nutrition values
    const calories = Math.floor(Math.random() * 800) + 200; // Random calories between 200 and 1000
    const protein = Math.floor(Math.random() * 50) + 10; // Random protein between 10g and 60g
    const fat = Math.floor(Math.random() * 30) + 5; // Random fat between 5g and 35g
    const carbs = Math.floor(Math.random() * 100) + 30; // Random carbs between 30g and 130g

    return {
      imageUrl: placeholderImage, // Use the imported image
      nutritionInfo: {
        calories: calories,
        protein: protein,
        fat: fat,
        carbs: carbs,
      }
    };
  };

  const fetchHealthProgress = () => {
    return {
      currentCalories: 'N/A',
      goalCalories: 'N/A'
    };
  };

  const lastMeal = fetchLastMeal();
  const healthProgress = fetchHealthProgress();

  return (
    <div className="home-container">
      <Header title="My Home" />
      <div className="content-container">

        {/* Upload Meal Button */}
        <button 
          className="upload-shortcut" 
          onClick={() => navigate('/upload')}>
          Upload My Meal
        </button>

        {/* Last Meal Section */}
        <div className="info">
          <h2>My Last Meal</h2>
          <img src={lastMeal.imageUrl} alt="Last Meal" className="meal-image" />
          <div className="nutrition-info">
            <h3>Nutritional Information</h3>
            <div className="nutrition-row">
              <div className="nutrition-item">
                <span className="label">Calories:</span>
                <span className="value">{lastMeal.nutritionInfo.calories} kcal</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Protein:</span>
                <span className="value">{lastMeal.nutritionInfo.protein}g</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Carbohydrates:</span>
                <span className="value">{lastMeal.nutritionInfo.carbs}g</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Fat:</span>
                <span className="value">{lastMeal.nutritionInfo.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Progress Section */}
        <div className="info">
          <h2>My Health Progress</h2>
          <p>Current Calories: {healthProgress.currentCalories}</p>
          <p>Goal Calories: {healthProgress.goalCalories}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;