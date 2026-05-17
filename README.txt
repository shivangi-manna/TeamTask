================================================================================
                    TASKFLOW — ENTERPRISE TEAM TASK MANAGER
================================================================================

LIVE DEPLOYMENT URL: https://taskteam-production.up.railway.app/
GITHUB REPOSITORY:   https://github.com/shivangi-manna/TeamTask
DEMO VIDEO (2-5 MIN): [Insert Demo Video Link Here]

================================================================================
1. PROJECT OVERVIEW
================================================================================
TaskFlow is a fully functional, production-ready collaborative Team Task Management Web Application. Built to satisfy rigorous full-stack engineering standards, it empowers multiple teams to seamlessly create projects, assign tasks, track real-time analytics, and collaborate securely under a strict Role-Based Access Control (RBAC) architecture.

Think of it as an ultra-premium, high-performance alternative to tools like Trello or Asana, featuring a stunning dark-mode glassmorphic UI.

================================================================================
2. FUNCTIONAL REQUIREMENTS FULFILLED
================================================================================
[x] User Authentication & Authorization
    - Role Selection at Signup: Users select their intended role (Admin or Member) right from the registration screen.
    - Secure Credentials: Hashed password storage via bcrypt.
    - Stateless Tokens: Secure JWT (python-jose) authentication with auto-expiring bearer tokens.

[x] Project Management
    - Creation & Ownership: Admins can instantly initialize new collaborative projects with custom visual accent colors.
    - Team Management: Admins can add or remove members from projects and assign specific workspace roles.
    - Targeted Visibility: Members experience a clean, focused view displaying only the projects they are assigned to.

[x] Task Management (Kanban Workflow)
    - Rich Task Creation: Tasks support comprehensive metadata including Title, Description, Priority (LOW, MEDIUM, HIGH, URGENT), and Due Dates.
    - Targeted Assignment: Tasks can be assigned directly to specific workspace members.
    - Dynamic Kanban Status: Real-time progression tracking across TODO, IN_PROGRESS, IN_REVIEW, and DONE.

[x] Real-Time Analytics Dashboard
    - Total Overview: Live counter of total workspace tasks and project completion rates.
    - Status Distribution: Recharts-powered interactive visual breakdowns of tasks by status.
    - User Load & Overdue Tracking: Dedicated monitoring for overdue deadlines and individual member task loads.

================================================================================
3. ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
================================================================================
Feature / Action                      | Admin Role | Member Role
--------------------------------------|------------|------------
Create, Edit & Delete Projects        | ALLOWED    | FORBIDDEN
Manage Team Members & Access          | ALLOWED    | FORBIDDEN
Create, Edit & Delete Tasks           | ALLOWED    | FORBIDDEN
Update Assigned Task Status           | ALLOWED    | ALLOWED
View Workspace & Assigned Tasks       | ALLOWED    | ALLOWED

================================================================================
4. TECHNICAL STACK & ARCHITECTURE
================================================================================
Frontend: React 18, Vite, Outfit & Plus Jakarta Sans typography, Vanilla CSS Glassmorphism
Backend:  Python 3.11, FastAPI, Pydantic, SQLAlchemy 2.0 ORM, python-jose (JWT), passlib (bcrypt)
Database: Local Dev: SQLite (taskflow.db) | Production: PostgreSQL (Railway)
Charts:   Recharts (SVG-based dynamic visualization)
Deploy:   Railway (Containerized via multi-stage Dockerfile / Nixpacks)

================================================================================
5. COMPREHENSIVE API ENDPOINTS
================================================================================
Method | Endpoint Route                  | Description & Purpose
-------|---------------------------------|--------------------------------------
POST   | /api/auth/signup                | Register new user account with role selection
POST   | /api/auth/login                 | Authenticate user and return JWT bearer token
GET    | /api/auth/me                    | Retrieve active session user profile
GET/POST| /api/projects                  | Fetch authorized projects / Initialize new project
GET/PUT| /api/projects/{id}              | Retrieve, update, or delete project workspace
GET/POST| /api/projects/{id}/members     | List workspace members / Invite new member
GET/POST| /api/projects/{id}/tasks       | Fetch project task backlog / Create new task
PUT/DEL| /api/projects/{id}/tasks/{tid}  | Update task details/status / Delete task
GET    | /api/dashboard/stats            | Aggregate high-level statistical metrics
GET    | /api/dashboard/my-tasks         | Fetch active user's assigned task queue
GET    | /api/health                     | Automated deployment health check endpoint

================================================================================
6. LOCAL DEVELOPMENT SETUP
================================================================================
Prerequisites: Python 3.9+ and Node.js 18+

Step 1: Install Full-Stack Dependencies
---------------------------------------
Terminal 1 (Backend):
cd server
python3 -m venv venv
source venv/bin/activate  # Mac/Linux (use `venv\Scripts\activate` on Windows)
pip install -r requirements.txt

Terminal 2 (Frontend):
cd client
npm install

Step 2: Zero-Config Local Database (SQLite)
-------------------------------------------
By default, the application is pre-configured to use SQLite (taskflow.db) for instant local development without requiring any external database installation! The ORM automatically generates the schema on first startup.

*(Optional)* To test with PostgreSQL locally, create a `server/.env` file:
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/taskflow
JWT_SECRET=super-secret-key-change-in-production

Step 3: Launch Development Servers
----------------------------------
Terminal 1 — FastAPI Backend:
cd server
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

Terminal 2 — React Frontend:
cd client
npm run dev

Open http://localhost:5173 in your browser to start collaborating!

================================================================================
7. PRODUCTION DEPLOYMENT (RAILWAY)
================================================================================
1. Create a new project on Railway (https://railway.app).
2. Add a PostgreSQL database service.
3. Deploy the GitHub repository service (https://github.com/shivangi-manna/TeamTask).
4. Configure the following environment variables in your app service:
   - DATABASE_URL → Reference the PostgreSQL database URL.
   - JWT_SECRET → Enter a secure cryptographic secret key.
   - NODE_ENV → production
5. Railway automatically utilizes the provided nixpacks.toml / Dockerfile to build the React frontend static bundle and mount it directly into the FastAPI server.

================================================================================
LICENSE: MIT License
================================================================================
