# Standard SQLAlchemy imports for database functionality
from sqlalchemy import create_engine  # Core SQLAlchemy functionality for database
from sqlalchemy.ext.declarative import declarative_base  # Base class for declarative
from sqlalchemy.orm import sessionmaker  # Creates database session factory
import os  # For environment variable access

# Database connection URL
# Format: postgresql://username:password@host:port/database_name
# Uses environment variable if set, otherwise falls back to default values
# This URL is used by Docker to connect to the PostgreSQL container
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",  # Look for DATABASE_URL in environment
    "postgresql://postgres:password@db:5432/postgres",  # Default fallback URL
)

# Create the SQLAlchemy engine
# The engine is the starting point for any SQLAlchemy application
# It maintains the pool of database connections
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # Additional engine parameters could be added here:
    # pool_size=5,              # Maximum number of database connections to keep
    # max_overflow=10,          # How many connections above pool_size to allow
    # pool_timeout=30,          # Seconds to wait before giving up on getting a connection
)

# Create the SessionLocal class
# This is a factory for creating new database sessions
# Each request will create a new session and close it when done
SessionLocal = sessionmaker(
    autocommit=False,  # Transactions won't be automatically committed
    autoflush=False,  # Changes won't be automatically flushed to the database
    bind=engine,  # Bind the session to our database engine
)

# Create the declarative base class
# This is the base class for all our database models
# All our model classes will inherit from this
Base = declarative_base()


# Database Session Dependency
# This function is used by FastAPI to provide a database session to each request.
# It ensures that each request gets its own session, and that the session is closed after the request is complete.
def get_db():
    """
    Creates and manages database sessions for API requests

    This is a dependency that will be used by FastAPI
    It creates a new database session for each request
    The session is automatically closed when the request is complete

    Yields:
        Session: SQLAlchemy database session

    Usage:
        @app.get("/items/")
        def read_items(db: Session = Depends(get_db)):
            items = db.query(models.Item).all()
            return items
    """
    db = SessionLocal()  # Create a new database session
    try:
        yield db  # Use the session in the request
    finally:
        db.close()  # Make sure the session is closed after the request


# Initialize the database tables
# This creates all tables defined in our models
# In production, you would typically use migrations instead
Base.metadata.create_all(bind=engine)

# Integration points:
# 1. main.py uses get_db() as a dependency for database access
# 2. models.py defines table structures that inherit from Base
# 3. plant_router.py uses the database session for CRUD operations
# 4. Frontend api.js connects to endpoints that use these database functions

# In summary:
# - This file sets up the connection to the PostgreSQL database using SQLAlchemy.
# - It provides a session factory and a dependency for FastAPI endpoints to use.
# - It ensures that database tables are created at startup (for development/testing).
