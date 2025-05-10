import os
import subprocess
import sys
import shutil

project_structure = {
    "backend/app/routers": ["__init__.py", "example.py"],
    "backend/app": ["__init__.py", "main.py", "models.py", "schemas.py", "crud.py", "database.py"],
    "backend": ["Dockerfile", "requirements.txt"],
    "frontend/src": ["App.js", "index.js"],
    "frontend/public": [],
    "frontend": ["Dockerfile", "package.json"],
    ".github/workflows": ["ci-cd.yml"],
    "": [".env", "docker-compose.yml", "README.md"]
}

file_contents = {
    ".env": """POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres
DATABASE_URL=postgresql://postgres:password@db:5432/postgres
""",
    "docker-compose.yml": """version: '3.9'

services:
  backend:
    build: ./backend
    container_name: backend
    ports:
      - "8000:8000"
    depends_on:
      - db
    env_file:
      - .env
    environment:
      - DATABASE_URL=${DATABASE_URL}

  frontend:
    build: ./frontend
    container_name: frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  db:
    image: postgres:13
    container_name: postgres
    restart: always
    env_file:
      - .env
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
""",
    "README.md": "# Full Stack Web App with FastAPI, React, and PostgreSQL",
    "backend/Dockerfile": """FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
""",
    "backend/requirements.txt": "fastapi\nuvicorn[standard]\nsqlalchemy\npsycopg2-binary\npython-dotenv",
    "backend/app/__init__.py": "",
    "backend/app/main.py": """from fastapi import FastAPI
from app.routers import example

app = FastAPI()

app.include_router(example.router)
""",
    "backend/app/routers/__init__.py": "",
    "backend/app/routers/example.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
def ping():
    return {"message": "pong"}
""",
    "backend/app/models.py": "",
    "backend/app/schemas.py": "",
    "backend/app/crud.py": "",
    "backend/app/database.py": """from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@db:5432/postgres")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
""",
    "frontend/Dockerfile": """FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install

COPY ./src ./src
COPY public ./public

CMD ["npm", "start"]
""",
    "frontend/package.json": """{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
""",
    "frontend/src/App.js": """import React from 'react';

function App() {
  return <h1>Hello from React!</h1>;
}

export default App;
""",
    "frontend/src/index.js": """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
""",
    ".github/workflows/ci-cd.yml": """name: CI/CD

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: password
          POSTGRES_DB: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt

      - name: Run backend tests
        run: echo "No backend tests yet"

      - name: Run frontend build
        run: |
          cd frontend
          npm install
          npm run build
"""
}


def run_command(cmd, cwd=None):
    print(f"📦 Running: {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd)
    if result.returncode != 0:
        print(f"❌ Command failed: {cmd}")
        sys.exit(1)


def create_structure():
    for path, files in project_structure.items():
        if path:
            os.makedirs(path, exist_ok=True)
        for file in files:
            full_path = os.path.join(path, file) if path else file
            rel_path = os.path.relpath(full_path).replace("\\", "/")  # Fix for path separators
            content = file_contents.get(rel_path, "")
            with open(full_path, "w") as f:
                f.write(content)




def install_dependencies():
    run_command("python -m venv venv")

    print("⚠️ Please activate the virtual environment manually:")
    if os.name == "nt":
        print("   .\\venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")

    print("📦 Installing backend dependencies...")
    run_command(".\\venv\\Scripts\\python -m pip install -r backend/requirements.txt" if os.name == "nt"
                else "./venv/bin/python -m pip install -r backend/requirements.txt")

    print("📦 Installing frontend dependencies...")
    run_command("npm install", cwd="frontend")



def start_docker():
    run_command("docker-compose up --build -d")


def main():
    print("📁 Creating project structure...")
    create_structure()
    print("✅ Structure ready.")
    
    print("⚙️ Installing backend and frontend dependencies...")
    install_dependencies()
    print("✅ Dependencies installed.")

    print("🐳 Building and starting Docker containers...")
    start_docker()
    print("✅ Docker containers running.")

    print("🎉 All done! Visit http://localhost:3000 for frontend and http://localhost:8000/docs for FastAPI docs.")


if __name__ == "__main__":
    main()
