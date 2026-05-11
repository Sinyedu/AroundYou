# AroundYou

## Local development

The frontend reads its backend URL from `VITE_API_BASE_URL`.

Create `frontend/around-you/.env.development` if you need to override the default:

```sh
VITE_API_BASE_URL=
```

The backend reads CORS settings from `FRONTEND_ORIGIN` or `CORS_ORIGINS`.

Create `backend/.env.development` if you need to override the default:

```sh
PORT=
API_BASE_URL=
FRONTEND_ORIGIN=
CORS_ORIGINS=
```

Start everything from `frontend/around-you`:

```sh
npm run dev:all
```

Or start each app separately:

```sh
# frontend
cd frontend/around-you
npm run dev

# backend
cd backend
npm run start-dev
```

## Render deployment

Set this environment variable on the frontend service:

```sh
VITE_API_BASE_URL=<backend-api-url>/api
```

Set these environment variables on the backend service:

```sh
API_BASE_URL=<backend-api-url>/api
FRONTEND_ORIGIN=<frontend-url>
CORS_ORIGINS=<frontend-url>,http://localhost:5173,http://127.0.0.1:5173
```
