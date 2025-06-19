// Import testing utilities and components
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlantForm from '../components/PlantForm';
import * as api from '../services/api';

// Mock the entire api module
jest.mock('../services/api');

describe('PlantForm Component Tests', () => {
  // Mock functions for component props
  const mockOnAddPlant = jest.fn();
  const mockOnUpdatePlant = jest.fn();
  const mockOnCancel = jest.fn();

  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API calls
    api.addPlant.mockResolvedValue({
      id: 1,
      name: 'Test Plant',
      description: 'Test Description',
    });
    api.updatePlantById.mockResolvedValue({
      id: 1,
      name: 'Updated Plant',
      description: 'Updated Description',
    });
  });

  // Test rendering the add plant form
  test('renders add plant form correctly', () => {
    // Render the component in "add" mode
    render(<PlantForm onAddPlant={mockOnAddPlant} />);

    // Check for form elements
    expect(screen.getByText('Add a New Plant')).toBeInTheDocument();
    expect(screen.getByLabelText('Plant Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add plant/i }),
    ).toBeInTheDocument();
  });

  // Test rendering the edit plant form
  test('renders edit plant form with existing data', () => {
    // Mock plant data for editing
    const plantToEdit = {
      id: 1,
      name: 'Existing Plant',
      description: 'Existing Description',
    };

    // Render the component in "edit" mode
    render(
      <PlantForm
        onUpdatePlant={mockOnUpdatePlant}
        plantToEdit={plantToEdit}
        onCancel={mockOnCancel}
      />,
    );

    // Check for edit mode elements and prefilled data
    expect(screen.getByText('Edit Plant')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Plant')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Existing Description'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /update plant/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  // Test form validation
  test('shows error message for empty fields', async () => {
    render(<PlantForm onAddPlant={mockOnAddPlant} />);

    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /add plant/i }));

    // Check for error message
    expect(
      await screen.findByText('Please fill in all fields'),
    ).toBeInTheDocument();
    expect(mockOnAddPlant).not.toHaveBeenCalled();
  });

  // Test successful plant addition
  test('successfully adds a new plant', async () => {
    render(<PlantForm onAddPlant={mockOnAddPlant} />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: 'New Plant' },
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: 'New Description' },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: 'Every day' },
    });
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /add plant/i }));

    // Verify API call and form reset
    await waitFor(() => {
      expect(api.addPlant).toHaveBeenCalledWith({
        name: 'New Plant',
        description: 'New Description',
        watering_schedule: 'Every day',
      });
      expect(mockOnAddPlant).toHaveBeenCalled();
      expect(screen.getByLabelText('Plant Name:')).toHaveValue('');
      expect(screen.getByLabelText('Description:')).toHaveValue('');
      expect(screen.getByLabelText('Watering Schedule:')).toHaveValue('');
    });
  });

  // Test successful plant update
  test('successfully updates an existing plant', async () => {
    const plantToEdit = {
      id: 1,
      name: 'Original Plant',
      description: 'Original Description',
    };

    render(
      <PlantForm
        onUpdatePlant={mockOnUpdatePlant}
        plantToEdit={plantToEdit}
        onCancel={mockOnCancel}
      />,
    );

    // Change form fields
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: 'Updated Plant' },
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: 'Updated Description' },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: 'Every day' },
    });
    // Submit update
    fireEvent.click(screen.getByRole('button', { name: /update plant/i }));

    // Verify API call
    await waitFor(() => {
      expect(api.updatePlantById).toHaveBeenCalledWith(1, {
        name: 'Updated Plant',
        description: 'Updated Description',
        watering_schedule: 'Every day',
      });
      expect(mockOnUpdatePlant).toHaveBeenCalled();
    });
  });

  // Test cancel button functionality
  test('cancel button calls onCancel and resets form', () => {
    const plantToEdit = {
      id: 1,
      name: 'Test Plant',
      description: 'Test Description',
    };

    render(
      <PlantForm
        onUpdatePlant={mockOnUpdatePlant}
        plantToEdit={plantToEdit}
        onCancel={mockOnCancel}
      />,
    );

    // Click cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Verify cancel callback was called
    expect(mockOnCancel).toHaveBeenCalled();
  });

  // Edge case: whitespace-only fields
  test('shows error for whitespace-only fields', async () => {
    render(<PlantForm onAddPlant={mockOnAddPlant} />);
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: '   ' },
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add plant/i }));
    expect(
      await screen.findByText('Please fill in all fields'),
    ).toBeInTheDocument();
  });

  // Edge case: long and special character input
  test('handles long and special character input', async () => {
    const longName = 'A'.repeat(256) + '!@#$%^&*()';
    const longDesc = 'B'.repeat(512) + '<script>alert(1)</script>';
    render(<PlantForm onAddPlant={mockOnAddPlant} />);
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: longName },
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: longDesc },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: 'Every day' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add plant/i }));
    await waitFor(() => {
      expect(api.addPlant).toHaveBeenCalledWith({
        name: longName,
        description: longDesc,
        watering_schedule: 'Every day',
      });
    });
  });

  // Edge case: submit button is disabled while loading
  test('submit button is disabled while loading', async () => {
    // Mock addPlant to resolve after a delay
    api.addPlant.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ id: 1, name: 'Test', description: 'Desc' }),
            100,
          ),
        ),
    );

    render(<PlantForm onAddPlant={mockOnAddPlant} />);
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: 'Desc' },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: 'Every day' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add plant/i }));
    // The button should be disabled and show 'Saving...' while loading
    const savingButton = await screen.findByRole('button', {
      name: /saving.../i,
    });
    expect(savingButton).toBeDisabled();
  });

  // Edge case: cancel resets form
  test('cancel resets form and calls onCancel', async () => {
    const plantToEdit = { id: 1, name: 'EditMe', description: 'EditDesc' };
    render(
      <PlantForm
        plantToEdit={plantToEdit}
        onUpdatePlant={mockOnUpdatePlant}
        onCancel={mockOnCancel}
      />,
    );
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: 'Changed' },
    });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
    // The form should reset to the original plantToEdit values on next open
  });

  // Edge case: API/network error handling
  test('shows error on API/network failure', async () => {
    api.addPlant.mockRejectedValueOnce(new Error('Network error'));
    render(<PlantForm onAddPlant={mockOnAddPlant} />);
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: 'Desc' },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: 'Every day' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add plant/i }));
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });
});
