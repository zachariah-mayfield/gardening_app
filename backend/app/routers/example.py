from fastapi import APIRouter, FastAPI
from pydantic import BaseModel

app = FastAPI()
router = APIRouter()

# Define a Pydantic model for the plant data
class Plant(BaseModel):
    name: str
    description: str

# Route to get all plants
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
app.include_router(router)
