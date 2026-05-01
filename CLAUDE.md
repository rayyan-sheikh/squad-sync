# SquadSync — Claude Context

## Project Overview
SquadSync is a real-time social logistics platform. Users create, discover, and join activities with slot-based coordination, geospatial discovery, and secure booking.

## Monorepo Layout
```
/frontend   → React 19 + Vite + TypeScript + Tailwind v4 + shadcn/ui
/backend    → Node.js + Express + TypeScript + Prisma + PostgreSQL
```

## Current Phase: Phase 1 — Auth & Foundation ✅ COMPLETE

### Branch: feat/auth

### What's built

**Backend**
- Express server with helmet, cors (credentials: true, origin: CLIENT_URL), cookie-parser, dotenv
- Prisma ORM → local PostgreSQL `squad_sync` DB, migration applied
- User model: id (cuid), email (unique), passwordHash, createdAt
- Zod validation schemas: registerSchema, loginSchema (`src/schemas/auth.schema.ts`)
- Auth service: register, login, getMe, refresh (`src/services/auth.service.ts`)
- Auth controller + routes — all endpoints complete:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/refresh
  - POST /api/auth/logout
  - GET  /api/auth/me  (protected — requires Bearer token)
- `authenticate` middleware: verifies Bearer access token, attaches `req.user`

**Frontend**
- React Router v6: /login, /register, /dashboard
- Zustand auth store (`src/store/authStore.ts`):
  - Actions: register, login, logout, initialize, setAccessToken, clearAuth
  - `initialize()` called on app mount — tries refresh cookie → fetches /me → rehydrates session
  - `isInitializing` flag blocks render until session check completes (shows spinner)
- Axios client (`src/api/auth.api.ts`):
  - `withCredentials: true`, baseURL from VITE_API_URL
  - Request interceptor: attaches Bearer token via module-level getter (no circular imports)
  - Response interceptor: on 401, silently refreshes token and retries original request once; redirects to /login if refresh fails
- Pages: LoginPage, RegisterPage, DashboardPage — split layout (branding left, form right on lg+)
- ProtectedRoute: redirects unauthenticated users to /login
- VITE_API_URL=http://localhost:5000/api in frontend/.env.local
- Framer Motion: staggered fadeUp, AnimatePresence error messages, whileTap buttons
- Logo: "Squad" in foreground, "SYNC" in primary green (`src/components/Logo.tsx`)

### Auth flow
- Register/Login → bcrypt hash/compare → sign access + refresh JWT → access token in body, refresh in HTTP-only cookie
- On app load → `initialize()` → POST /refresh → GET /me → store user + token in Zustand
- 401 on any request → interceptor refreshes silently → retries → redirects to login if refresh fails
- Logout → clears cookie + clears Zustand state

## Security Rules (always enforce)
- Never store JWT in localStorage — refresh token in HTTP-only cookie only
- Access token in Zustand memory only (lost on hard refresh, recovered via initialize())
- Validate all inputs with Zod before touching the DB
- Hash passwords with bcrypt (never store plaintext)
- No unsafe HTML rendering on the frontend

## Architecture Rules
- Build backend first, then frontend
- Routes → Controllers → Services pattern (keep controllers thin)
- Each phase must be independently deployable
- Use `asyncHandler` wrapper for all async route handlers

## Tech Decisions
- Access token: short-lived JWT in Zustand memory, sent as Bearer header
- Refresh token: long-lived JWT in HTTP-only cookie (sameSite: lax, secure in production)
- Prisma client singleton in `src/lib/prisma.ts`, generated client at `src/generated/prisma/client`
- Path alias `@/*` → `src/*` in both frontend and backend
- Theme: dark-first oklch tokens in `:root`; `.light` class ready for future toggle
- Font: Mona Sans Variable (`@fontsource-variable/mona-sans`)
- Animations: Framer Motion — staggered fadeUp, AnimatePresence, whileTap
- Background effects: `.dot-grid`, `.bg-page`, `.glass-panel`, `.glass-card`, `.input-auth`, `.btn-glow` — all in `index.css @layer utilities`

## Key File Locations
```
backend/src/
  schemas/auth.schema.ts
  services/auth.service.ts
  controllers/auth.controller.ts
  routes/auth.routes.ts
  middlewares/authenticate.ts
  lib/prisma.ts
  config/jwt.ts

frontend/src/
  api/auth.api.ts           # axios instance + interceptors + setAccessTokenGetter
  store/authStore.ts        # Zustand store + interceptor wiring
  pages/{Login,Register,Dashboard}Page.tsx
  components/ProtectedRoute.tsx
  components/Logo.tsx
```

## Dev Commands
```bash
# Backend
cd backend && npm run dev
cd backend && npx prisma studio
cd backend && npx prisma migrate dev --name <name>

# Frontend
cd frontend && npm run dev
```

## Planned Phases
- Phase 2: Activity System
- Phase 3: Booking Engine (slot-based, transactions)
- Phase 4: Geospatial Discovery (PostGIS)
- Phase 5: Realtime (Socket.io)
- Phase 6: Chat (activity-scoped rooms)
- Phase 7: Payments (Stripe Connect escrow)
- Phase 8: Notifications (interest + location-based)
