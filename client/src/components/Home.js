import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import './styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [lastMeal, setLastMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLastMeal();
  }, []);

  const fetchLastMeal = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/upload/latest', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLastMeal(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching last meal:', error);
      if (error.response?.status === 404) {
        setLastMeal(null);
      } else {
        setError('Failed to fetch your last meal');
      }
    } finally {
      setLoading(false);
    }
  };

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

    return (
      <div className="home-meal-info-box">
        <h2 className="meal-title">My Last Meal</h2>
        <img 
          src={lastMeal.imageUrl} 
          alt="Last Meal" 
          className="home-meal-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
          }}
        />
        <div className="home-meal-details">
          <div className="nutrition-info">
            <div className="nutrition-row">
              <div className="nutrition-item">
                <span className="label">Calories:</span>
                <span className="value">{lastMeal.nutritionInfo?.calories || 0} kcal</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Protein:</span>
                <span className="value">{lastMeal.nutritionInfo?.protein || 0}g</span>
              </div>
            </div>
            <div className="nutrition-row">
              <div className="nutrition-item">
                <span className="label">Carbs:</span>
                <span className="value">{lastMeal.nutritionInfo?.carbs || 0}g</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Fat:</span>
                <span className="value">{lastMeal.nutritionInfo?.fat || 0}g</span>
              </div>
            </div>
          </div>
          {lastMeal.uploadDate && (
            <div className="upload-date">
              Uploaded: {new Date(lastMeal.uploadDate).toLocaleDateString()}
            </div>
          )}
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
          onClick={() => navigate('/upload')}>
          Upload My Meal
        </button>
        {renderLastMeal()}
      </div>
    </div>
  );
}

export default Home;