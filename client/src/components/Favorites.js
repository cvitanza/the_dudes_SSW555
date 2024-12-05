import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./styles/Favorites.css"; // Add specific CSS for styling

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

        const response = await axios.get(
          `http://localhost:${process.env.REACT_APP_PORT}/api/favorites`,
          {}
        );

        if (response.data.success) {
          setFavorites(response.data.data);
        } else {
          throw new Error("Failed to fetch favorites.");
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError(err.message || "An unexpected error occurred.");
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
                <img
                  src={
                    favorite.imageUrl ||
                    "https://via.placeholder.com/150?text=No+Image"
                  }
                  alt={favorite.label}
                  className="favorites-image"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loops
                    e.target.src =
                      "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
                <div className="favorites-details">
                  <h3 className="favorites-title">{favorite.label}</h3>
                  <div className="favorites-nutrition">
                    <p>
                      Calories:{" "}
                      {(favorite.nutritionData.calories.value || 0).toFixed(1)}{" "}
                      {favorite.nutritionData.calories.unit}
                    </p>
                    <p>
                      Protein:{" "}
                      {(favorite.nutritionData.protein.value || 0).toFixed(1)}{" "}
                      {favorite.nutritionData.protein.unit}
                    </p>
                    <p>
                      Carbs:{" "}
                      {(
                        favorite.nutritionData.carbohydrates.value || 0
                      ).toFixed(1)}{" "}
                      {favorite.nutritionData.carbohydrates.unit}
                    </p>
                    <p>
                      Fat: {(favorite.nutritionData.fat.value || 0).toFixed(1)}{" "}
                      {favorite.nutritionData.fat.unit}
                    </p>
                  </div>
                </div>
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
