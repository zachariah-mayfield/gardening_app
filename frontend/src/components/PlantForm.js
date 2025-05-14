// Z:\Main\github-repos\gardening_app\frontend\src\PlantForm.js
import React, { useState, useEffect } from 'react';
// Import both add and update functions from api.js
import { addPlant, updatePlantById, updatePlantByName } from '../services/api';

/**
 * PlantForm Component
 * Handles both adding new plants and editing existing ones
 * Communicates with FastAPI backend via api.js
 */
const PlantForm = ({ onAddPlant, onUpdatePlant, plantToEdit, onCancel }) => {
    // State variables using React's useState Hook
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * useEffect Hook - Runs when plantToEdit changes
     * Populates form fields when editing an existing plant
     */
    useEffect(() => {
        if (plantToEdit) {
            setName(plantToEdit.name);
            setDescription(plantToEdit.description);
        }
    }, [plantToEdit]);

    /**
     * Form submission handler
     * Handles both adding new plants and updating existing ones
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validate form fields
        if (!name.trim() || !description.trim()) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        const plantData = {
            name: name.trim(),
            description: description.trim()
        };

        try {
            let data;
            if (plantToEdit) {
                // Update existing plant
                console.log("Updating plant:", plantData);
                if (plantToEdit.id) {
                    data = await updatePlantById(plantToEdit.id, plantData);
                } else {
                    data = await updatePlantByName(plantToEdit.name, plantData);
                }
                onUpdatePlant(data); // Notify parent component of update
            } else {
                // Add new plant
                console.log("Adding new plant:", plantData);
                data = await addPlant(plantData);
                onAddPlant(data); // Notify parent component of addition
            }

            // Reset form on success
            if (data) {
                setName('');
                setDescription('');
                setError(null);
            }
        } catch (error) {
            console.error('Error saving plant:', error);
            // Handle specific error cases
            if (error.message.includes('already exists')) {
                setError('A plant with this name already exists. Please choose a different name.');
            } else {
                setError(error.message || 'An error occurred while saving the plant.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="plant-form">
            <h2>{plantToEdit ? 'Edit Plant' : 'Add a New Plant'}</h2>
            
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    ></textarea>
                </div>

                <div className="form-buttons">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading 
                            ? 'Saving...' 
                            : (plantToEdit ? 'Update Plant' : 'Add Plant')
                        }
                    </button>
                    
                    {plantToEdit && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PlantForm;
