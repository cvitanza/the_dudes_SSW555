import { useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs';

import axios from "axios";
import "./styles/Upload.css"; // Your existing CSS
import Header from "./Header";

function Upload() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nutritionData, setNutritionData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch nutritional data from the backend
  const fetchNutritionData = async (foodItem) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload/get-nutrition",
        { foodItem }
      );

      if (response.data.success) {
        return response.data.foodResults; // Return nutrition data from backend
      } else {
        throw new Error("Failed to fetch nutrition data.");
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      throw error.response?.data?.error || "An unexpected error occurred.";
    }
  };

  const classifyFood = async (file) => {
    try {
      setLoading(true);
      setError(null);
  
      // Load the MobileNet model
      const model = await mobilenet.load();
  
      // Read the image file as a tensor
      const image = await readImageFile(file);
  
      // Classify the image
      const predictions = await model.classify(image);
  
      if (predictions.length === 0) {
        throw new Error("No recognizable food detected in the image.");
      }
  
      // Use the top prediction
      const foodItem = predictions[0].className;
  
      console.log(`Detected food: ${foodItem}`); // Log detected food for debugging
  
      // Fetch nutrition data from backend
      const nutritionResults = await fetchNutritionData(foodItem);

      await saveMeal(file, nutritionResults);
  
      setImageUrl(URL.createObjectURL(file));
      setNutritionData(nutritionResults);
    } catch (err) {
      console.error("Error processing food:", err);
      setError(err.message || "Failed to analyze the meal.");
    } finally {
      setLoading(false);
    }
  };

  const saveFoodData = async (file) => {
    try {
      if (!nutritionData[0]) {
        throw new Error('No nutrition data available to save.');
      }
  
      let form = new FormData();

      
      form.append('label', nutritionData[0].label);
      form.append('image', file); // Use the correct key 'image' for the file
      console.log('Nutrition Data JSON:', JSON.stringify(nutritionData));
      form.append(
        'nutritionData',
        JSON.stringify({
          calories: {
            value: nutritionData[0].nutrients.ENERC_KCAL,
            unit: 'kcal',
          },
          protein: {
            value: nutritionData[0].nutrients.PROCNT,
            unit: 'g',
          },
          carbohydrates: {
            value: nutritionData[0].nutrients.CHOCDF,
            unit: 'g',
          },
          fat: {
            value: nutritionData[0].nutrients.FAT,
            unit: 'g',
          },
        })
      );
    
      const response = await axios.post('http://localhost:5000/api/upload/favorites', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.data.success) {
        alert('Food data saved successfully!');
      } else {
        throw new Error('Failed to save food data.');
      }
    } catch (error) {
      console.error('Error saving food data:', error);
      alert('Error saving food data.');
    }
  };

  const saveMeal = async (file, nutritionData) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('nutritionData', JSON.stringify(nutritionData));
  
    try {
      const response = await axios.post('http://localhost:5000/api/upload/save', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.success) {
        console.log('Meal saved successfully:', response.data.meal);
      } else {
        throw new Error('Failed to save meal.');
      }
    } catch (error) {
      console.error('Error saving meal:', error);
      throw error;
    }
  };

  const readImageFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => resolve(tf.browser.fromPixels(img));
        img.onerror = reject;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageSelection = (useCamera = false) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    if (useCamera) input.capture = "camera";

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        classifyFood(file);
        setSelectedFile(file)
      }
    };

    input.click();
  };

  const resetUpload = () => {
    setImageUrl("");
    setNutritionData([]);
    setLoading(false);
  };

  return (
    <div className="upload-container">
      <Header title="Upload Meal" />

      {error && <div className="error-message">{error}</div>}

      {imageUrl && (
        <button className="another-meal-button" onClick={resetUpload}>
          Upload Another Meal
        </button>
      )}

      {!imageUrl && !loading && (
        <div className="button-container">
          <button
            className="upload-button"
            onClick={() => handleImageSelection(true)}
          >
            Take a Picture
          </button>
          <button
            className="upload-button"
            onClick={() => handleImageSelection()}
          >
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
    <img src={imageUrl} alt="Uploaded Meal" className="meal-image" />
    <div className="meal-details">
      <h3>Detected Food Item</h3>
      <div className="nutrition-row">
        <div className="nutrition-item">
          <span className="label">Label:</span>
          <span className="value">{nutritionData[0].label || "N/A"}</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Calories:</span>
          <span className="value">{(nutritionData[0].nutrients.ENERC_KCAL || 0).toFixed(1)} kcal</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Protein:</span>
          <span className="value">{(nutritionData[0].nutrients.PROCNT || 0).toFixed(1)} g</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Carbs:</span>
          <span className="value">{(nutritionData[0].nutrients.CHOCDF || 0).toFixed(1)} g</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Fat:</span>
          <span className="value">{(nutritionData[0].nutrients.FAT || 0).toFixed(1)} g</span>
        </div>
      </div>
    </div>
    <button className="save-button" onClick={() => saveFoodData(selectedFile)}>
  Save Food Data
</button>
  </div>
)}
    </div>
  );
}

export default Upload;
