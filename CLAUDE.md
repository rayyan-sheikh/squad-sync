# SquadSync — Claude Context

## Project Overview
SquadSync is a real-time social logistics platform. Users create, discover, and join activities with slot-based coordination, geospatial discovery, and secure booking.

## Monorepo Layout
```
/frontend   → React 19 + Vite + TypeScript + Tailwind v4 + shadcn/ui
/backend    → Node.js + Express + TypeScript + Prisma + PostgreSQL
```

## Current Phase: Phase 1 — Auth & Foundation

### What's built
- Express server with helmet, cors (credentials), cookie-parser, dotenv
- Prisma ORM connected to local PostgreSQL (`squad_sync` database)
- User model: id (cuid), email (unique), passwordHash, createdAt
- JWT config (access + refresh tokens)
- Zod installed for validation
- bcrypt installed for password hashing
- Folder structure: routes → controllers → services → models

### Auth endpoints to implement
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

## Security Rules (always enforce)
- Never store JWT in localStorage — always HTTP-only cookies
- Validate all request inputs with Zod before touching the DB
- Hash passwords with bcrypt (never store plaintext)
- No unsafe HTML rendering on the frontend

## Architecture Rules
- Build backend first, then frontend
- Routes → Controllers → Services pattern (keep controllers thin)
- Each phase must be independently deployable
- Use `asyncHandler` wrapper for all async route handlers

## Tech Decisions
- Access token: short-lived JWT in Authorization header or memory
- Refresh token: long-lived JWT in HTTP-only cookie
- Prisma client singleton in `src/lib/prisma.ts`
- Path alias `@/*` maps to `src/*` in both frontend and backend

## Dev Commands
```bash
# Backend
cd backend && npm run dev       # ts-node-dev on port 5000
cd backend && npx prisma studio # DB GUI

# Frontend
cd frontend && npm run dev      # Vite on port 5173
```

## Planned Phases
- Phase 2: Activity System
- Phase 3: Booking Engine (slot-based, transactions)
- Phase 4: Geospatial Discovery (PostGIS)
- Phase 5: Realtime (Socket.io)
- Phase 6: Chat (activity-scoped rooms)
- Phase 7: Payments (Stripe Connect escrow)
- Phase 8: Notifications (interest + location-based)
