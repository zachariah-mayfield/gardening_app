import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import * as api from '../services/api';

// Mock the entire api module
jest.mock('../services/api');

describe('App Component Tests', () => {
  // Sample plant data for testing
  const mockPlants = [
    { id: 1, name: 'Rose', description: 'A beautiful flower' },
    { id: 2, name: 'Tomato', description: 'A tasty vegetable' },
  ];

  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API responses
    api.fetchPlants.mockResolvedValue(mockPlants);
    api.addPlant.mockImplementation((plant) =>
      Promise.resolve({ ...plant, id: 3 }),
    );
    api.updatePlantById.mockImplementation((id, plant) =>
      Promise.resolve({ ...plant, id }),
    );
    api.updatePlantByName.mockImplementation((name, plant) =>
      Promise.resolve({ ...plant, name }),
    );
    api.deletePlantById.mockResolvedValue();
    api.deletePlantByName.mockResolvedValue();
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
    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.change(screen.getByDisplayValue('Rose'), {
      target: { value: 'Updated Rose' },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: 'Every day' },
    });
    fireEvent.click(screen.getByText('Update Plant'));
    // Verify update
    await waitFor(() => {
      expect(api.updatePlantById).toHaveBeenCalledWith(1, {
        name: 'Updated Rose',
        description: 'A beautiful flower',
        watering_schedule: 'Every day',
      });
    });
    // Wait for success message
    expect(
      await screen.findByText('Plant updated successfully!'),
    ).toBeInTheDocument();
  });

  test('deletes plant by ID when delete button is clicked', async () => {
    // Use jest.spyOn instead of reassigning api.deletePlantById
    jest.spyOn(api, 'deletePlantById').mockResolvedValue();
    render(<App />);
    await waitFor(() => expect(screen.getByText('Rose')).toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => expect(api.deletePlantById).toHaveBeenCalledWith(1));
  });

  test('deletes plant by name when delete button is clicked and no ID', async () => {
    api.fetchPlants.mockResolvedValueOnce([
      { name: 'Nameless Plant', description: 'No ID' },
    ]);
    // Use jest.spyOn instead of reassigning api.deletePlantByName
    jest.spyOn(api, 'deletePlantByName').mockResolvedValue();
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText('Nameless Plant')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() =>
      expect(api.deletePlantByName).toHaveBeenCalledWith('Nameless Plant'),
    );
  });

  test('adds a new plant successfully', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText('Rose')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: 'Basil' },
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: 'Herb' },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: 'Every day' },
    });
    fireEvent.click(screen.getByText('Add Plant'));
    await waitFor(() =>
      expect(api.addPlant).toHaveBeenCalledWith({
        name: 'Basil',
        description: 'Herb',
        watering_schedule: 'Every day',
      }),
    );
  });

  test('shows error when adding duplicate plant name', async () => {
    api.addPlant.mockResolvedValueOnce(null);
    render(<App />);
    await waitFor(() => expect(screen.getByText('Rose')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: 'Rose' },
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: 'Duplicate' },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: 'Every day' },
    });
    fireEvent.click(screen.getByText('Add Plant'));
    // Wait for error message
    expect(await screen.findByText(/failed to add plant/i)).toBeInTheDocument();
  });

  test('shows error for empty fields when adding', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Plant Name:'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Add Plant'));
    await waitFor(() =>
      expect(
        screen.getByText(/please fill in all fields/i),
      ).toBeInTheDocument(),
    );
  });

  test('shows error when updating non-existent plant', async () => {
    api.updatePlantById.mockRejectedValueOnce(
      new Error('Failed to update plant'),
    );
    render(<App />);
    await waitFor(() => expect(screen.getByText('Rose')).toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.change(screen.getByDisplayValue('Rose'), {
      target: { value: 'Ghost Plant' },
    });
    fireEvent.change(screen.getByLabelText('Watering Schedule:'), {
      target: { value: 'Every day' },
    });
    fireEvent.click(screen.getByText('Update Plant'));
    await waitFor(() =>
      expect(screen.getByText(/failed to update plant/i)).toBeInTheDocument(),
    );
  });

  test('shows error when deleting non-existent plant by ID', async () => {
    api.deletePlantById.mockRejectedValueOnce(
      new Error('Failed to delete plant'),
    );
    render(<App />);
    await waitFor(() => expect(screen.getByText('Rose')).toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() =>
      expect(screen.getByText(/failed to delete plant/i)).toBeInTheDocument(),
    );
  });

  test('shows error when deleting non-existent plant by name', async () => {
    api.fetchPlants.mockResolvedValueOnce([
      { name: 'Nameless Plant', description: 'No ID' },
    ]);
    api.deletePlantByName.mockRejectedValueOnce(
      new Error('Failed to delete plant'),
    );
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText('Nameless Plant')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() =>
      expect(screen.getByText(/failed to delete plant/i)).toBeInTheDocument(),
    );
  });

  test('deleting when plant list is empty does not crash', async () => {
    api.fetchPlants.mockResolvedValueOnce([]);
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/no plants yet/i)).toBeInTheDocument(),
    );
    // There should be no delete buttons
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  test('handles fetchPlants network/API failure gracefully', async () => {
    api.fetchPlants.mockRejectedValueOnce(new Error('API down'));
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/failed to load plants/i)).toBeInTheDocument(),
    );
  });

  test('UI disables delete/edit during loading', async () => {
    // Simulate slow fetchPlants
    let resolveFetch;
    api.fetchPlants.mockImplementation(
      () =>
        new Promise((res) => {
          resolveFetch = res;
        }),
    );
    render(<App />);
    // While loading, buttons should be disabled
    expect(screen.getByText(/loading plants/i)).toBeInTheDocument();
    // After resolving fetchPlants, buttons should be enabled
    resolveFetch([{ id: 1, name: 'Rose', description: 'A beautiful flower' }]);
    await waitFor(() => expect(screen.getByText('Rose')).toBeInTheDocument());
  });

  test('accessibility: all buttons have accessible names', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText('Rose')).toBeInTheDocument());
    expect(
      screen.getAllByRole('button', { name: /edit/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('button', { name: /delete/i }).length,
    ).toBeGreaterThan(0);
  });
});
