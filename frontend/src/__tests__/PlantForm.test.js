// Import testing utilities and components
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlantForm } from '../components/PlantForm';
import * as api from '../services/api';

// Mock the entire api module
jest.mock('../api');

describe('PlantForm Component Tests', () => {
    // Mock functions for component props
    const mockOnAddPlant = jest.fn();
    const mockOnUpdatePlant = jest.fn();
    const mockOnCancel = jest.fn();

    // Reset all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock successful API calls
        api.addPlant.mockResolvedValue({ id: 1, name: 'Test Plant', description: 'Test Description' });
        api.updatePlantById.mockResolvedValue({ id: 1, name: 'Updated Plant', description: 'Updated Description' });
    });

    // Test rendering the add plant form
    test('renders add plant form correctly', () => {
        // Render the component in "add" mode
        render(<PlantForm onAddPlant={mockOnAddPlant} />);

        // Check for form elements
        expect(screen.getByText('Add a New Plant')).toBeInTheDocument();
        expect(screen.getByLabelText('Plant Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Description:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add plant/i })).toBeInTheDocument();
    });

    // Test rendering the edit plant form
    test('renders edit plant form with existing data', () => {
        // Mock plant data for editing
        const plantToEdit = {
            id: 1,
            name: 'Existing Plant',
            description: 'Existing Description'
        };

        // Render the component in "edit" mode
        render(
            <PlantForm
                onUpdatePlant={mockOnUpdatePlant}
                plantToEdit={plantToEdit}
                onCancel={mockOnCancel}
            />
        );

        // Check for edit mode elements and prefilled data
        expect(screen.getByText('Edit Plant')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Plant')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /update plant/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    // Test form validation
    test('shows error message for empty fields', async () => {
        render(<PlantForm onAddPlant={mockOnAddPlant} />);

        // Try to submit empty form
        fireEvent.click(screen.getByRole('button', { name: /add plant/i }));

        // Check for error message
        expect(await screen.findByText('Please fill in all fields')).toBeInTheDocument();
        expect(mockOnAddPlant).not.toHaveBeenCalled();
    });

    // Test successful plant addition
    test('successfully adds a new plant', async () => {
        render(<PlantForm onAddPlant={mockOnAddPlant} />);

        // Fill in form fields
        fireEvent.change(screen.getByLabelText('Plant Name:'), {
            target: { value: 'New Plant' }
        });
        fireEvent.change(screen.getByLabelText('Description:'), {
            target: { value: 'New Description' }
        });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /add plant/i }));

        // Verify API call and form reset
        await waitFor(() => {
            expect(api.addPlant).toHaveBeenCalledWith({
                name: 'New Plant',
                description: 'New Description'
            });
            expect(mockOnAddPlant).toHaveBeenCalled();
            expect(screen.getByLabelText('Plant Name:')).toHaveValue('');
            expect(screen.getByLabelText('Description:')).toHaveValue('');
        });
    });

    // Test successful plant update
    test('successfully updates an existing plant', async () => {
        const plantToEdit = {
            id: 1,
            name: 'Original Plant',
            description: 'Original Description'
        };

        render(
            <PlantForm
                onUpdatePlant={mockOnUpdatePlant}
                plantToEdit={plantToEdit}
                onCancel={mockOnCancel}
            />
        );

        // Change form fields
        fireEvent.change(screen.getByLabelText('Plant Name:'), {
            target: { value: 'Updated Plant' }
        });
        fireEvent.change(screen.getByLabelText('Description:'), {
            target: { value: 'Updated Description' }
        });

        // Submit update
        fireEvent.click(screen.getByRole('button', { name: /update plant/i }));

        // Verify API call
        await waitFor(() => {
            expect(api.updatePlantById).toHaveBeenCalledWith(1, {
                name: 'Updated Plant',
                description: 'Updated Description'
            });
            expect(mockOnUpdatePlant).toHaveBeenCalled();
        });
    });

    // Test cancel button functionality
    test('cancel button calls onCancel and resets form', () => {
        const plantToEdit = {
            id: 1,
            name: 'Test Plant',
            description: 'Test Description'
        };

        render(
            <PlantForm
                onUpdatePlant={mockOnUpdatePlant}
                plantToEdit={plantToEdit}
                onCancel={mockOnCancel}
            />
        );

        // Click cancel button
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

        // Verify cancel callback was called
        expect(mockOnCancel).toHaveBeenCalled();
    });
});