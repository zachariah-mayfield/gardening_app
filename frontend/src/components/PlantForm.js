// gardening_app\frontend\src\PlantForm.js
import React, { useState, useEffect } from 'react';
// Import both add and update functions from api.js
import { addPlant, updatePlantById, updatePlantByName } from '../services/api';

/**
 * PlantForm Component
 * Handles both adding new plants and editing existing ones
 * Communicates with FastAPI backend via api.js
 *
 * Props:
 * - onAddPlant: function to call after a plant is added (parent will refresh list)
 * - onUpdatePlant: function to call after a plant is updated (parent will refresh list)
 * - plantToEdit: if present, the form is in edit mode and fields are pre-filled
 * - onCancel: function to call when the user cancels editing
 */
const PlantForm = ({ onAddPlant, onUpdatePlant, plantToEdit, onCancel }) => {
  // State variables using React's useState Hook
  // name: the value of the plant name input field
  // description: the value of the description textarea
  // error: error message to display to the user
  // isLoading: whether the form is currently submitting
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [wateringSchedule, setWateringSchedule] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * useEffect Hook - Runs when plantToEdit changes
   * If editing, pre-fill the form fields with the plant's current data.
   * If not editing, fields remain empty for adding a new plant.
   */
  useEffect(() => {
    if (plantToEdit) {
      setName(plantToEdit.name);
      setDescription(plantToEdit.description);
      setWateringSchedule(plantToEdit.wateringSchedule || plantToEdit.watering_schedule || '');
    }
  }, [plantToEdit]);

  /**
   * Form submission handler
   * Handles both adding new plants and updating existing ones
   *
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setIsLoading(true); // Disable form while submitting
    setError(null); // Clear any previous errors

    // Validate form fields: must not be empty or whitespace
    if (!name.trim() || !description.trim() || !wateringSchedule.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Prepare the plant data object to send to the backend
    const plantData = {
      name: name.trim(),
      description: description.trim(),
      watering_schedule: wateringSchedule.trim(),
    };

    try {
      let data;
      if (plantToEdit) {
        // If editing, update the plant (by ID if available, otherwise by name)
        console.log('Updating plant:', plantData);
        if (plantToEdit.id) {
          data = await updatePlantById(plantToEdit.id, plantData);
        } else {
          data = await updatePlantByName(plantToEdit.name, plantData);
        }
        onUpdatePlant(data); // Notify parent component of update
      } else {
        // If not editing, add a new plant
        console.log('Adding new plant:', plantData);
        data = await addPlant(plantData);
        if (!data) {
          setError(
            'Failed to add plant. The name may already exist or there was a problem.',
          );
          setIsLoading(false);
          return;
        }
        onAddPlant(data); // Notify parent component of addition
      }

      // Reset form on success (clear fields and errors)
      if (data) {
        setName('');
        setDescription('');
        setWateringSchedule('');
        setError(null);
      }
    } catch (error) {
      // If an error occurs, display a user-friendly message
      console.error('Error saving plant:', error);
      // Handle specific error cases
      if (error.message.includes('already exists')) {
        setError(
          'A plant with this name already exists. Please choose a different name.',
        );
      } else if (error.message.toLowerCase().includes('network')) {
        setError('Network error');
      } else {
        setError(error.message || 'An error occurred while saving the plant.');
      }
    } finally {
      setIsLoading(false); // Re-enable form
    }
  };

  // Render the form UI
  return (
    <div className="plant-form">
      {/* Form title changes based on add/edit mode */}
      <h2>{plantToEdit ? 'Edit Plant' : 'Add a New Plant'}</h2>

      {/* Display error message if present */}
      {error && (
        <p style={{ color: 'red' }} role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Plant Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
            disabled={isLoading} // Disable input while loading
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            autoComplete="off"
            disabled={isLoading} // Disable textarea while loading
          ></textarea>
        </div>

        <div>
          <label htmlFor="wateringSchedule">Watering Schedule:</label>
          <input
            type="text"
            id="wateringSchedule"
            name="wateringSchedule"
            value={wateringSchedule}
            onChange={(e) => setWateringSchedule(e.target.value)}
            required
            autoComplete="off"
            disabled={isLoading}
          />
        </div>

        <div className="form-buttons">
          {/* Submit button changes text based on add/edit mode and loading state */}
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : plantToEdit
                ? 'Update Plant'
                : 'Add Plant'}
          </button>

          {/* Show cancel button only in edit mode */}
          {plantToEdit && (
            <button type="button" className="cancel-btn" onClick={onCancel} disabled={isLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PlantForm;
