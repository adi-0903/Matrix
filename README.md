# 🌌 Mind Matrix — Advanced Full-Stack Blogging, Series & Events Engine

Mind Matrix is a modern, high-performance blogging, episodic publishing, and event management platform. It features a Django REST Framework backend coupled with a responsive, high-fidelity React client powered by Vite and Framer Motion.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client [Vite React Frontend]
        UI[React Components & Pages]
        Rtr[React Router DOM]
        FM[Framer Motion Animations]
        API[API Client Axios/Fetch]
    end

    subgraph Server [Django REST Framework Backend]
        URL[URL Routers & APIs]
        VWS[ViewSets & Permissions]
        SRL[DRF Serializers]
        MDL[Django Relational Models]
    end

    subgraph Data [Data Persistence]
        DB_Cloud[(Neon PostgreSQL Cloud)]
        DB_Local[(Local SQLite Fallback)]
    end

    UI --> Rtr
    UI --> FM
    UI --> API
    API -- HTTPS JSON / JWT --> URL
    URL --> VWS
    VWS --> SRL
    SRL --> MDL
    MDL -->|USE_SQLITE=False| DB_Cloud
    MDL -->|USE_SQLITE=True| DB_Local
```

---

## ✨ Key Features

- **Relational Episodic Publishing**: Write standalone articles, group them into structured **Series**, and further partition series into **Seasons** and **Episodes**.
- **Dual Authentication Model**: 
  - Token-based authentication using **Simple JWT** (with automated refresh handling).
  - One-click login flow integration via **Google OAuth 2.0**.
- **Interactive Engagement**: 
  - Threaded comment section with self-referential hierarchies.
  - Social likes tracking and automated reading time calculators.
- **Newsletter Distribution Engine**: Newsletter subscription and mailing list collection system.
- **Glassmorphic & Fluid UI**: Fully responsive interfaces crafted with modular CSS layouts, custom typography, and micro-interactions powered by Framer Motion.
- **Local Sandbox Mode**: Offline-first design featuring a SQLite database fallback if cloud database access is unavailable.

---

## 📂 Project Directory Structure

```text
├── client/                     # React Vite Frontend Application
│   ├── public/                 # Static assets (including Logo.png)
│   ├── src/
│   │   ├── components/         # Reusable layouts, buttons, and loaders
│   │   ├── pages/              # View pages (Home, BlogPost, CreatePost, etc.)
│   │   ├── styles/             # Stylesheets (modal.css, styles.css)
│   │   ├── api.js              # Centralized API service client
│   │   └── App.jsx             # React Router routing setup
│   ├── package.json
│   └── vite.config.js
│
└── server/                     # Django REST Framework Backend
    ├── accounts/               # User Authentication & Follower System
    ├── aurora_backend/         # Core Project settings and WSGI configuration
    ├── blog/                   # Posts, Comments, Series, Seasons, and Events App
    ├── newsletter/             # Subscription and Newsletter collection
    ├── manage.py
    └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites
- **Python**: v3.10+
- **Node.js**: v18.0+
- **Database**: PostgreSQL (optional, fallback SQLite provided)

---

### 1. Django Backend Setup

Navigate into the `server` directory and complete the following steps:

1. **Create and Activate a Virtual Environment**:
   ```bash
   python -m venv venv
   # On Windows (Powershell)
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS
   source venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server/` directory:
   ```ini
   SECRET_KEY=your-django-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   # DATABASE: Set to True to use local SQLite (Recommended for offline testing)
   USE_SQLITE=True
   
   # Or configure PostgreSQL connection:
   # DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   
   # CORS settings
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
   
   # Authentication Tokens (Minutes)
   JWT_ACCESS_TOKEN_LIFETIME=60
   JWT_REFRESH_TOKEN_LIFETIME=1440
   
   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

4. **Run Database Migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Start the Backend Dev Server**:
   ```bash
   python manage.py runserver
   ```
   The backend will be running at `http://localhost:8000/`.

---

### 2. Vite React Frontend Setup

Navigate into the `client` directory and complete the following steps:

1. **Install NPM Packages**:
   ```bash
   npm install
   ```

2. **Configure Client Environment Variables**:
   Create a `.env` file in the `client/` directory:
   ```ini
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. **Start the Client Dev Server**:
   ```bash
   npm run dev
   ```
   The client application will boot at `http://localhost:5173/`.

4. **Production Build Compilation**:
   To bundle the application for production deployment:
   ```bash
   npm run build
   ```
   The static outputs will compile directly into the `dist/` directory.

---

## 🔌 Core API Documentation Directory

All API requests are prefixed with `/api`. Major endpoint mappings:

### 🔐 Auth Endpoint Group
- `POST /auth/register/` — Create new user profiles.
- `POST /auth/login/` — Obtain JWT token credentials.
- `POST /auth/login/google/` — Perform OAuth verification.
- `GET/PATCH /auth/profile/` — Fetch/modify user credentials.

### 📝 Blogs & Series Endpoint Group
- `GET/POST /blog/posts/` — Retrieve lists of articles or publish new ones (use parameter `post_type=blog` or `post_type=journal`).
- `GET/PATCH/DELETE /blog/posts/<slug>/` — Read, update, or delete single articles.
- `GET/POST /blog/series/` — Retrieve and create publication Series.
- `GET /blog/seasons/?series=<id>` — Fetch seasons associated with a series ID.
- `GET /blog/events/` — Fetch educational events, meetups, or webinars.
- `GET/POST /blog/comments/` — Retrieve/post comments under posts.

### 📧 Newsletter Endpoint Group
- `POST /newsletter/subscribe/` — Subscribe email addresses to the newsletter registry.

---

## ☁️ Deployment Guidelines

### Backend (Render / Heroku)
- Configure the environment variables on the cloud provider matching the keys in `server/.env`.
- Ensure `DATABASE_URL` points to a live database instance (e.g. Neon or AWS RDS).
- Build command for Render:
  ```bash
  pip install -r requirements.txt && python manage.py migrate
  ```
- Startup command:
  ```bash
  gunicorn aurora_backend.wsgi
  ```

### Frontend (Vercel / Netlify)
- Link the `client` subdirectory directory.
- Configure `VITE_API_BASE_URL` to point to the live backend API server.
- Build command: `npm run build`
- Output directory: `dist`
