# FuturePath AI — Deployment & Operations Guide

## 1. Deployment Topology
FuturePath AI is designed for containerized or platform-as-a-service deployment:

```
[ Internet ]
      |
      v (Port 443 / SSL)
[ Reverse Proxy / Cloudflare / Nginx ]
      |
      +---> [ Frontend Service: Next.js Node SSR / Standalone ] (Port 3000)
      |
      +---> [ Backend API: FastAPI + Uvicorn ] (Port 8000)
                  |
                  +---> [ Database: Managed PostgreSQL 15+ ]
                  +---> [ Storage: S3 / Azure Blob / Persistent Volume ]
```

## 2. Environment Configuration
See `.env.example` for all required configuration keys.

### Core Variables
- `DATABASE_URL`: `sqlite:///./futurepath.db` (for zero-setup dev) or `postgresql+asyncpg://user:password@host:5432/futurepath` (production)
- `SECRET_KEY`: High-entropy 32+ byte string for JWT generation
- `ALGORITHM`: `HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
- `NEXT_PUBLIC_API_URL`: URL to the FastAPI backend (e.g., `http://localhost:8000/api/v1`)

## 3. Local Development Quickstart

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m app.db.init_db
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to access the application.
Visit `http://localhost:8000/docs` to view the interactive OpenAPI Swagger documentation.
