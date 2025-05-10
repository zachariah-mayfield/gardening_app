// Z:\Main\github-repos\gardening_app\frontend\src\PlantForm.js
import React, { useState } from 'react';
import { addPlant } from './api'; // Add this line to import the addPlant function

const PlantForm = ({ onAddPlant }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      console.log('Please fill in all fields');
      return;
    }

    const newPlant = { name, description };

    try {
      console.log("Submitting plant:", newPlant);
      const data = await addPlant(newPlant); // Make API call to add plant

      if (data) {
        onAddPlant(data); // Pass the created plant back to App.js
        setName('');
        setDescription('');
        setError(null); // Clear any previous error
      } else {
        setError('Failed to add plant. It might already exist.'); // Show error if duplicate
      }
    } catch (error) {
      console.error('Error adding plant:', error);
      setError(error.message || 'An error occurred while adding the plant.');
    }
  };

  return (
    <div>
      <h2>Add a New Plant</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Plant Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            autoComplete="off"
          ></textarea>
        </div>

        <button type="submit">Add Plant</button>
      </form>
    </div>
  );
};

export default PlantForm;
