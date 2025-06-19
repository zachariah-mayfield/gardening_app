// gardening_app\frontend\src\App.js

import './App.css';

import React, { useState, useEffect } from 'react';
// Import all necessary API functions
import { fetchPlants, deletePlantById, deletePlantByName } from './services';
import { PlantForm } from './components';
import plantLogo from './logo.svg';

/**
 * Main App Component
 * Manages the plant list and editing functionality
 * Integrates with FastAPI backend through api.js
 *
 * This is the root component of the frontend. It manages all state for the plant list,
 * handles communication with the backend API, and renders the UI for adding, editing, and deleting plants.
 */
const App = () => {
  // State Management
  // plants: array of plant objects fetched from the backend
  // error: string for displaying error messages to the user
  // selectedPlant: the plant object currently being edited (null if not editing)
  // isLoading: boolean indicating if data is being loaded or an operation is in progress
  const [plants, setPlants] = useState([]); // List of plants from database
  const [error, setError] = useState(null); // Error message state
  const [selectedPlant, setSelectedPlant] = useState(null); // Plant being edited
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [success, setSuccess] = useState(null); // Success message state

  /**
   * Fetches plants from the PostgreSQL database via FastAPI
   * Called when component mounts and after updates
   *
   * This function is responsible for retrieving the latest list of plants from the backend.
   * It sets the loading state, handles errors, and updates the plants state.
   */
  const loadPlants = async () => {
    setIsLoading(true); // Show loading indicator
    try {
      const fetchedPlants = await fetchPlants(); // Fetch plants from backend
      console.log('Fetched plants from database:', fetchedPlants);
      // Update plants state with fetched data
      setPlants(fetchedPlants);
      setError(null); // Clear any previous errors
      setSuccess(null); // Clear success on successful load
    } catch (error) {
      // If an error occurs, display a user-friendly message
      console.error('Database or API error:', error);
      setError('Failed to load plants. Please try again later.');
      setSuccess(null); // Clear success on error
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  // Load plants when component mounts
  // useEffect is a React hook that runs after the component is rendered
  useEffect(() => {
    loadPlants();
  }, []); // Empty dependency array means this runs only once on mount

  /**
   * Handles adding a new plant
   * Updates local state and refreshes data from database
   * @param {Object} newPlant - The newly added plant
   *
   * This function is called after a plant is added via the PlantForm.
   * It refreshes the plant list to include the new plant.
   */
  const handleAddPlant = async (newPlant) => {
    try {
      setError(null);
      setSuccess(null);
      await loadPlants();
      setSuccess('Plant added successfully!');
    } catch (error) {
      console.error('Error adding plant:', error);
      setError('Failed to add plant. Please try again.');
      setSuccess(null);
    }
  };

  /**
   * Handles updating an existing plant
   * Updates local state and refreshes data from database
   * @param {Object} updatedPlant - The updated plant data
   *
   * This function is called after a plant is updated via the PlantForm.
   * It refreshes the plant list and clears the selectedPlant state.
   */
  const handleUpdatePlant = async (updatedPlant) => {
    try {
      setError(null);
      setSuccess(null);
      await loadPlants();
      setSelectedPlant(null);
      setSuccess('Plant updated successfully!');
    } catch (error) {
      console.error('Error updating plant:', error);
      setError('Failed to update plant. Please try again.');
      setSuccess(null);
    }
  };

  /**
   * Handles selecting a plant for editing
   * @param {Object} plant - The plant to edit
   *
   * This function sets the selectedPlant state, which causes the PlantForm to switch to edit mode.
   */
  const handleEditClick = (plant) => {
    setSelectedPlant(plant);
    setError(null);
    setSuccess(null);
  };

  /**
   * Handles canceling the edit operation
   *
   * This function resets the selectedPlant and error states, returning the form to add mode.
   */
  const handleCancelEdit = () => {
    setSelectedPlant(null);
    setError(null);
    setSuccess(null);
  };

  /**
   * Handles deleting a plant by ID or name
   * @param {Object} plant - The plant object to delete
   *
   * This function determines whether to delete by ID or name, calls the appropriate API function,
   * and refreshes the plant list. It also handles errors and loading state.
   */
  const handleDeletePlant = async (plant) => {
    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);
      if (plant.id) {
        await deletePlantById(plant.id);
      } else {
        await deletePlantByName(plant.name);
      }
      await loadPlants(); // refresh list
      setSuccess('Plant deleted successfully!');
    } catch (error) {
      setError('Failed to delete plant. Please try again.');
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the main UI for the app
  return (
    <div className="app-container">
      {/* Hero Section */}
      <header className="hero">
        <img src={plantLogo} alt="Plant Logo" className="plant-logo" style={{ width: 24, height: 24 }} />
        <h1 className="hero-title">Welcome to Plant Tracker 🌱</h1>
        <p className="hero-subtitle">
          Organize your garden, track your plants, and grow your green thumb!
        </p>
      </header>

      {/* Error Display: shows error messages to the user if any */}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* Success Display: shows success messages to the user if any */}
      {success && (
        <p className="success-message" role="status">
          {success}
        </p>
      )}

      {/* Loading Indicator: shows when data is being fetched or an operation is in progress */}
      {isLoading && <p>Loading plants...</p>}

      {/* Plant Form - handles both adding and editing */}
      <section className="form-section">
        <PlantForm
          onAddPlant={handleAddPlant}
          onUpdatePlant={handleUpdatePlant}
          plantToEdit={selectedPlant}
          onCancel={handleCancelEdit}
        />
      </section>

      {/* Plant List: displays all plants and provides edit/delete buttons */}
      <section className="plant-list-section">
        <h2>Your Plants</h2>
        <div className="plant-list">
          {plants.length === 0 ? (
            <p>No plants yet. Add your first plant above!</p>
          ) : (
            <ul>
              {plants.map((plant) => (
                <li key={plant.id || plant.name} className="plant-item">
                  <div className="plant-card">
                    <div className="plant-info">
                      <div className="plant-name">🌿 <strong>{plant.name}</strong></div>
                      <div className="plant-desc">📰 {plant.description}</div>
                      <div className="plant-watering">💧 <strong>Watering Schedule:</strong> {plant.watering_schedule}</div>
                    </div>
                    <div className="plant-actions">
                      <button
                        onClick={() => handleEditClick(plant)}
                        disabled={isLoading}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlant(plant)}
                        disabled={isLoading}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span role="img" aria-label="plant">🌱</span> Happy Gardening! &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
