import React, { useState } from 'react';
import axios from 'axios'; // For HTTP requests to the backend
import Header from './Header';
import './styles/Upload.css';

function Upload() {
  const [imageUrl, setImageUrl] = useState(''); // State to store the Cloudinary image URL
  const [loading, setLoading] = useState(false); // State to show loading status

  // Function to send the image to the backend
  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append('image', file); // Append the image file

    try {
      setLoading(true); // Start loading state
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Uploaded to Cloudinary:', response.data.url);
      setImageUrl(response.data.url); // Save the uploaded image URL
      setLoading(false); // Stop loading state
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setLoading(false); // Stop loading state in case of error
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

  return (
    <div className="upload-container">
      <Header title="Upload Meal" />
      <div className="button-container">
        <button className="upload-button" onClick={handleCapture}>
          Take a Picture
        </button>
        <button className="upload-button" onClick={handleUpload}>
          Upload a Picture
        </button>
      </div>

      {/* Show loading state */}
      {loading && <p>Uploading...</p>}

      {/* Show the uploaded image */}
      {imageUrl && (
        <div className="uploaded-image">
          <p>Image Uploaded:</p>
          <img src={imageUrl} alt="Uploaded Meal" style={{ width: '300px' }} />
        </div>
      )}
    </div>
  );
}

export default Upload;