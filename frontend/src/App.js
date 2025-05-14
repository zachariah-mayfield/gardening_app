// Z:\Main\github-repos\gardening_app\frontend\src\App.js
import React, { useState, useEffect } from 'react';
// Import all necessary API functions
import { fetchPlants } from './api';
import PlantForm from './PlantForm';

/**
 * Main App Component
 * Manages the plant list and editing functionality
 * Integrates with FastAPI backend through api.js
 */
const App = () => {
  // State Management
  const [plants, setPlants] = useState([]); // List of plants from database
  const [error, setError] = useState(null); // Error message state
  const [selectedPlant, setSelectedPlant] = useState(null); // Plant being edited
  const [isLoading, setIsLoading] = useState(false); // Loading state

  /**
   * Fetches plants from the PostgreSQL database via FastAPI
   * Called when component mounts and after updates
   */
  const loadPlants = async () => {
    setIsLoading(true);
    try {
      const fetchedPlants = await fetchPlants();
      console.log("Fetched plants from database:", fetchedPlants);
      // Update plants state with fetched data
      setPlants(fetchedPlants);
      setError(null);
    } catch (error) {
      console.error('Database or API error:', error);
      setError('Failed to load plants. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load plants when component mounts
  useEffect(() => {
    loadPlants();
  }, []);

  /**
   * Handles adding a new plant
   * Updates local state and refreshes data from database
   * @param {Object} newPlant - The newly added plant
   */
  const handleAddPlant = async (newPlant) => {
    try {
      setError(null);
      // Add plant and refresh the plant list
      await loadPlants();
    } catch (error) {
      console.error('Error adding plant:', error);
      setError('Failed to add plant. Please try again.');
    }
  };

  /**
   * Handles updating an existing plant
   * Updates local state and refreshes data from database
   * @param {Object} updatedPlant - The updated plant data
   */
  const handleUpdatePlant = async (updatedPlant) => {
    try {
      setError(null);
      // Refresh plant list to get updated data
      await loadPlants();
      // Clear selection after successful update
      setSelectedPlant(null);
    } catch (error) {
      console.error('Error updating plant:', error);
      setError('Failed to update plant. Please try again.');
    }
  };

  /**
   * Handles selecting a plant for editing
   * @param {Object} plant - The plant to edit
   */
  const handleEditClick = (plant) => {
    setSelectedPlant(plant);
    setError(null);
  };

  /**
   * Handles canceling the edit operation
   */
  const handleCancelEdit = () => {
    setSelectedPlant(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <h1>Plant Tracker</h1>
      
      {/* Error Display */}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* Loading Indicator */}
      {isLoading && <p>Loading plants...</p>}

      {/* Plant Form - handles both adding and editing */}
      <PlantForm 
        onAddPlant={handleAddPlant}
        onUpdatePlant={handleUpdatePlant}
        plantToEdit={selectedPlant}
        onCancel={handleCancelEdit}
      />

      {/* Plant List */}
      <div className="plant-list">
        <h2>Your Plants</h2>
        {plants.length === 0 ? (
          <p>No plants yet. Add your first plant above!</p>
        ) : (
          <ul>
            {plants.map((plant) => (
              <li key={plant.id} className="plant-item">
                <div>
                  <strong>{plant.name}</strong>: {plant.description}
                </div>
                <button 
                  onClick={() => handleEditClick(plant)}
                  disabled={isLoading}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;