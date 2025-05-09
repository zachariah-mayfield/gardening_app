from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# Importing local modules
from app import models                    # Contains SQLAlchemy ORM models
from app import database                  # ✅ Needed for accessing SessionLocal in get_db
from app.database import engine           # Used to initialize tables with create_all()

# Automatically create all tables on startup (if they don't exist yet)
models.Base.metadata.create_all(bind=engine)

# Create the FastAPI application instance
app = FastAPI()

# Configure CORS (Cross-Origin Resource Sharing) to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL allowed to make requests
    allow_credentials=True,
    allow_methods=["*"],                      # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],                      # Allow all HTTP headers
)

# Dependency to get a new database session for each request
def get_db():
    db = database.SessionLocal()  # Create new DB session
    try:
        yield db                 # Yield session to be used in the request
    finally:
        db.close()              # Always close the session after request ends

# Pydantic model for response (includes ID)
class Plant(BaseModel):
    name: str
    description: str
    id: int  # ID will be auto-generated by the database

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy model compatibility

# Pydantic model for request (no ID field)
class PlantCreate(BaseModel):
    name: str
    description: str

# Create an API router for plant-related endpoints
router = APIRouter()

# Endpoint: GET /plants - Retrieve all plants
@router.get("/plants", response_model=List[Plant])
def get_plants(db: Session = Depends(get_db)):
    plants = db.query(models.Plant).all()
    return plants

# Endpoint: POST /plants - Add a new plant
@router.post("/plants", response_model=Plant)
def add_plant(plant: PlantCreate, db: Session = Depends(get_db)):
    # Check if a plant with the same name already exists
    existing_plant = db.query(models.Plant).filter(models.Plant.name == plant.name).first()
    if existing_plant:
        raise HTTPException(status_code=400, detail="Plant with this name already exists")

    # Create a new plant object and add it to the DB
    new_plant = models.Plant(**plant.dict())
    db.add(new_plant)
    db.commit()
    db.refresh(new_plant)  # Refresh to get the generated ID
    return new_plant

# Include the router in the FastAPI app
app.include_router(router)
