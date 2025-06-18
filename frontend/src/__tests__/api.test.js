// Import API functions to test
import { fetchPlants, addPlant, updatePlantById, updatePlantByName, deletePlantById, deletePlantByName } from '../services/api';

// Mock the global fetch function
global.fetch = jest.fn();

// Group all API-related tests
describe('API Service Tests', () => {
    // Reset mocks before each test
    beforeEach(() => {
        fetch.mockClear();
        // Mock successful response
        fetch.mockImplementation(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        );
    });

    // Test GET plants endpoint
    test('fetchPlants calls correct endpoint with GET method', async () => {
        await fetchPlants();
        
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/v1/plants',
            expect.objectContaining({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        );
    });

    // Test POST new plant endpoint
    test('addPlant sends correct data with POST method', async () => {
        const newPlant = {
            name: 'Test Plant',
            description: 'Test Description'
        };

        await addPlant(newPlant);

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/v1/plants',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPlant)
            })
        );
    });

    // Test PUT update plant by ID endpoint
    test('updatePlantById sends correct data to correct endpoint', async () => {
        const plantId = 1;
        const updatedPlant = {
            name: 'Updated Plant',
            description: 'Updated Description'
        };

        await updatePlantById(plantId, updatedPlant);

        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:8000/api/v1/plants/id/${plantId}`,
            expect.objectContaining({
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPlant)
            })
        );
    });

    // Test error handling
    test('handles API errors correctly', async () => {
        // Mock a failed API call
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            })
        );

        // Expect the API call to throw an error
        await expect(fetchPlants()).rejects.toThrow('HTTP error! status: 404');
    });

    // Test network errors
    test('handles network errors correctly', async () => {
        // Mock a network failure
        fetch.mockImplementationOnce(() => 
            Promise.reject(new Error('Network error'))
        );

        await expect(fetchPlants()).rejects.toThrow('Network error');
    });

    test('deletePlantById calls correct endpoint with DELETE method', async () => {
        fetch.mockResolvedValueOnce({ ok: true });
        await deletePlantById(42);
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/v1/plants/id/42',
            expect.objectContaining({ method: 'DELETE' })
        );
    });

    test('deletePlantByName calls correct endpoint with DELETE method', async () => {
        fetch.mockResolvedValueOnce({ ok: true });
        await deletePlantByName('Rose');
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/v1/plants/name/Rose',
            expect.objectContaining({ method: 'DELETE' })
        );
    });

    test('deletePlantById throws error on failure', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(deletePlantById(42)).rejects.toThrow('Failed to delete plant');
    });

    test('deletePlantByName throws error on failure', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(deletePlantByName('Rose')).rejects.toThrow('Failed to delete plant');
    });
});