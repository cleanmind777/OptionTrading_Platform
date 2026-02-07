# 🧭 Option Trading Platform

A full-stack platform for managing options trading strategies, automated bots, backtesting, and live trading with broker integrations (e.g. Schwab) and market data (Polygon).

---

## 📚 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Screenshots](#screenshots)
- [API Documentation](#api-documentation)
- [Acknowledgements](#acknowledgements)

---

## 🧩 About

This project provides an intuitive interface for managing options trading: defining strategies, running backtests, and operating live or demo trading bots. It combines a FastAPI backend with a React frontend, Celery for async tasks, and integrations with market data and brokerage APIs.

**Key goals:**

- Centralize strategy design, backtesting, and live/demo trading in one place.
- Support multiple brokers and data sources via configurable integrations.
- Offer a clear UI for monitoring bots, accounts, and trading logs.

---

## ✨ Features

- **Strategy management** – Create, edit, and version trading strategies.
- **Backtesting** – Run historical strategy tests with configurable parameters.
- **Trading bots** – Deploy and manage automated bots with live or demo accounts.
- **Trading accounts** – Connect and manage brokerage accounts (e.g. Schwab).
- **Trading logs & history** – View orders, executions, and task history.
- **User auth & OAuth** – Authentication with optional Google OAuth and email (EmailJS).
- **Market data** – Integration with Polygon (and other providers) for quotes and history.

---

## 🧠 Tech Stack

| Category   | Technologies |
| ---------- | ------------ |
| **Languages** | Python, TypeScript |
| **Backend**   | FastAPI, Uvicorn, Celery, Redis (broker) |
| **Frontend**  | React, Vite, Tailwind CSS, Ant Design, Recharts, Lightweight Charts |
| **Database**  | PostgreSQL, SQLAlchemy |
| **Tools**     | Docker (optional), dotenv, OAuth (Google), EmailJS |

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/OptionTrading_Platform.git

# Navigate to the project directory
cd OptionTrading_Platform
```

**Backend:**

```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**

```bash
cd frontend
npm install   # or: bun install
```

**Celery worker (optional, for async tasks):**

```bash
cd backend
mkdir logs
celery -A celery_app.celery_app worker --pool=eventlet --concurrency=10 --loglevel=INFO
```

---

## 🚀 Usage

**1. Start the backend API:**

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

**2. Start the frontend dev server:**

```bash
cd frontend
npm run dev   # or: bun run dev
```

**3. Open in browser:**

👉 [http://localhost:5173](http://localhost:5173) (frontend)  
👉 [http://localhost:8000](http://localhost:8000) (API)  
👉 [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

---

## 🧾 Configuration

Create a `.env` file in the `backend` directory (see `backend/env.example`):

```env
DATABASE_URL=postgresql://username:password@localhost:5432/db_name
FRONTEND_URL=http://localhost:5173
DEBUG=true
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Email (EmailJS)
EMAILJS_PUBLIC_KEY=
EMAILJS_RRIVATE_KEY=
EMAILJS_RESET_TEMPLATE_ID=
EMAILJS_SERVICE_ID=

# Market data & domain
POLYGON_API_KEY=
DOMAIN=
```

Ensure PostgreSQL is running and the database exists; the app creates tables on startup.

---

## 🖼 Screenshots

Screenshots are stored in the [doc/images](doc/images/) folder.

| | |
|---|---|
| ![Screenshot 1](doc/images/ScreenShot%20(1).png) | ![Screenshot 2](doc/images/ScreenShot%20(2).png) |
| *Screenshot 1* | *Screenshot 2* |
| ![Screenshot 3](doc/images/ScreenShot%20(3).png) | ![Screenshot 4](doc/images/ScreenShot%20(4).png) |
| *Screenshot 3* | *Screenshot 4* |
| ![Screenshot 5](doc/images/ScreenShot%20(5).png) | ![Screenshot 6](doc/images/ScreenShot%20(6).png) |
| *Screenshot 5* | *Screenshot 6* |
| ![Screenshot 7](doc/images/ScreenShot%20(7).png) | |
| *Screenshot 7* | |

---

## 📜 API Documentation

The API is served at `/api/v1`. Main endpoint groups:

| Method | Endpoint (prefix `/api/v1`) | Description |
|--------|-----------------------------|-------------|
| - | `/auth` | Authentication (login, register, OAuth) |
| - | `/users` | User profile and management |
| - | `/strategies` | Strategy CRUD |
| - | `/backtest` | Backtest runs and results |
| - | `/bot` | Trading bot configuration and control |
| - | `/demo` | Demo account / demo trading |
| - | `/live_trade` | Live trading operations |
| - | `/schwab` | Schwab brokerage integration |

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI).

More detail: see the [doc](doc/) folder and API docs linked there.

---

## 🌟 Acknowledgements

- Inspiration or resources used  
- Libraries, icons, or tutorials referenced  
- Collaborators or contributors  
