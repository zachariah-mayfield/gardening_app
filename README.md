# Full Stack Web App with FastAPI, React, and PostgreSQL

# Gardening App

A full-stack application for managing garden plants and maintenance schedules.

## 🌱 Features

- Plant catalog with care instructions
- Maintenance scheduling and reminders
- Weather integration
- User authentication and profiles
- Responsive design for mobile and desktop

## 🛠️ Technology Stack

### Frontend
- React.js
- Material-UI
- Redux for state management
- Axios for API calls

### Backend
- Python/Django REST Framework
- PostgreSQL database
- JWT authentication
- Celery for background tasks

### DevOps
- Docker containerization
- GitHub Actions CI/CD
- Nginx reverse proxy

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 16+
- Python 3.9+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zachariah-mayfield/gardening_app.git
cd gardening_app
```

2. Start with Docker Compose:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs/

## 📝 Environment Variables

Create a `.env` file in the root directory:
```
POSTGRES_DB=gardening_db
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
DJANGO_SECRET_KEY=your_secret_key
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
python manage.py test
```

## 📦 Project Structure
```
gardening_app/
├── frontend/          # React application
├── backend/          # Django REST API
├── docker/           # Docker configuration
├── .github/          # GitHub Actions workflows
└── docs/            # Additional documentation
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Refresh JWT token

### Plants
- `GET /api/plants/` - List all plants
- `POST /api/plants/` - Create new plant
- `GET /api/plants/{id}/` - Get plant details
- `PUT /api/plants/{id}/` - Update plant
- `DELETE /api/plants/{id}/` - Delete plant

### Maintenance
- `GET /api/maintenance/` - List maintenance schedules
- `POST /api/maintenance/` - Create maintenance task
- `GET /api/maintenance/{id}/` - Get task details

### Weather
- `GET /api/weather/current/` - Get current weather
- `GET /api/weather/forecast/` - Get weather forecast

## 🚀 Deployment

### Production Setup

1. Configure production environment:
```bash
cp .env.example .env.production
# Edit .env.production with your production values
```

2. Build production images:
```bash
docker-compose -f docker-compose.prod.yml build
```

3. Deploy using Docker Swarm:
```bash
docker swarm init
docker stack deploy -c docker-compose.prod.yml gardening_app
```

### SSL Configuration

1. Configure Nginx with SSL:
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://frontend:3000;
    }
    
    location /api {
        proxy_pass http://backend:8000;
    }
}
```

## 👩‍💻 Development Workflow

1. Create a new feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Run development environment:
```bash
docker-compose -f docker-compose.dev.yml up
```

3. Access development tools:
- Frontend dev server: http://localhost:3000
- Backend dev server: http://localhost:8000
- pgAdmin: http://localhost:5050
- Redis Commander: http://localhost:8081

### Code Quality

- Run linting:
```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && flake8
```

- Run type checking:
```bash
# Frontend
cd frontend && npm run type-check

# Backend
cd backend && mypy .
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:
```bash
git commit -m 'Add amazing feature'
```

4. Push to the branch:
```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

### Pull Request Guidelines
- Include unit tests for new features
- Update documentation as needed
- Follow the existing code style
- Keep commits atomic and well-described
- Reference relevant issues in commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Zachariah Mayfield - Initial work

## 🙏 Acknowledgments

- Material-UI for the component library
- Django REST Framework for the API framework
- Docker for containerization
- GitHub Actions for CI/CD