# DERYK

A modern AI-powered mission control interface built with React + Vite, backed by a FastAPI service.

## Tech Stack

- **React 19** — UI framework
- **React Router 7** — Client-side routing
- **FastAPI** — Auth (JWT) + chat history API, backed by Postgres (SQLAlchemy)
- **Vite 8** — Build tool & dev server
- **Tailwind CSS 4** — Utility-first CSS
- **Lucide React** — Icon library

## Getting Started

### Backend (FastAPI)

1. Create a virtual environment and install dependencies:

   ```bash
   cd backend
   python -m venv .venv
   .venv/Scripts/activate   # .venv/bin/activate on macOS/Linux
   pip install -r requirements.txt
   ```

2. Copy `.env.example` to `.env` and fill in:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — a Postgres connection string (`postgresql+psycopg2://user:password@host:5432/dbname`). Any Postgres works, including a free Supabase project's database.
   - `JWT_SECRET` — a long random string (e.g. `python -c "import secrets; print(secrets.token_urlsafe(48))"`).
   - `FIREBASE_PROJECT_ID` — your Firebase project's ID (see Firebase setup below). Used only to verify Google sign-in tokens; no service account key needed.

3. Start the API (tables are created automatically on first run):

   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   - `VITE_API_URL` — the FastAPI server's URL (defaults to `http://localhost:8000`).
   - `VITE_FIREBASE_*` — your Firebase web app config (see below).

3. Start the dev server:

   ```bash
   npm run dev
   ```

## Firebase setup (Google sign-in)

Firebase only handles the Google OAuth popup on the frontend — the backend verifies the resulting token and issues its own session JWT, so Google and email/password users end up in the same `app_users` table.

1. Go to the [Firebase console](https://console.firebase.google.com), create a project (or reuse one).
2. **Authentication → Sign-in method** → enable **Google**.
3. **Project settings → General → Your apps** → add a **Web app** (no Firebase Hosting needed) → copy the config values it gives you:
   - `apiKey` → `VITE_FIREBASE_API_KEY`
   - `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `VITE_FIREBASE_PROJECT_ID` (also goes in the backend's `.env` as `FIREBASE_PROJECT_ID`)
   - `appId` → `VITE_FIREBASE_APP_ID`
4. **Authentication → Settings → Authorized domains** — make sure `localhost` is listed (it is by default) so sign-in works in dev.

These values are all safe to expose client-side — Firebase web config is public by design, unlike API secrets or DB passwords.

## API

- `POST /auth/signup` — `{ email, password, display_name }` → `{ access_token, user }`
- `POST /auth/login` — `{ email, password }` → `{ access_token, user }`
- `POST /auth/google` — `{ id_token }` (a Firebase ID token) → `{ access_token, user }`. Creates the user on first sign-in, or links an existing email/password account by matching email.
- `GET /auth/me` — current user (requires `Authorization: Bearer <token>`)
- `GET /chats` — list the current user's chat history, newest first
- `POST /chats` — `{ title }` → create a chat entry for the current user

The frontend stores the JWT in `localStorage` and attaches it as a Bearer token on every request.

## Routes

- `/login` — sign in
- `/signup` — create an account
- `/` — mission control (protected, redirects to `/login` if signed out)

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI app: auth + chat endpoints
│   ├── database.py          # SQLAlchemy engine/session
│   ├── models.py            # User, Chat tables
│   ├── schemas.py           # Pydantic request/response models
│   ├── security.py          # Password hashing + JWT
│   ├── firebase_auth.py     # Verifies Firebase ID tokens (Google sign-in)
│   └── requirements.txt
├── public/
│   ├── favicon.jpeg        # App favicon
│   ├── logo.png            # Main header logo (DERYK wordmark)
│   └── sidebar-logo.png    # Sidebar logo icon
├── src/
│   ├── components/
│   │   ├── AuthLayout.jsx      # Shared card layout for login/signup
│   │   ├── GoogleButton.jsx    # Styled "Continue with Google" button
│   │   └── ProtectedRoute.jsx  # Redirects to /login when signed out
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state (JWT) + signIn/signUp/signInWithGoogle/signOut
│   ├── lib/
│   │   ├── api.js              # Fetch client for the FastAPI backend
│   │   └── firebase.js         # Firebase app + Google auth provider (client-side only)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── MissionControl.jsx  # Main app screen — chat history from GET /chats
│   ├── App.jsx             # Route table
│   ├── index.css           # Global styles & Tailwind config
│   └── main.jsx             # React entry point (Router + AuthProvider)
├── .env.example             # Frontend env var template
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```
