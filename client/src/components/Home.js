import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './styles/Home.css';

function Home() {
  const [lastMeal, setLastMeal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check user authentication
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch last meal from the server
  const fetchLastMeal = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:${process.env.REACT_APP_PORT}/api/upload/latest`
      );

      if (response.data.success && response.data.meal) {
        setLastMeal({
          ...response.data.meal,
          imageUrl: `http://localhost:${process.env.REACT_APP_PORT}${response.data.meal.imageUrl}`,
          nutritionInfo: response.data.meal.nutritionData,
          uploadDate: response.data.meal.createdAt,
        });
      }
    } catch (error) {
      console.error('Error fetching last meal:', error);
      setError('Failed to fetch last meal.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLastMeal();
  }, [fetchLastMeal]);

  // Render last meal section
  const renderLastMeal = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!lastMeal) {
      return <div className="no-meal">No meals uploaded yet</div>;
    }

    const { imageUrl, nutritionInfo, uploadDate } = lastMeal;

    return (
      <div className="home-meal-info-box">
        <h2 className="meal-title">My Last Meal</h2>
        <div className="meal-content">
          <img
            src={imageUrl}
            alt="Last Meal"
            className="home-meal-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
          <div className="meal-details">
            <h3>Nutrition Information</h3>
            <div className="nutrition-info">
              <div className="nutrition-row">
                <div className="nutrition-item">
                  <span className="label">Calories:</span>
                  <span className="value">
                    {(nutritionInfo?.calories?.value || 0).toFixed(1)}{' '}
                    {nutritionInfo?.calories?.unit || 'kcal'}
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Protein:</span>
                  <span className="value">
                    {(nutritionInfo?.protein?.value || 0).toFixed(1)}{' '}
                    {nutritionInfo?.protein?.unit || 'g'}
                  </span>
                </div>
              </div>
              <div className="nutrition-row">
                <div className="nutrition-item">
                  <span className="label">Carbs:</span>
                  <span className="value">
                    {(nutritionInfo?.carbohydrates?.value || 0).toFixed(1)}{' '}
                    {nutritionInfo?.carbohydrates?.unit || 'g'}
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Fat:</span>
                  <span className="value">
                    {(nutritionInfo?.fat?.value || 0).toFixed(1)}{' '}
                    {nutritionInfo?.fat?.unit || 'g'}
                  </span>
                </div>
              </div>
            </div>
            {uploadDate && (
              <div className="upload-date">
                Uploaded: {new Date(uploadDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="home-container">
      <Header title="My Home" />
      <div className="content-container">
        <button
          className="upload-shortcut"
          onClick={() => navigate('/upload')}
        >
          Upload My Meal
        </button>
        {renderLastMeal()}
      </div>
    </div>
  );
}

export default Home;