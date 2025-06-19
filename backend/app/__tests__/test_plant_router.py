from fastapi.testclient import TestClient
from app.main import app

# This file contains tests for the plant API endpoints using FastAPI's TestClient.
# Each test function simulates a client making requests to the API and checks the responses.
# These tests help ensure your backend works as expected and handles edge cases.

client = TestClient(app)


def test_create_plant_success():
    # Test creating a new plant (POST request)
    response = client.post(
        "/api/v1/plants",
        json={
            "name": "TestPlant1",
            "description": "desc1",
            "watering_schedule": "Once a week"
        }
    )
    assert response.status_code == 200  # Should succeed
    data = response.json()
    assert data["name"] == "TestPlant1"
    assert data["description"] == "desc1"
    assert data["watering_schedule"] == "Once a week"
    assert "id" in data  # The response should include the new plant's ID


def test_create_plant_duplicate_name():
    # Test that creating a plant with a duplicate name returns an error
    client.post(
        "/api/v1/plants",
        json={"name": "TestPlantDup", "description": "desc", "watering_schedule": "Daily"}
    )
    response = client.post(
        "/api/v1/plants",
        json={"name": "TestPlantDup", "description": "desc again", "watering_schedule": "Weekly"}
    )
    assert response.status_code == 400  # Should fail with 400 Bad Request
    assert "already exists" in response.json()["detail"].lower()


def test_get_plants():
    # Test retrieving all plants (GET request)
    # Ensure at least one plant exists
    client.post(
        "/api/v1/plants",
        json={"name": "TestPlantGet", "description": "desc", "watering_schedule": "Every 3 days"}
    )
    response = client.get("/api/v1/plants")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)  # The response should be a list
    assert any(plant["name"] == "TestPlantGet" and plant["watering_schedule"] == "Every 3 days" for plant in data)


def test_update_plant_by_id_success():
    # Test updating a plant by its ID (PUT request)
    create = client.post(
        "/api/v1/plants",
        json={"name": "TestPlantUpdateID", "description": "desc", "watering_schedule": "Weekly"}
    )
    plant_id = create.json()["id"]
    response = client.put(
        f"/api/v1/plants/id/{plant_id}",
        json={"name": "UpdatedNameID", "description": "newdesc", "watering_schedule": "Monthly"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "UpdatedNameID"
    assert data["description"] == "newdesc"
    assert data["watering_schedule"] == "Monthly"


def test_update_plant_by_name_success():
    # Test updating a plant by its name (PUT request)
    client.post(
        "/api/v1/plants",
        json={"name": "TestPlantUpdateName", "description": "desc", "watering_schedule": "Weekly"}
    )
    response = client.put(
        "/api/v1/plants/name/TestPlantUpdateName",
        json={"name": "UpdatedNameByName", "description": "desc2", "watering_schedule": "Every 2 weeks"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "UpdatedNameByName"
    assert data["description"] == "desc2"
    assert data["watering_schedule"] == "Every 2 weeks"


def test_update_nonexistent_plant_by_id():
    # Test updating a plant that does not exist by ID
    response = client.put(
        "/api/v1/plants/id/999999",
        json={"name": "NoPlant", "description": "none", "watering_schedule": "Never"}
    )
    assert response.status_code == 404  # Should return 404 Not Found


def test_update_nonexistent_plant_by_name():
    # Test updating a plant that does not exist by name
    response = client.put(
        "/api/v1/plants/name/NoSuchPlant",
        json={"name": "NoPlant", "description": "none", "watering_schedule": "Never"},
    )
    assert response.status_code == 404  # Should return 404 Not Found


def test_delete_plant_by_id():
    # Test deleting a plant by its ID (DELETE request)
    response = client.post(
        "/api/v1/plants",
        json={"name": "TestDeleteID", "description": "desc", "watering_schedule": "Weekly"}
    )
    plant_id = response.json()["id"]
    del_response = client.delete(f"/api/v1/plants/id/{plant_id}")
    assert del_response.status_code == 204  # Should return 204 No Content


def test_delete_plant_by_name():
    # Test deleting a plant by its name (DELETE request)
    client.post(
        "/api/v1/plants",
        json={"name": "TestDeleteName", "description": "desc", "watering_schedule": "Weekly"}
    )
    del_response = client.delete("/api/v1/plants/name/TestDeleteName")
    assert del_response.status_code == 204  # Should return 204 No Content


def test_delete_nonexistent_plant_by_id():
    # Test deleting a plant that does not exist by ID
    response = client.delete("/api/v1/plants/id/999999")
    assert response.status_code == 404  # Should return 404 Not Found


def test_delete_nonexistent_plant_by_name():
    # Test deleting a plant that does not exist by name
    response = client.delete("/api/v1/plants/name/NoSuchPlant")
    assert response.status_code == 404  # Should return 404 Not Found
