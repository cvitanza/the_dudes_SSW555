import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { RecipesContext } from '../context/RecipesContext';
import axios from 'axios';
import './styles/Recipes.css';

function Recipes() {
    const [searchTerm, setSearchTerm] = useState('');
    const { recipes, setRecipes } = useContext(RecipesContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT}/api/recipes/search`, {
                params: { searchTerm },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setRecipes(response.data.hits || []);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            console.error('Error fetching recipes:', errorMessage);
            setError('Failed to fetch recipes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <Header title="Explore Recipes" />
            <div className="recipes-container">
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    className="recipes-input"
                />
                <button onClick={handleSearch} className="recipes-button" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="recipes-list">
                {loading ? (
                    <p>Loading...</p>
                ) : recipes.length ? (
                    <ul>
                        {recipes.map((recipeData, index) => (
                            <li key={index} className="recipes-list-item">
                                <Link
                                    to={`/recipe/${encodeURIComponent(recipeData.recipe.uri)}`}
                                    state={{ 
                                        recipe: { 
                                            ...recipeData.recipe, 
                                            imageUrl: recipeData.recipe.image,
                                            nutritionData: {
                                                calories: {
                                                    value: recipeData.recipe.totalNutrients?.ENERC_KCAL?.quantity || 0,
                                                    unit: 'kcal',
                                                },
                                                protein: {
                                                    value: recipeData.recipe.totalNutrients?.PROCNT?.quantity || 0,
                                                    unit: 'g',
                                                },
                                                carbohydrates: {
                                                    value: recipeData.recipe.totalNutrients?.CHOCDF?.quantity || 0,
                                                    unit: 'g',
                                                },
                                                fat: {
                                                    value: recipeData.recipe.totalNutrients?.FAT?.quantity || 0,
                                                    unit: 'g',
                                                },
                                            },
                                        }
                                    }}
                                    className="recipes-link"
                                >
                                    {recipeData.recipe.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recipes found.</p>
                )}
            </div>
        </div>
    );
}

export default Recipes;
