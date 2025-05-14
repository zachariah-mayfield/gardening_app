import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import * as api from '../services/api';

// Mock the entire api module
jest.mock('../api');

describe('App Component Tests', () => {
    // Sample plant data for testing
    const mockPlants = [
        { id: 1, name: 'Rose', description: 'A beautiful flower' },
        { id: 2, name: 'Tomato', description: 'A tasty vegetable' }
    ];

    // Setup before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock successful API responses
        api.fetchPlants.mockResolvedValue(mockPlants);
        api.addPlant.mockImplementation(plant => Promise.resolve({ ...plant, id: 3 }));
        api.updatePlantById.mockImplementation((id, plant) => Promise.resolve({ ...plant, id }));
    });

    // Test initial render and plant loading
    test('loads and displays plants on mount', async () => {
        render(<App />);
        
        // Should show loading state initially
        expect(screen.getByText(/loading plants/i)).toBeInTheDocument();
        
        // Wait for plants to load and check display
        await waitFor(() => {
            expect(screen.getByText('Rose')).toBeInTheDocument();
            expect(screen.getByText('Tomato')).toBeInTheDocument();
        });
    });

    // Test error handling during plant loading
    test('handles API errors during plant loading', async () => {
        // Mock API error
        api.fetchPlants.mockRejectedValueOnce(new Error('Failed to load plants'));
        
        render(<App />);
        
        await waitFor(() => {
            expect(screen.getByText(/failed to load plants/i)).toBeInTheDocument();
        });
    });

    // Test plant editing workflow
    test('enables plant editing mode correctly', async () => {
        render(<App />);
        
        // Wait for plants to load
        await waitFor(() => {
            expect(screen.getByText('Rose')).toBeInTheDocument();
        });
        
        // Click edit button
        fireEvent.click(screen.getAllByText('Edit')[0]);
        
        // Verify edit mode
        expect(screen.getByDisplayValue('Rose')).toBeInTheDocument();
        expect(screen.getByText('Edit Plant')).toBeInTheDocument();
    });

    // Test successful plant update
    test('updates plant successfully', async () => {
        render(<App />);
        
        await waitFor(() => {
            expect(screen.getByText('Rose')).toBeInTheDocument();
        });
        
        // Enter edit mode
        fireEvent.click(screen.getAllByText('Edit')[0]);
        
        // Update plant name
        fireEvent.change(screen.getByDisplayValue('Rose'), {
            target: { value: 'Updated Rose' }
        });
        
        // Submit update
        fireEvent.click(screen.getByText('Update Plant'));
        
        // Verify update
        await waitFor(() => {
            expect(api.updatePlantById).toHaveBeenCalled();
            expect(screen.getByText('Plant updated successfully!')).toBeInTheDocument();
        });
    });
});