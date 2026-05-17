# TaskFlow — Team Task Manager

A full-stack web application for team project management with role-based access control. Create projects, assign tasks, track progress, and collaborate with your team.


## 🚀 Features

- **Authentication** — Secure signup/login with JWT tokens
- **Project Management** — Create, edit, and delete projects with custom colors
- **Task Tracking** — Kanban-style board with TODO → In Progress → In Review → Done
- **Team Collaboration** — Add members by email, assign roles (Admin/Member)
- **Role-Based Access Control** — Admins manage everything; Members update task status
- **Dashboard** — Overview stats, completion rate, status charts, overdue tracking
- **Responsive Design** — Works on desktop and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Python 3.11 + FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy 2.0 |
| Auth | JWT (python-jose) + bcrypt |
| Charts | Recharts |
| Deployment | Railway |

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/projects` | List/Create projects |
| GET/PUT/DELETE | `/api/projects/{id}` | Project CRUD |
| GET/POST | `/api/projects/{id}/members` | Team management |
| GET/POST | `/api/projects/{id}/tasks` | Task list/create |
| PUT/DELETE | `/api/projects/{id}/tasks/{tid}` | Task update/delete |
| GET | `/api/dashboard/stats` | Dashboard stats |
| GET | `/api/dashboard/my-tasks` | My assigned tasks |
| GET | `/api/health` | Health check |

Interactive API docs available at `/docs` (Swagger UI).

## 🏗️ Local Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Install Dependencies

```bash
# Backend
cd server
python3 -m venv venv
source venv/bin/activate  # Mac/Linux (use `venv\Scripts\activate` on Windows)
pip install -r requirements.txt

# Frontend
cd ../client
npm install
```

### 2. Zero-Config Database (SQLite)
By default, the backend is configured to use **SQLite (`taskflow.db`)** for instant local development without any database setup required! The tables are created automatically on startup.

*(Optional)* To use PostgreSQL locally, create `server/.env`:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/taskflow
JWT_SECRET=your-secret-key-here
```


### 4. Run

Terminal 1 — Backend:
```bash
cd server
uvicorn app.main:app --reload --port 8000
```

Terminal 2 — Frontend:
```bash
cd client
npm run dev
```

Open http://localhost:5173

## 🚀 Deployment

1. Create a new project on [Railway](https://railway.app) or your preferred cloud provider
2. Add a **PostgreSQL** database service
3. Deploy the project repository directly
4. Set environment variables:
   - `DATABASE_URL` → Reference the PostgreSQL service
   - `JWT_SECRET` → Generate a strong secret
   - `NODE_ENV` → `production`
5. The application auto-detects `nixpacks.toml` / `Dockerfile` and deploys automatically


## 👥 Role-Based Access

| Action | Admin | Member |
|--------|-------|--------|
| Create/edit/delete project | ✅ | ❌ |
| Manage team members | ✅ | ❌ |
| Create/edit/delete tasks | ✅ | ❌ |
| Update task status | ✅ | ✅ |
| View projects & tasks | ✅ | ✅ |

## 📁 Project Structure

```
team-task-manager/
├── client/          # React (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
├── server/          # Python FastAPI backend
│   ├── app/
│   │   ├── routers/
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── dependencies.py
│   │   └── main.py
│   └── requirements.txt
├── Dockerfile
└── README.md
```

## 📄 License

MIT
