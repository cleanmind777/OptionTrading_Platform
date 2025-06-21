# Option Trading Platform

A comprehensive option trading platform with automated bot trading, performance tracking, and user management capabilities.

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.11+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with refresh tokens and cookie-based sessions
- **Caching**: Redis for session storage and caching
- **Security**: Rate limiting, CORS, input validation
- **Monitoring**: Structured logging, health checks

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Jotai for lightweight state management
- **Routing**: React Router v6 with protected routes
- **HTTP Client**: Axios with interceptors and error handling

## 🚀 Features

### Core Functionality
- ✅ User authentication and session management
- ✅ Automated bot trading system
- ✅ Performance tracking and analytics
- ✅ Real-time trading dashboard
- ✅ Strategy management and backtesting
- ✅ Risk management tools
- ✅ Email notifications and alerts

### Security Features
- ✅ JWT-based authentication with refresh tokens
- ✅ Cookie-based session management
- ✅ Rate limiting and CORS protection
- ✅ Input validation and sanitization
- ✅ Password strength requirements
- ✅ Session timeout and activity monitoring

### Performance Features
- ✅ Database connection pooling
- ✅ Redis caching layer
- ✅ Code splitting and lazy loading
- ✅ Optimized API responses
- ✅ Background task processing

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Git

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd OptionTrading_Platform
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb trading_platform

# Run database migrations (if using Alembic)
alembic upgrade head
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your configuration
nano .env
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Application
DEBUG=false
PROJECT_NAME="Option Trading Platform"
VERSION="1.0.0"

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/trading_platform
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Redis
REDIS_URL=redis://localhost:6379

# Cookies
COOKIE_SECURE=false  # Set to true in production
COOKIE_HTTPONLY=true
COOKIE_SAMESITE=lax
COOKIE_DOMAIN=localhost

# Session
SESSION_EXPIRE_MINUTES=60

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_BACKEND_URL=http://localhost:8000

# Application Configuration
VITE_APP_NAME="Option Trading Platform"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false

# Development Configuration
VITE_DEV_MODE=true
VITE_API_TIMEOUT=30000
```

## 🚀 Running the Application

### Development Mode

#### Backend
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm run dev
```

### Production Mode

#### Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
OptionTrading_Platform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       └── routers.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/
│   │   │   ├── repositories/
│   │   │   └── session.py
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── main.py
│   ├── requirements.txt
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── atoms/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── env.example
└── README.md
```

## 🔧 Development

### Code Style

#### Backend (Python)
- Use Black for code formatting
- Use isort for import sorting
- Use flake8 for linting
- Use mypy for type checking

```bash
cd backend
black .
isort .
flake8 .
mypy .
```

#### Frontend (TypeScript)
- Use Biome for formatting and linting
- Use TypeScript strict mode

```bash
cd frontend
npm run format
npm run lint
```

### Testing

#### Backend
```bash
cd backend
pytest
pytest --cov=app
```

#### Frontend
```bash
cd frontend
npm test
```

### Database Migrations

```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

## 🔒 Security Best Practices

### Backend
- ✅ Environment variables for all secrets
- ✅ Input validation with Pydantic
- ✅ JWT token expiration and refresh
- ✅ Rate limiting on API endpoints
- ✅ CORS configuration
- ✅ SQL injection prevention with ORM
- ✅ Password hashing with bcrypt

### Frontend
- ✅ HTTPS in production
- ✅ Secure cookie settings
- ✅ Input sanitization
- ✅ XSS prevention
- ✅ CSRF protection with SameSite cookies

## 📊 Monitoring & Logging

### Backend
- Structured JSON logging
- Request/response logging
- Error tracking and reporting
- Health check endpoints
- Performance metrics

### Frontend
- Error boundaries for React components
- API error handling and retry logic
- User activity monitoring
- Performance monitoring

## 🚀 Deployment

### Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
```

### Environment-Specific Configurations

#### Development
- Debug mode enabled
- Detailed error messages
- Hot reload enabled
- Local database and Redis

#### Production
- Debug mode disabled
- Optimized builds
- Production database
- Redis cluster
- Load balancer configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔄 Changelog

### Version 1.0.0
- Initial release
- User authentication and session management
- Basic trading functionality
- Performance tracking
- Bot management system

---

**Note**: This is a comprehensive trading platform. Please ensure compliance with all applicable financial regulations and laws in your jurisdiction before using this software for actual trading activities.