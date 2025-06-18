// Z:\Main\github-repos\gardening_app\frontend\src\App.js





// ...existing code...

import React, { useState, useEffect } from 'react';
// Import all necessary API functions
import { fetchPlants, deletePlantById, deletePlantByName } from './services';
import { PlantForm } from './components';

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
      console.log("Fetched plants from database:", fetchedPlants);
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
      <h1>Plant Tracker</h1>
      
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
      <PlantForm 
        onAddPlant={handleAddPlant}
        onUpdatePlant={handleUpdatePlant}
        plantToEdit={selectedPlant}
        onCancel={handleCancelEdit}
      />

      {/* Plant List: displays all plants and provides edit/delete buttons */}
      <div className="plant-list">
        <h2>Your Plants</h2>
        {plants.length === 0 ? (
          <p>No plants yet. Add your first plant above!</p>
        ) : (
          <ul>
            {plants.map((plant) => (
              <li key={plant.id || plant.name} className="plant-item">
                <div>
                  <strong>{plant.name}</strong>: {plant.description}
                </div>
                {/* Edit button: allows user to edit this plant */}
                <button 
                  onClick={() => handleEditClick(plant)}
                  disabled={isLoading}
                >
                  Edit
                </button>
                {/* Delete button: allows user to delete this plant */}
                <button
                  onClick={() => handleDeletePlant(plant)}
                  disabled={isLoading}
                  style={{ marginLeft: '8px', color: 'red' }}
                >
                  Delete
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