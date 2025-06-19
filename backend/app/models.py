from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String
from .database import Base


# This class defines the structure of the 'plants' table in the database using SQLAlchemy 2.0 style.
# Each instance of this class represents a row in the table.
# SQLAlchemy's ORM (Object Relational Mapper) allows us to interact with the database using Python classes.
class Plant(Base):
    __tablename__ = "plants"  # The name of the table in the database

    # id: unique identifier for each plant (primary key, auto-incremented)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    # name: the name of the plant (must be unique)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    # description: a short description of the plant
    description: Mapped[str] = mapped_column(String, index=True)
    # watering_schedule: how often to water the plant (e.g., "Once a week")
    watering_schedule: Mapped[str] = mapped_column(String, index=True)
