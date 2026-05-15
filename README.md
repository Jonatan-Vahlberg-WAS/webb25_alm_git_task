# Express + Mongoose Product API!

Simple REST API project for teaching Git workflows, plus an optional **React + Vite** client in `frontend/`.

## Tech

- **API:** Node.js, Express, Mongoose, Vitest
- **Frontend:** React, Vite (see `frontend/package.json`)

## Setup

### API (repository root)

```bash
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Environment variables

### API (root `.env`, optional)

Create a `.env` file in the **repository root** if you need to override defaults. `src/server.js` loads it with `dotenv`.

| Variable       | Purpose                         | Default if unset                         |
| -------------- | ------------------------------- | ---------------------------------------- |
| `PORT`         | HTTP port for the Express API   | `3000`                                   |
| `MONGODB_URI`  | MongoDB connection string       | `mongodb://127.0.0.1:27017/product_api` |

Example:

```bash
# .env (root)
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/product_api
```

### Frontend (`frontend/.env`)

Vite only exposes variables whose names start with `VITE_`. The client reads the API base URL from **`VITE_API_BASE_URL`** (no trailing slash).

1. Copy the example file:

   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Edit `frontend/.env` if your API is not on the default host/port, for example:

   ```bash
   # frontend/.env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Restart** `npm run dev` in `frontend/` after any change to `.env` — Vite reads env at startup.

Do **not** commit real `frontend/.env` files (they are gitignored). Commit `frontend/.env.example` only.

## Run in dev mode

Start **MongoDB**, then the API and (optionally) the frontend in separate terminals.

**API** (from repository root):

```bash
npm run dev
```

**Frontend** (from `frontend/`):

```bash
cd frontend
npm run dev
```

By default the API listens on **port 3000** and Vite serves the app on **port 5173** (see terminal output for the exact URL). The API enables CORS so the browser client can call it from another origin during development.

## Run tests

API tests (from repository root):

```bash
npm test
```

Frontend (from `frontend/`):

```bash
npm run lint
npm run build
```

## Project structure

```text
src/
  models/
    Product.js
  routes/
    productRoutes.js
  controllers/
    productController.js
  utils/
    fullTextSearch.js
  app.js
  server.js

tests/
  product.test.js

frontend/
  .env.example          # template for VITE_API_BASE_URL (copy to .env)
  src/
    api/                # fetch helpers for the API
    App.jsx
    ...
```

## Notes for students

This project intentionally contains a few small issues to practice identifying and fixing problems in Git branches.

- See `ISSUES.md` for the original practice backlog (issues 1–14 were tracked there for GitHub import).
- See `issues-2026-5-11.md` for follow-up work (categories in the frontend, auth, user tests) and dependency notes.

## Create GitHub issues from scripts

After pushing this repo and logging in with [GitHub CLI](https://cli.github.com/) (`gh auth login`):

**Issues from `ISSUES.md` (numbered 1–14 in the script):**

```bash
./scripts/create-github-issues.sh
```

Resume from a specific issue number:

```bash
./scripts/create-github-issues.sh --start-from 6
```

**Issues from `issues-2026-5-11.md`:**

```bash
node scripts/create-github-issues-2026-5-11.mjs --dry-run   # preview titles
node scripts/create-github-issues-2026-5-11.mjs           # create on GitHub
```
