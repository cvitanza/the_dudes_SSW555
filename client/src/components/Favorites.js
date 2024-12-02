import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Favorites.css'; // Add specific CSS for styling

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch favorites on component load
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:5000/api/favorites', {
       
        });

        if (response.data.success) {
          setFavorites(response.data.data);
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
      <h1>Your Favorite Meals</h1>

      {loading && <p>Loading your favorites...</p>}
      {error && <p className="error-message">{error}</p>}

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <div key={favorite._id} className="favorite-item">
              <img
                src={favorite.imageUrl}
                alt={favorite.label}
                className="favorite-image"
              />
              <div className="favorite-details">
                <h3>{favorite.label}</h3>
                <p>Calories: {favorite.nutritionData.calories.value} {favorite.nutritionData.calories.unit}</p>
                <p>Protein: {favorite.nutritionData.protein.value} {favorite.nutritionData.protein.unit}</p>
                <p>Carbs: {favorite.nutritionData.carbohydrates.value} {favorite.nutritionData.carbohydrates.unit}</p>
                <p>Fat: {favorite.nutritionData.fat.value} {favorite.nutritionData.fat.unit}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>You have no favorite meals saved yet.</p>
      )}
    </div>
  );
}

export default Favorites;