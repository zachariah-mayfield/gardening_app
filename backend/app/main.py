# Z:\Main\github-repos\gardening_app\backend\app\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .routers.plant_router import router as plant_router, PlantSchema
from . import models
from . import database
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gardening App API",
    description="API for managing garden plants",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.include_router(
    plant_router,
    prefix="/api/v1",
    tags=["plants"],
)
