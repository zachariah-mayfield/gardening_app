/**
 * Services Barrel File
 * Centralizes all service exports in one place
 * Makes imports cleaner in other files
 */

export { 
    fetchPlants,
    addPlant,
    updatePlantById,
    updatePlantByName 
} from './api';