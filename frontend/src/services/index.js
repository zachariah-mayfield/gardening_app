/**
 * Services Barrel File
 * Centralizes all service exports in one place
 * Makes imports cleaner in other files
 */

// index.js (services)
//
// This file can be used as a "barrel" file for your API and other service modules.
// By exporting all your service functions from here, you can import them from a single location elsewhere in your app.
// For example, you could export everything from './api' here and then import from './services' in your components.
// This is especially useful as your app grows and you add more service modules (e.g., auth, notifications, etc.).

export {
  fetchPlants,
  addPlant,
  updatePlantById,
  updatePlantByName,
  deletePlantById,
  deletePlantByName,
} from './api';
