# Matrix Test Harness

Trivial Express + TypeScript TODO API. This app exists solely as an integration test vehicle for The Matrix autonomous dev loop.

## Commands

```bash
npm run dev       # Start dev server with watch (tsx)
npm run build     # Compile TypeScript
npm start         # Run without watch
npx tsc --noEmit  # Build gate (must pass with zero errors)
```

## Architecture

- `src/index.ts` — Express server on port 4444
- `src/types.ts` — TypeScript interfaces
- `src/store.ts` — In-memory todo array (no database)

## Rules

- Keep the app trivial. No database, no ORM, no complex architecture.
- `npx tsc --noEmit` must pass with zero errors after every change.
- Some queue tasks are intentionally designed to fail — this is expected behavior for Matrix testing.
