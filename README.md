# Gardening App

# Possible names for this web application:
## Plant Tracker Social
## Plant Tracker
## Social Gardening

# A full-stack FastAPI-based React, and PostgreSQL web application for managing garden plants, maintenance schedules, and tracking plants, built with SQLAlchemy for database management, Docker for containerization, and pgAdmin for database management.

---

## 🚀 Features

- **Plant Management:** Add, view, update, and delete plants with name and description.
- **RESTful API:** FastAPI backend with full CRUD endpoints.
- **Database Integration:** PostgreSQL with SQLAlchemy 2.0 ORM.
- **Frontend:** React app for interacting with the plant database.
- **Testing:** Comprehensive backend (pytest) and frontend (Jest/React Testing Library) tests.
- **Code Quality:** Linting (flake8, ESLint), formatting (black, Prettier), and type checking (mypy).
- **CI/CD:** Automated testing, linting, and formatting via GitHub Actions.
- **Containerization:** Docker and Docker Compose for easy setup.
- **pgAdmin:** Web UI for managing your PostgreSQL database.
- **Beginner-Friendly:** Extensive comments and documentation throughout the codebase.

---

## 🛠️ Technology Stack

- **Backend:** FastAPI, SQLAlchemy 2.0, Pydantic, PostgreSQL
- **Frontend:** React, Jest, React Testing Library, ESLint, Prettier
- **Database Management:** pgAdmin
- **DevOps:** Docker, Docker Compose, GitHub Actions

---

## 📦 Project Structure

```
gardening_app/
├── backend/
│   ├── app/                # FastAPI app (models, routers, tests, etc.)
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/                # React app source code
│   ├── package.json        # Frontend dependencies
│   └── Dockerfile
├── docker-compose.yml      # Multi-service orchestration
├── README.md               # This file
└── .github/workflows/      # CI/CD pipeline
```

---

## 🖥️ Installation & Running

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (16+ recommended, for local frontend dev)
- [Python 3.9+](https://www.python.org/) (for local backend dev)

### Quick Start (Recommended: Docker Compose)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zachariah-mayfield/gardening_app.git
   cd gardening_app
   ```

2. **Start all services (backend, frontend, db, pgAdmin):**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - pgAdmin: [http://localhost:5050](http://localhost:5050) (default: admin@admin.com / admin)

---

### Local Development (without Docker)

#### Backend

1. **Install dependencies:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Set up environment variables (optional):**
   - Create a `.env` file in `backend/` if you want to override the default database URL.

3. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the frontend:**
   ```bash
   npm start
   ```

---

## 🧪 Testing

### Backend

- **Run all backend tests:**
  ```bash
  cd backend
  source venv/bin/activate
  pytest app/__tests__/
  ```

- **Type checking:**
  ```bash
  mypy app/
  ```

- **Linting:**
  ```bash
  flake8 app/
  ```

### Frontend

- **Run all frontend tests:**
  ```bash
  cd frontend
  npm test
  ```

- **Linting:**
  ```bash
  npm run lint
  ```

- **Formatting:**
  ```bash
  npm run format
  ```

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api/v1`.

- `GET    /api/v1/plants`           - List all plants
- `POST   /api/v1/plants`           - Create a new plant
- `PUT    /api/v1/plants/id/{id}`   - Update a plant by ID
- `PUT    /api/v1/plants/name/{name}` - Update a plant by name
- `DELETE /api/v1/plants/id/{id}`   - Delete a plant by ID
- `DELETE /api/v1/plants/name/{name}` - Delete a plant by name

See [http://localhost:8000/docs](http://localhost:8000/docs) for interactive OpenAPI documentation.

---

## 🗄️ Database Management with pgAdmin

- Access pgAdmin at [http://localhost:5050](http://localhost:5050)
- Default login: `admin@admin.com` / `admin`
- Add a new server:
  - Host: `db`
  - Port: `5432`
  - Username: `postgres`
  - Password: `password`
- View and manage your `plants` table directly in the browser.

---

## 🛡️ Code Quality & CI/CD

- **Pre-commit hooks:** Lint and format code before every commit.
- **GitHub Actions:** Runs all tests, linting, and formatting on every push and pull request.
- **Strict type checking:** SQLAlchemy 2.0 style models, mypy, and Pydantic for robust data validation.

---

## 👩‍💻 Development Workflow

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push and open a pull request:**
   ```bash
   git push origin feature/your-feature
   ```

4. **CI/CD will automatically run all tests and checks.**

---

## 📝 Environment Variables

- `DATABASE_URL` (optional): Override the default PostgreSQL connection string.
- See `docker-compose.yml` for all service environment variables.

---

## 🧑‍🎓 For Beginners

- All code is heavily commented for learning purposes.
- See the `README_Files/` directory for extra backend, frontend, and database setup guides.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- Built with FastAPI, React, PostgreSQL, Docker, and the open-source community.

---