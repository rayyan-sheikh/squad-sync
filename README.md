# SquadSync

SquadSync is a real-time social logistics platform that enables users to create, discover, and join activities with slot-based coordination, geospatial discovery, and secure booking.

## Monorepo Structure

```
/frontend   → React 19 + Vite + TypeScript + Tailwind + shadcn/ui
/backend    → Node.js + Express + TypeScript + Prisma + PostgreSQL
```

## Tech Stack

### Frontend
- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zustand
- Socket.io client

### Backend
- Node.js + Express
- PostgreSQL (PostGIS later)
- Prisma ORM
- Socket.io
- JWT (Access + Refresh tokens)
- Zod validation
- Helmet.js + CORS + cookie-parser
- bcrypt

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env   # fill in your DATABASE_URL and JWT secrets
npm install
npx prisma migrate dev
npm run dev            # starts on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # starts on port 5173
```

## Phase Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Auth & Foundation | In Progress |
| 2 | Activity System | Planned |
| 3 | Booking Engine | Planned |
| 4 | Geospatial Discovery | Planned |
| 5 | Realtime Updates (Socket.io) | Planned |
| 6 | Chat System | Planned |
| 7 | Payments (Stripe Connect) | Planned |
| 8 | Notifications | Planned |

## Security Rules

- JWT stored in HTTP-only cookies only (never localStorage)
- All inputs validated with Zod
- Passwords hashed with bcrypt
- Helmet.js for HTTP security headers
