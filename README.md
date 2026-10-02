# Visual DSA

An interactive platform for learning Data Structures and Algorithms through synchronized theory, animated visualizations, and practice quizzes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, React Router (Data Mode) |
| Main Backend | Node.js, Express 4, Mongoose, JWT |
| Supporting Service | Python 3.12+, FastAPI, SMTP (optional) |
| Database | MongoDB (`Visual_DSA` database) |

## Project Structure

```
Visual DSA/
  frontend/          Vite + React + TypeScript SPA
  node-backend/      Express REST API (auth, progress, analytics)
  python-service/    FastAPI service (OTP email delivery, progress analysis)
```

## Getting Started

### 1. Frontend (port 5173)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 2. Node Backend (port 5000)

```bash
cd node-backend
cp .env.example .env       # configure JWT_SECRET, MONGODB_URI, PYTHON_SERVICE_URL
npm install
npm run dev
```

Requires MongoDB running (see `MONGODB_URI` in `.env`).

### 3. Python Service (port 8000)

```bash
cd python-service
cp .env.example .env       # configure SMTP settings (optional in dev)
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

When `SMTP_HOST` / `SMTP_USER` / `SMTP_PASSWORD` are not set, OTPs are logged to the console instead of being emailed — suitable for local development.

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Log in, returns JWT + user |
| POST | `/logout` | Yes | Stateless logout |
| POST | `/forgot-password` | No | Generate OTP, forward to Python service |
| POST | `/verify-otp` | No | Verify OTP |
| POST | `/reset-password` | No | Set new password (requires prior OTP verification) |

### Protected resources

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/profile` | Yes | Current user profile |
| GET | `/progress` | Yes | All progress records |
| GET | `/progress/:topic` | Yes | Progress for one topic |
| POST | `/progress` | Yes | Upsert progress (additive `timeSpent`) |
| POST | `/activity` | Yes | Record an activity |
| GET | `/activity` | Yes | Recent activities |
| POST | `/practice` | Yes | Submit/accumulate practice result |
| GET | `/practice` | Yes | Practice history |
| GET | `/dashboard` | Yes | Aggregated learning dashboard |

### Python service (`/`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Service health check |
| POST | `/send-otp` | Internal | Send OTP email via SMTP |
| POST | `/analyze-progress` | Internal | Generate detailed learning analytics |

## Dashboard Flow

The frontend `GET /api/dashboard` hits the Node backend, which calls the Python service's `/analyze-progress` endpoint for a rich analysis (per-topic stats, insights, recommended topics). If the Python service is unreachable, the Node backend falls back to its own internal analytics — the dashboard works either way.

## Learning Topics

The platform covers eight core areas, each with a dedicated visualizer:

- **Array** — create, traverse, insert, delete, update, linear search
- **Linked List** — insert at begin/end/position, delete, search, traverse
- **Stack** — push, pop, peek with grow-upward animation
- **Queue** — enqueue, dequeue, front/rear peek
- **Circular Queue** — ring-buffer visualization with wrap-around
- **Searching** — linear search and binary search
- **Sorting** — bubble, selection, insertion, merge, quick sort
- **Basics** — foundational DSA concepts

## Running All Three Services

```bash
# Terminal 1 — Frontend
cd frontend && npm run dev

# Terminal 2 — Node Backend
cd node-backend && npm run dev

# Terminal 3 — Python Service
cd python-service && .venv\Scripts\activate && uvicorn app.main:app --reload --port 8000
```
