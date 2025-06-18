// Z:\Main\github-repos\gardening_app\frontend\src\api.js

/**
 * Frontend API Service for Plant Management
 * This file handles all communication between the frontend and backend
 *
 * Each function here corresponds to a REST API endpoint in the FastAPI backend.
 * These functions are imported and used by React components to fetch, add, update, or delete plant data.
 */

// Define the base URL for all API requests
// Using 'const' declares a variable that cannot be reassigned
// This URL matches our FastAPI backend running in Docker and includes API version
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Fetches all plants from the database
 *
 * This function sends a GET request to the backend to retrieve all plant records.
 * It returns an array of plant objects, or an empty array if there is an error.
 *
 * @returns {Promise<Array>} Returns a promise that resolves to an array of plants
 */
export const fetchPlants = async () => {
  try {
    // Use GET method and set headers to match test expectations
    const response = await fetch(`${API_BASE_URL}/plants`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // Debugging logs to help understand what's happening
    console.log('Response Status:', response.status);
    const text = await response.text(); // Get response as text
    console.log('Response Body:', text);

    // Check if the request was successful
    if (!response.ok) {
      // Throw an error so tests and UI can handle it
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON text into a JavaScript object
    const data = JSON.parse(text);

    // Return the parsed data to the calling component
    return data;
  } catch (error) {
    // If any error occurs in the try block, it's caught here
    console.error('Error fetching plants:', error);
    throw error; // Propagate error to tests and UI
  }
};

/**
 * Adds a new plant to the database
 *
 * This function sends a POST request to the backend to create a new plant.
 * The newPlant parameter should be an object with 'name' and 'description' properties.
 * If the plant name already exists, the backend will return an error.
 *
 * @param {Object} newPlant - Object containing plant data (name, description)
 * @returns {Promise<Object|null>} Returns a promise that resolves to the created plant, or null if failed
 */
export const addPlant = async (newPlant) => {
  try {
    // POST request to create a new plant
    // fetch options object configures the request
    const response = await fetch(`${API_BASE_URL}/plants`, {
      method: 'POST', // HTTP method
      headers: {
        'Content-Type': 'application/json', // Tells server we're sending JSON
      },
      body: JSON.stringify(newPlant), // Convert object to JSON string
    });

    // Handle unsuccessful requests
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.detail);

      // Check specifically for duplicate plant names
      if (errorData.detail?.includes('Plant with this name already exists')) {
        throw new Error(
          'A plant with this name already exists. Please choose a different name.',
        );
      }

      // Generic error if not a duplicate name error
      throw new Error(errorData.detail || 'Failed to add plant');
    }

    // Parse and return the newly created plant data
    const data = await response.json();
    return data;
  } catch (error) {
    // If an error occurs, log it and return null
    console.error('Error adding plant:', error);
    return null; // Return null to indicate failure
  }
};

/**
 * Updates a plant by ID
 *
 * This function sends a PUT request to the backend to update a plant by its database ID.
 * The updatedPlant parameter should be an object with the new 'name' and 'description'.
 *
 * @param {number} plantId - The database ID of the plant to update
 * @param {Object} updatedPlant - New plant data to apply
 * @returns {Promise<Object>} Returns a promise that resolves to the updated plant
 */
export const updatePlantById = async (plantId, updatedPlant) => {
  try {
    // PUT request to update existing plant
    const response = await fetch(`${API_BASE_URL}/plants/id/${plantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPlant),
    });

    // Handle unsuccessful updates
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.detail);
      throw new Error(errorData.detail || 'Failed to update plant');
    }

    // Return the updated plant data
    const data = await response.json();
    return data;
  } catch (error) {
    // If an error occurs, log it and rethrow so the UI can handle it
    console.error('Error updating plant:', error);
    throw error; // Propagate error to component for handling
  }
};

/**
 * Updates a plant by name
 *
 * This function sends a PUT request to the backend to update a plant by its name.
 * This is useful if you don't have the plant's ID but know its name.
 *
 * @param {string} plantName - Name of the plant to update
 * @param {Object} updatedPlant - New plant data to apply
 * @returns {Promise<Object>} Returns a promise that resolves to the updated plant
 */
export const updatePlantByName = async (plantName, updatedPlant) => {
  try {
    // Encode plant name to handle special characters in URLs
    const response = await fetch(
      `${API_BASE_URL}/plants/name/${encodeURIComponent(plantName)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPlant),
      },
    );

    // Handle unsuccessful updates
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.detail);
      throw new Error(errorData.detail || 'Failed to update plant');
    }

    // Return the updated plant data
    const data = await response.json();
    return data;
  } catch (error) {
    // If an error occurs, log it and rethrow so the UI can handle it
    console.error('Error updating plant:', error);
    throw error; // Propagate error to component for handling
  }
};

/**
 * Deletes a plant by ID
 *
 * This function sends a DELETE request to the backend to remove a plant by its database ID.
 *
 * @param {number} plantId - The database ID of the plant to delete
 * @returns {Promise<void>} Resolves if successful, throws error otherwise
 */
export const deletePlantById = async (plantId) => {
  // Send a DELETE request to the backend
  const response = await fetch(`${API_BASE_URL}/plants/id/${plantId}`, {
    method: 'DELETE',
  });
  // If the response is not OK, throw an error so the UI can handle it
  if (!response.ok) {
    throw new Error('Failed to delete plant');
  }
};

/**
 * Deletes a plant by name
 *
 * This function sends a DELETE request to the backend to remove a plant by its name.
 * This is useful if you don't have the plant's ID but know its name.
 *
 * @param {string} plantName - The name of the plant to delete
 * @returns {Promise<void>} Resolves if successful, throws error otherwise
 */
export const deletePlantByName = async (plantName) => {
  // Send a DELETE request to the backend
  const response = await fetch(
    `${API_BASE_URL}/plants/name/${encodeURIComponent(plantName)}`,
    {
      method: 'DELETE',
    },
  );
  // If the response is not OK, throw an error so the UI can handle it
  if (!response.ok) {
    throw new Error('Failed to delete plant');
  }
};
