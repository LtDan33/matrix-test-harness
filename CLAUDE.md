# Matrix Test Harness

Trivial Express + TypeScript TODO API. This app exists solely as an integration test vehicle for The Matrix autonomous dev loop.

## Commands

```bash
npm run dev       # Start dev server with watch (tsx)
npm run build     # Compile TypeScript
npm start         # Run without watch
npm test          # Run test suite (vitest)
npx tsc --noEmit  # Build gate (must pass with zero errors)
```

## Architecture

- `src/index.ts` — Express server on port 4444; wires up CORS, JSON middleware, and TodoRouter
- `src/types.ts` — TypeScript interfaces (`Todo`, `Stats`)
- `src/service.ts` — In-memory todo logic (`TodoService` class; no database)
- `src/router.ts` — Express route definitions (`TodoRouter` class); serves UI at `/` and API at `/api/*`
- `src/__tests__/store.test.ts` — Vitest unit tests for service logic

## Rules

- Keep the app trivial. No database, no ORM, no complex architecture.
- `npx tsc --noEmit` must pass with zero errors after every change.
- Some queue tasks are intentionally designed to fail — this is expected behavior for Matrix testing.
