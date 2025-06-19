from fastapi import APIRouter, FastAPI
from pydantic import BaseModel

# This file provides example endpoints for learning or testing purposes.
# It is not used in the main application, but shows how to define routes and use Pydantic models.

app = FastAPI()
router = APIRouter()


# Define a Pydantic model for the plant data
# This model is used to validate and serialize request/response data for plants.
class Plant(BaseModel):
    name: str
    description: str


# Route to get all plants
# This endpoint returns a hardcoded list of plant dictionaries.
# In a real app, you would fetch this data from a database.
@router.get("/plants")
def get_plants():
    return {
        "plants": [
            {"id": 1, "name": "Cactus", "description": "A succulent plant."},
            {"id": 2, "name": "Aloe Vera", "description": "A medicinal plant."},
            {"id": 3, "name": "Rose", "description": "A flowering plant."},
        ]
    }


# Route to create a new plant
# This endpoint accepts a Plant object in the request body and returns a mock response.
# In a real app, you would save the new plant to a database and generate a unique ID.
@router.post("/plants")
def create_plant(plant: Plant):
    new_plant = {
        "id": 4,  # You can auto-generate an ID or handle it more robustly.
        "name": plant.name,
        "description": plant.description,
    }
    # Ideally, here you would save the new plant to a database.
    return {"message": "Plant created", "plant": new_plant}


# Add router to the app
# This line includes the router's endpoints in the FastAPI app instance.
app.include_router(router)
