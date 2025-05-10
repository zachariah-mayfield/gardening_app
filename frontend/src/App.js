// App.js
import React, { useState, useEffect } from 'react';
import { fetchPlants } from './api'; // import the API functions
import PlantForm from './PlantForm';

const App = () => {
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState(null);

  // Fetch plants when the component mounts
  const loadPlants = async () => {
    try {
      const fetchedPlants = await fetchPlants();
      console.log("Fetched plants:", fetchedPlants);
      setPlants(fetchedPlants);
    } catch (error) {
      setError('Failed to load plants');
      console.error('Error loading plants:', error);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const handleAddPlant = (newPlant) => {
    setPlants((prevPlants) => [...prevPlants, newPlant]);
  };

  return (
    <div>
      <h1>Plant Tracker</h1>
      {error && <p>{error}</p>}
      <PlantForm onAddPlant={handleAddPlant} />
      <ul>
        {plants.map((plant) => (
          <li key={plant.id}>{plant.name}: {plant.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
