import React, { useState } from 'react';
import axios from 'axios'; // For HTTP requests to the backend
import Header from './Header';
import './styles/Upload.css';

function Upload({ testImageUrl, testLoading }) {
  const [imageUrl, setImageUrl] = useState(testImageUrl || '');
  const [loading, setLoading] = useState(testLoading || false);
  const [error, setError] = useState(null);
  const [nutritionData, setNutritionData] = useState({
    calories: { value: 0, unit: 'kcal' },
    protein: { value: 0, unit: 'g' },
    carbohydrates: { value: 0, unit: 'g' },
    fat: { value: 0, unit: 'g' }
  });

  // Simulated nutrition API call (to be replaced with actual API)
  const processNutritionData = async (imageFile) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate nutrition API response
      const mockNutritionData = {
        calories: { value: Math.floor(Math.random() * 800 + 200), unit: 'kcal' },
        protein: { value: Math.floor(Math.random() * 50 + 10), unit: 'g' },
        carbohydrates: { value: Math.floor(Math.random() * 100 + 30), unit: 'g' },
        fat: { value: Math.floor(Math.random() * 30 + 5), unit: 'g' }
      };
      
      setNutritionData(mockNutritionData);
      return mockNutritionData;
    } catch (err) {
      setError('Failed to process nutrition data');
      throw err;
    }
  };

  const uploadToBackend = async (file) => {
    try {
      setLoading(true);
      setError(null);

      // First, process nutrition data
      const processedNutrition = await processNutritionData(file);
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Add processed nutrition data to form data
      formData.append('calories', processedNutrition.calories.value);
      formData.append('protein', processedNutrition.protein.value);
      formData.append('carbohydrates', processedNutrition.carbohydrates.value);
      formData.append('fat', processedNutrition.fat.value);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      setImageUrl(response.data.url);
    } catch (error) {
      console.error('Error uploading:', error);
      setError(error.response?.data?.error || error.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = (useCamera = false) => {
    console.log(`${useCamera ? 'Capture' : 'Upload'} button clicked`);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (useCamera) input.capture = 'camera';
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log(`${useCamera ? 'Captured' : 'Uploaded'} photo:`, file);
        uploadToBackend(file);
      }
    };
    input.click();
  };

  // Handler for "Upload Another Meal" button
  const resetUpload = () => {
    setImageUrl('');
    setLoading(false);
  };

  return (
    <div className="upload-container">
      <Header title="Upload Meal" />
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {imageUrl && (
        <button className="another-meal-button" onClick={resetUpload}>
          Upload Another Meal
        </button>
      )}

      {!imageUrl && !loading && (
        <div className="button-container">
          <button className="upload-button" onClick={() => handleImageSelection(true)}>
            Take a Picture
          </button>
          <button className="upload-button" onClick={() => handleImageSelection()}>
            Upload a Picture
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Uploading image...</p>
        </div>
      )}

      {imageUrl && !loading && (
        <div className="meal-info-box">
          <img 
            src={imageUrl} 
            alt="Uploaded Meal" 
            className="meal-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
          <div className="meal-details">
            <h3>Nutritional Information</h3>
            <div className="nutrition-row">
              {Object.entries(nutritionData).map(([nutrient, data]) => (
                <div key={nutrient} className="nutrition-item" data-testid="nutrition-item">
                  <span className="label">{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}:</span>
                  <span className="value">{data.value}{data.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;