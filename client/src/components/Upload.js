import React from 'react';
import Header from './Header';
import './styles/Upload.css'; 

function Upload() {

  // Handler for capturing a picture (e.g., using a camera)
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
        // TODO: Handle captured photo here with backend
        return true;
      }
    };
    input.click();
  };

  // Handler for uploading an existing picture (e.g., from file storage)
  const handleUpload = () => {
    console.log('Upload button clicked');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log('Uploaded photo:', file);
        // TODO: Handle uploaded photo here with backend
        return true;
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
    </div>
  );
}

export default Upload;