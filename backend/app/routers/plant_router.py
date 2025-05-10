# Z:\Main\github-repos\gardening_app\backend\app\routers\plant_router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

class Plant(BaseModel):
    name: str
    description: str
    id: int = None

# In-memory "database" for plants
plants = []
router = APIRouter()

@router.get("/plants")
def get_plants():
    return {"plants": plants}

@router.post("/plants", response_model=Plant)
async def add_plant(plant: Plant):
    # Check for duplicates by normalized name
    logging.debug(f"Checking for duplicates with name: {plant.name}")
    for existing in plants:
        if existing.name.strip().lower() == plant.name.strip().lower():
            logging.debug(f"Duplicate found: {existing.name}")
            raise HTTPException(status_code=400, detail="Plant with this name already exists")
    
    # Generate new plant ID
    plant_id = len(plants) + 1
    new_plant = Plant(id=plant_id, name=plant.name.strip(), description=plant.description.strip())
    plants.append(new_plant)
    logging.debug(f"Plant added: {new_plant}")
    
    return new_plant
