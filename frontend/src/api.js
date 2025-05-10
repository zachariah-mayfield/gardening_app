// Z:\Main\github-repos\gardening_app\frontend\src\api.js

export const fetchPlants = async () => {
  try {
    const response = await fetch('http://localhost:8000/plants');
    
    // Log the response status and body for debugging
    console.log('Response Status:', response.status);
    const text = await response.text(); // Read response as text
    console.log('Response Body:', text);

    // Check if the response is valid JSON
    if (!response.ok) {
      throw new Error('Failed to fetch plants');
    }

    // Attempt to parse the JSON if the response is OK
    const data = JSON.parse(text);

    // Return the parsed data
    return data;
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
};

export const addPlant = async (newPlant) => {
  try {
    const response = await fetch('http://localhost:8000/plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlant),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.detail); // Log the error message from the backend

      // Check for duplicate name error and provide a more user-friendly message
      if (errorData.detail && errorData.detail.includes('Plant with this name already exists')) {
        throw new Error('A plant with this name already exists. Please choose a different name.');
      }

      throw new Error(errorData.detail || 'Failed to add plant');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding plant:', error);
    return null; // You can return null or handle this error appropriately in the frontend
  }
};
