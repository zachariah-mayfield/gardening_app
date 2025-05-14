// Z:\Main\github-repos\gardening_app\frontend\src\api.js

/**
 * Frontend API Service for Plant Management
 * This file handles all communication between the frontend and backend
 */

// Define the base URL for all API requests
// Using 'const' declares a variable that cannot be reassigned
// This URL matches our FastAPI backend running in Docker and includes API version
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Fetches all plants from the database
 * 
 * JavaScript Concepts Used:
 * - async/await: Makes asynchronous code look synchronous
 * - try/catch: Handles errors that might occur
 * - Arrow function: Modern way to write functions (() => {})
 * - Template literals: Strings with backticks that allow ${variables}
 * 
 * @returns {Promise<Array>} Returns a promise that resolves to an array of plants
 */
export const fetchPlants = async () => {
    // try/catch blocks handle potential errors in our code
    try {
        // 'await' pauses execution until the fetch request completes
        // fetch is a browser API for making HTTP requests
        const response = await fetch(`${API_BASE_URL}/plants`);
        
        // Debugging logs to help understand what's happening
        console.log('Response Status:', response.status);
        const text = await response.text(); // Get response as text
        console.log('Response Body:', text);

        // Check if the request was successful
        // response.ok is true for HTTP status codes 200-299
        if (!response.ok) {
            throw new Error('Failed to fetch plants');
        }

        // Parse the JSON text into a JavaScript object
        const data = JSON.parse(text);

        // Return the parsed data to the calling component
        return data;
    } catch (error) {
        // If any error occurs in the try block, it's caught here
        console.error('Error fetching plants:', error);
        return []; // Return empty array if there's an error
    }
};

/**
 * Adds a new plant to the database
 * 
 * JavaScript Concepts Used:
 * - Object parameter: Function accepts an object with plant data
 * - JSON.stringify: Converts JavaScript object to JSON string
 * - HTTP POST: Creates new resources on the server
 * 
 * @param {Object} newPlant - Object containing plant data (name, description)
 * @returns {Promise<Object>} Returns a promise that resolves to the created plant
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
                throw new Error('A plant with this name already exists. Please choose a different name.');
            }

            // Generic error if not a duplicate name error
            throw new Error(errorData.detail || 'Failed to add plant');
        }

        // Parse and return the newly created plant data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding plant:', error);
        return null; // Return null to indicate failure
    }
};

/**
 * Updates a plant by ID
 * 
 * JavaScript Concepts Used:
 * - Template literals: `${plantId}` injects the ID into the URL
 * - HTTP PUT: Updates existing resources on the server
 * - Error throwing: Passes errors up to the calling component
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
        console.error('Error updating plant:', error);
        throw error; // Propagate error to component for handling
    }
};

/**
 * Updates a plant by name
 * 
 * JavaScript Concepts Used:
 * - encodeURIComponent: Safely encode string for URL
 * - Optional chaining: errorData?.detail checks if detail exists
 * - Error propagation: throw passes errors up the call stack
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
            }
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
        console.error('Error updating plant:', error);
        throw error; // Propagate error to component for handling
    }
};