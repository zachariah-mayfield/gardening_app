/**
 * Components Barrel File
 * Centralizes all component exports in one place
 * Makes imports cleaner in other files
 *
 * This file is known as a "barrel" file. It allows you to import multiple components from a single location.
 * For example, instead of importing PlantForm from './components/PlantForm', you can import it from './components'.
 * This is especially useful as your app grows and you have more components to manage.
 */

export { default as PlantForm } from './PlantForm';
