from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Create the FastAPI app instance
app = FastAPI()

# CORS configuration (for allowing requests from the frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from the frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define the plant model (Pydantic)
class Plant(BaseModel):
    name: str
    description: str
    id: int  # ID will be auto-generated

# Define the PlantCreate model (no id field here, for POST requests)
class PlantCreate(BaseModel):
    name: str
    description: str

# In-memory "database" for plants (replace with actual database in production)
plants = []

# Create a router for plant-related routes
router = APIRouter()

@router.get("/plants", response_model=List[Plant])
def get_plants():
    return plants

@router.post("/plants", response_model=Plant)
def add_plant(plant: PlantCreate):
    print(f"Received plant: {plant}")  # Log the incoming data for debugging

    # Check if the plant with the same name already exists
    for existing_plant in plants:
        if existing_plant.name == plant.name:
            raise HTTPException(status_code=400, detail="Plant with this name already exists")

    # Simple ID generation (could be replaced with auto-increment logic in a DB)
    plant_id = len(plants) + 1  
    new_plant = Plant(id=plant_id, **plant.dict())  # Create a Plant model instance
    plants.append(new_plant)
    return new_plant

# Include the router in the app
app.include_router(router)
