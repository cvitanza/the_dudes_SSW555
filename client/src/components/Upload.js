import React, { useState } from 'react';
import axios from 'axios'; // For HTTP requests to the backend
import Header from './Header';
import './styles/Upload.css';

function Upload() {
  const [imageUrl, setImageUrl] = useState(''); // State to store the Cloudinary image URL
  const [loading, setLoading] = useState(false); // State to show loading status
  const [imageUploaded, setImageUploaded] = useState(false); // State to track if image was uploaded

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
      setLoading(false);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setLoading(false);
    }
  };

  // Handler for capturing a picture
  const handleCapture = () => {
    console.log('Capture button clicked');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera'; // Prompts the camera interface on mobile devices
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log('Captured photo:', file);
        uploadToBackend(file); // Upload captured photo to the backend
      }
    };
    input.click();
  };

  // Handler for uploading an existing picture
  const handleUpload = () => {
    console.log('Upload button clicked');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      console.log("firedd ")
      const file = event.target.files[0];
      if (file) {
        console.log('Uploaded photo:', file);
        uploadToBackend(file); // Upload selected photo to the backend
      }
    };
    input.click();
  };

  // Handler for "Upload Another Meal" button
  const resetUpload = () => {
    setImageUrl('');
    setLoading(false);
    setImageUploaded(false);
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
          <button className="upload-button" onClick={handleCapture}>
            Take a Picture
          </button>
          <button className="upload-button" onClick={handleUpload}>
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
              <div className="nutrition-item">
                <span className="label">Calories:</span>
                <span className="value">450 kcal</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Protein:</span>
                <span className="value">20g</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Carbohydrates:</span>
                <span className="value">55g</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Fat:</span>
                <span className="value">15g</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;