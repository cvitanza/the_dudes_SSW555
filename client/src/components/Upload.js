import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Upload.css'; // Import specific Upload CSS
import Header from './Header';

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
  const navigate = useNavigate();

  const handleTokenExpiration = () => {
    // Clear local storage
    localStorage.clear();
    // Redirect to login with a message
    navigate('/login', { 
      state: { 
        message: 'Your session has expired. Please log in again.' 
      } 
    });
  };

  const uploadToBackend = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create form data with the image
      const formData = new FormData();
      formData.append('image', file);

      try {
        const detectResponse = await axios.post(
          `http://localhost:${process.env.REACT_APP_PORT}/api/nutrition/detect`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            },
          }
        );

        if (detectResponse.data.success && detectResponse.data.foods) {
          const food = detectResponse.data.foods[0];
          
          // Create temporary URL for the uploaded image
          const imageObjectUrl = URL.createObjectURL(file);
          
          // Save meal with image and nutrition data
          const saveMealFormData = new FormData();
          saveMealFormData.append('image', file);
          
          const nutritionData = {
            calories: { value: food.calories, unit: 'kcal' },
            protein: { value: food.protein, unit: 'g' },
            carbohydrates: { value: food.carbs, unit: 'g' },
            fat: { value: food.fat, unit: 'g' }
          };
          
          saveMealFormData.append('nutritionData', JSON.stringify(nutritionData));

          const saveMealResponse = await axios.post(
            `http://localhost:${process.env.REACT_APP_PORT}/api/upload/save`,
            saveMealFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
            }
          );

          if (saveMealResponse.data.success) {
            setImageUrl(imageObjectUrl);
            setNutritionData(nutritionData);
            navigate('/');
          }
        }
      } catch (error) {
        if (error.response?.status === 401 && error.response?.data?.isExpired) {
          handleTokenExpiration();
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error uploading:', error);
      if (error.response?.status === 401) {
        handleTokenExpiration();
      } else {
        setError(error.response?.data?.error || error.message || 'Failed to upload image');
      }
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
          <p>Analyzing your meal...</p>
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
