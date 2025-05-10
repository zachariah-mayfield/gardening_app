# schemas.py

from pydantic import BaseModel

class PlantBase(BaseModel):
    name: str
    description: str

class PlantCreate(PlantBase):
    pass  # used for POST requests

class Plant(PlantBase):
    id: int  # returned in GET/response
