import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import './styles/Favorites.css';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                setError(null);
              
                const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT}/api/favorites`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data.success) {
                    const uniqueFavorites = response.data.data.reduce((acc, current) => {
                        const isDuplicate = acc.some(item => 
                            item.label === current.label &&
                            JSON.stringify(item.ingredients) === JSON.stringify(current.ingredients) &&
                            item.nutritionData.calories.value === current.nutritionData.calories.value &&
                            item.nutritionData.protein.value === current.nutritionData.protein.value &&
                            item.nutritionData.carbohydrates.value === current.nutritionData.carbohydrates.value &&
                            item.nutritionData.fat.value === current.nutritionData.fat.value
                        );
                        if (!isDuplicate) {
                            return acc.concat([current]);
                        }
                        return acc;
                    }, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


                    setFavorites(uniqueFavorites);
                } else {
                    throw new Error('Failed to fetch favorites.');
                }
            } catch (err) {
                console.error('Error fetching favorites:', err);
                setError(err.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="favorites-container">
            <Header title="My Favorite Meals" />
            {loading && <p>Loading your favorites...</p>}
            {error && <p className="error-message">{error}</p>}
            {favorites.length > 0 ? (
                <div className="favorites-content-container">
                    <div className="favorites-grid">
                        {favorites.map((favorite) => (
                            <div key={favorite._id} className="favorites-card">
                                <Link to={`/recipe/${encodeURIComponent(favorite._id)}`} state={{ recipe: favorite }} className="favorites-link">
                                    <img src={favorite.imageUrl} alt={favorite.label} className="favorites-image" />
                                    <div className="favorites-details">
                                        <h3 className="favorites-title">{favorite.label}</h3>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                !loading && <p>You have no favorite meals saved yet.</p>
            )}
        </div>
    );
}

export default Favorites;
