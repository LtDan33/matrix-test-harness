# TaskFlow

Lightweight, self-hosted task management REST API. Express + TypeScript, zero-config startup.

## Commands

```bash
npm run dev       # Start dev server with watch (tsx)
npm run build     # Compile TypeScript
npm start         # Run without watch
npm test          # Run test suite (vitest)
npx tsc --noEmit  # Build gate (must pass with zero errors)
```

## Architecture

- `src/index.ts` — Express app on port 4444, mounts middleware and router
- `src/types.ts` — TypeScript interfaces (Todo, Stats)
- `src/service.ts` — TodoService class (CRUD logic, in-memory store)
- `src/router.ts` — TodoRouter class (route handlers, validation, HTTP responses)
- `src/__tests__/store.test.ts` — Unit tests (vitest)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/todos | List todos (filter: `?completed=true/false`) |
| GET | /api/todos/:id | Get single todo |
| GET | /api/todos/completed | List completed |
| GET | /api/todos/pending | List pending |
| GET | /api/stats | Counts (total, completed, pending) |
| POST | /api/todos | Create todo |
| POST | /api/todos/bulk | Batch create |
| PATCH | /api/todos/:id | Update todo |
| DELETE | /api/todos/:id | Delete todo |
| DELETE | /api/todos/completed | Clear completed |

## Rules

- `npx tsc --noEmit` must pass with zero errors after every change.
- No `any` types. No `@ts-ignore`.
- Keep dependencies minimal — don't add heavy libraries for simple tasks.
