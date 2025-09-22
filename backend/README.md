# Smart Mixologist Backend (FastAPI)

## Local run
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API root: `http://localhost:8000` (docs at `/docs`)

## Deploy (Render/Heroku/Railway)
- Use `Procfile` and `runtime.txt`.
- Set build command to `pip install -r requirements.txt`.
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
