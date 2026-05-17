# TaskFlow — Enterprise Team Task Manager

![Live Deployment](https://img.shields.io/badge/Railway-Deployed_Live-00C7B7?style=for-the-badge&logo=railway)
![Python FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React Vite](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

> **🚀 Live Deployed Application:** [https://taskteam-production.up.railway.app/](https://taskteam-production.up.railway.app/)

---

## 📖 Overview

**TaskFlow** is a fully functional, production-ready collaborative Team Task Management Web Application. Built to satisfy rigorous full-stack engineering standards, it empowers multiple teams to seamlessly create projects, assign tasks, track real-time analytics, and collaborate securely under a strict **Role-Based Access Control (RBAC)** architecture.

Think of it as an ultra-premium, high-performance alternative to tools like Trello or Asana, featuring a stunning dark-mode glassmorphic UI.

---

## ✨ Functional Requirements Fulfilled

### 1. 🔐 User Authentication & Authorization
- **Role Selection at Signup:** Users select their intended role (**Admin** or **Member**) right from the registration screen.
- **Secure Credentials:** Hashed password storage via `bcrypt`.
- **Stateless Tokens:** Secure JWT (`python-jose`) authentication with auto-expiring bearer tokens.

### 2. 📁 Project Management
- **Creation & Ownership:** Admins can instantly initialize new collaborative projects with custom visual accent colors.
- **Team Management:** Admins can add or remove members from projects and assign specific workspace roles.
- **Targeted Visibility:** Members experience a clean, focused view displaying only the projects they are assigned to.

### 3. 📌 Task Management (Kanban Workflow)
- **Rich Task Creation:** Tasks support comprehensive metadata including Title, Description, Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and Due Dates.
- **Targeted Assignment:** Tasks can be assigned directly to specific workspace members.
- **Dynamic Kanban Status:** Real-time progression tracking across `TODO`, `IN_PROGRESS`, `IN_REVIEW`, and `DONE`.

### 4. 📊 Real-Time Analytics Dashboard
- **Total Overview:** Live counter of total workspace tasks and project completion rates.
- **Status Distribution:** Recharts-powered interactive visual breakdowns of tasks by status.
- **User Load & Overdue Tracking:** Dedicated monitoring for overdue deadlines and individual member task loads.

### 5. 👥 Role-Based Access Control (RBAC) Matrix

| Feature / Action | 👑 Admin Role | 👤 Member Role |
|-----------------|:-------------:|:--------------:|
| **Create, Edit & Delete Projects** | ✅ Allowed | ❌ Forbidden |
| **Manage Team Members & Access** | ✅ Allowed | ❌ Forbidden |
| **Create, Edit & Delete Tasks** | ✅ Allowed | ❌ Forbidden |
| **Update Assigned Task Status** | ✅ Allowed | ✅ Allowed |
| **View Workspace & Assigned Tasks** | ✅ Allowed | ✅ Allowed |

---

## 🛠️ Technical Stack & Architecture

```
┌────────────────────────────────────────────────────────┐
│                      FRONTEND                          │
│     React 18 ✦ Vite ✦ Outfit & Plus Jakarta Sans       │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP REST / JWT
┌───────────────────────────▼────────────────────────────┐
│                       BACKEND                          │
│          Python 3.11 ✦ FastAPI ✦ Pydantic              │
└───────────────────────────┬────────────────────────────┘
                            │ SQLAlchemy 2.0 ORM
┌───────────────────────────▼────────────────────────────┐
│                       DATABASE                         │
│     Local Dev: SQLite ✦ Production: PostgreSQL         │
└────────────────────────────────────────────────────────┘
```

---

## 📋 Comprehensive API Endpoints

| HTTP Method | Endpoint Route | Description & Purpose | Protected |
|:---:|:---|:---|:---:|
| **POST** | `/api/auth/signup` | Register new user account with role selection | ❌ |
| **POST** | `/api/auth/login` | Authenticate user and return JWT bearer token | ❌ |
| **GET** | `/api/auth/me` | Retrieve active session user profile | ✅ |
| **GET / POST** | `/api/projects` | Fetch authorized projects / Initialize new project | ✅ |
| **GET / PUT / DELETE**| `/api/projects/{id}` | Retrieve, update, or delete project workspace | ✅ (Admin) |
| **GET / POST** | `/api/projects/{id}/members` | List workspace members / Invite new member | ✅ (Admin) |
| **GET / POST** | `/api/projects/{id}/tasks` | Fetch project task backlog / Create new task | ✅ (Admin) |
| **PUT / DELETE** | `/api/projects/{id}/tasks/{tid}`| Update task details/status / Delete task | ✅ |
| **GET** | `/api/dashboard/stats` | Aggregate high-level statistical metrics | ✅ |
| **GET** | `/api/dashboard/my-tasks` | Fetch active user's assigned task queue | ✅ |
| **GET** | `/api/health` | Automated deployment health check endpoint | ❌ |

*Interactive Swagger UI documentation is automatically generated and accessible at `/docs`.*

---

## 🏗️ Local Development Setup

### Prerequisites
- **Python** 3.9+
- **Node.js** 18+

### 1. Install Full-Stack Dependencies

```bash
# Terminal 1: Backend Setup
cd server
python3 -m venv venv
source venv/bin/activate  # Mac/Linux (use `venv\Scripts\activate` on Windows)
pip install -r requirements.txt

# Terminal 2: Frontend Setup
cd client
npm install
```

### 2. Zero-Config Local Database (SQLite)
By default, the application is pre-configured to use **SQLite (`taskflow.db`)** for instant local development without requiring any external database installation! The ORM automatically generates the schema on first startup.

*(Optional)* To test with PostgreSQL locally, create a `server/.env` file:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/taskflow
JWT_SECRET=super-secret-key-change-in-production
```

### 3. Launch Development Servers

**Terminal 1 — FastAPI Backend:**
```bash
cd server
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — React Frontend:**
```bash
cd client
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser to start collaborating!

---

## 🚀 Production Deployment (Railway)

The application is fully containerized and configured for automated deployment on **Railway**.

1. Fork or clone this repository to your GitHub account.
2. Create a new project on [Railway](https://railway.app).
3. Add a **PostgreSQL** database service.
4. Deploy the GitHub repository service.
5. Configure the following environment variables in your app service:
   - `DATABASE_URL` → Reference the PostgreSQL database URL.
   - `JWT_SECRET` → Enter a secure cryptographic secret key.
   - `NODE_ENV` → `production`
6. Railway automatically utilizes the provided `nixpacks.toml` / `Dockerfile` to build the React frontend static bundle and mount it directly into the FastAPI server.

---

## 📁 Repository Structure

```
TeamTask/
├── client/                  # React 18 / Vite Frontend Architecture
│   ├── public/              # Static assets & SVG icons
│   ├── src/
│   │   ├── components/      # Reusable UI elements (Sidebar, Layout, Modal)
│   │   ├── context/         # React Context API (AuthProvider)
│   │   ├── pages/           # Application views (Dashboard, Projects, Kanban, Auth)
│   │   └── utils/           # Axios API interceptors & config
│   ├── index.html
│   └── vite.config.js       # Vite proxy & build configuration
├── server/                  # Python FastAPI Backend Architecture
│   ├── app/
│   │   ├── routers/         # Modular REST API route handlers
│   │   ├── config.py        # Pydantic environment management
│   │   ├── database.py      # SQLAlchemy engine & session factory
│   │   ├── dependencies.py  # OAuth2 & RBAC dependency injectors
│   │   ├── main.py          # FastAPI lifespan & middleware config
│   │   ├── models.py        # Relational database table schemas
│   │   ├── schemas.py       # Pydantic data validation models
│   │   └── security.py      # JWT encoding & bcrypt cryptography
│   └── requirements.txt     # Python package dependencies
├── Dockerfile               # Multi-stage production container definition
├── nixpacks.toml            # Railway automated build configuration
└── README.md                # Enterprise documentation
```

---

## 📄 License

This project is licensed under the **MIT License**.
