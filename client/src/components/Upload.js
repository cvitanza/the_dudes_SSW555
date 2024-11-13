import React, { useState } from 'react';
import axios from 'axios'; // For HTTP requests to the backend
import Header from './Header';
import './styles/Upload.css';

function Upload({ testImageUrl, testLoading }) {
  const [imageUrl, setImageUrl] = useState(testImageUrl || '');
  const [loading, setLoading] = useState(testLoading || false);
  const [nutritionData, setNutritionData] = useState({
    calories: { value: 450, unit: 'kcal' },
    protein: { value: 20, unit: 'g' },
    carbohydrates: { value: 55, unit: 'g' },
    fat: { value: 15, unit: 'g' }
  });

  // Function to send the image to the backend
  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append('image', file); // Append the image file

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Uploaded to Cloudinary:', response.data.url);
      setImageUrl(response.data.url); 
      
      // TODO: Replace with actual API call to nutrition analysis service
      setNutritionData({
        calories: { value: Math.floor(Math.random() * 800 + 200), unit: 'kcal' },
        protein: { value: Math.floor(Math.random() * 30 + 10), unit: 'g' },
        carbohydrates: { value: Math.floor(Math.random() * 60 + 20), unit: 'g' },
        fat: { value: Math.floor(Math.random() * 25 + 5), unit: 'g' }
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
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
      
      {/* Show Upload Another Meal button when image is uploaded */}
      {imageUrl && (
        <button className="another-meal-button" onClick={resetUpload}>
          Upload Another Meal
        </button>
      )}

      {/* Show upload buttons only when no image is being processed */}
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

      {/* Show loading state */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Uploading image...</p>
        </div>
      )}

      {/* Show the uploaded image and nutritional data */}
      {imageUrl && !loading && (
        <div className="meal-info-box">
          <img src={imageUrl} alt="Uploaded Meal" className="meal-image" />
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