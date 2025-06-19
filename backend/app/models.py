from sqlalchemy import Column, Integer, String
from .database import Base


# This class defines the structure of the 'plants' table in the database.
# Each instance of this class represents a row in the table.
# SQLAlchemy's ORM (Object Relational Mapper) allows us to interact with the database using Python classes.
class Plant(Base):
    __tablename__ = "plants"  # The name of the table in the database

    # id: unique identifier for each plant (primary key, auto-incremented)
    id = Column(Integer, primary_key=True, index=True)
    # name: the name of the plant (must be unique)
    name = Column(String, unique=True, index=True)
    # description: a short description of the plant
    description = Column(String, index=True)
