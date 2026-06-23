# Skill Exchange

## Starting the Application

```bash
# Start backend
cd backend
npm install
npm run dev

# Backend runs on:
# http://localhost:5000
```

```bash
# Start frontend
cd frontend/skillexchange
npm install
npm run dev

# Frontend runs on:
# http://localhost:5173
```

Create these local env files from the examples before running:

```bash
cp backend/.env.example backend/.env
cp frontend/skillexchange/.env.example frontend/skillexchange/.env
```

## Deployment

Recommended simple setup:

- Backend: Render Web Service
- Frontend: Vercel static Vite app
- Database: MongoDB Atlas

### 1. Deploy Backend on Render

Create a new Render Web Service from this repository.

Use these settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Add these Render environment variables:

```text
MONGO_URL=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random secret>
CLIENT_ORIGIN=<your deployed frontend URL>
```

After Render deploys, note the backend URL, for example:

```text
https://skill-exchange-api.onrender.com
```

### 2. Deploy Frontend on Vercel

Create a new Vercel project from this repository.

Use these settings:

```text
Root Directory: frontend/skillexchange
Build Command: npm run build
Output Directory: dist
```

Add this Vercel environment variable:

```text
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
```

Redeploy the frontend after adding the variable.

### Upload Storage Note

Videos and notes are stored on the backend server disk under `backend/uploads`.
This is fine for local testing and simple demos, but many free hosting services may remove uploaded files after restarts or redeploys. For production, move uploads to persistent storage such as Cloudinary, S3, or another object storage provider.
