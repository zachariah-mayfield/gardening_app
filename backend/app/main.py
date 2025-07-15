# Z:\Main\github-repos\gardening_app\backend\app\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.plant_router import router as plant_router
from . import models
from . import database
from .database import engine
from fastapi.responses import HTMLResponse
from datetime import datetime

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Plant Tracker Gardening App API",
    description="Plant Tracker API for managing garden plants",
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

@app.get("/", response_class=HTMLResponse)
def root():
    return f"""
    <html>
    <head>
        <style>
            body {{
                background: #23272f;
                color: #fff;
                font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }}
            .container {{
                background: #2c313a;
                border-radius: 18px;
                box-shadow: 0 4px 24px rgba(60, 120, 60, 0.08);
                padding: 2.5rem 2.5rem 2rem 2.5rem;
                text-align: center;
            }}
            h1 {{
                color: #90caf9;
                font-size: 2.5rem;
                margin-bottom: 0.5em;
            }}
            a {{
                color: #1976d2;
                text-decoration: none;
                font-weight: 600;
                margin: 0 0.5em;
            }}
            a:hover {{
                color: #90caf9;
                text-decoration: underline;
            }}
            .footer {{
                color: #689f38;
                margin-top: 2rem;
                font-size: 1.1rem;
            }}
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>🌱 Plant Tracker Gardening App API</h1>
            <p>Welcome to the Plant Tracker Gardening App backend.</p>
            <p>See the <a href='/docs'>Plant Tracker Gardening App API Documentation</a> or <a href='/redoc'>ReDoc - Plant Tracker Gardening App API Reference Documentation</a>.</p>
            <div class='footer'>Happy Gardening! &copy; {datetime.now().year}</div>
        </div>
    </body>
    </html>
    """
