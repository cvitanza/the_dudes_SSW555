import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './styles/Home.css';

function Home() {
    const [lastMeal, setLastMeal] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLastMeal();
    }, []);

    const fetchLastMeal = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(
                `http://localhost:${process.env.REACT_APP_PORT}/api/upload/latest`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success && response.data.meal) {
                setLastMeal({
                    ...response.data.meal,
                    imageUrl: `http://localhost:${process.env.REACT_APP_PORT}${response.data.meal.imageUrl}`,
                    nutritionInfo: {
                        calories: response.data.meal.nutritionData.calories.value,
                        protein: response.data.meal.nutritionData.protein.value,
                        carbs: response.data.meal.nutritionData.carbohydrates.value,
                        fat: response.data.meal.nutritionData.fat.value
                    },
                    uploadDate: response.data.meal.createdAt
                });
            }
        } catch (error) {
            console.error('Error fetching last meal:', error);
            setError('Failed to fetch last meal');
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
                <div className="image-container">
                    <img 
                        src={lastMeal.imageUrl} 
                        alt="Last Meal" 
                        className="home-meal-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        }}
                    />
                </div>
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