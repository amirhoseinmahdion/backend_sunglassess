# Repository Guidelines

## Project Structure & Module Organization

This is an Express 5 and TypeScript backend. Application code lives in `src/`:

- `controllers/` handles request validation and responses.
- `routes/` defines endpoints and middleware order.
- `middlewares/` contains authentication, authorization, and error handling.
- `schemas/` contains Zod request schemas.
- `config/` owns environment, Prisma, and Swagger configuration.
- `utils/` contains shared errors and JWT helpers; `types/` contains Express type augmentation.

The database model is in `prisma/schema.prisma`. Prisma generates `generated/prisma/`; never edit it manually. Compiled JavaScript goes to `dist/`. There is currently no test or assets directory.

## Build, Test, and Development Commands

- `npm install` installs locked dependencies.
- `npm run dev` starts the API with `tsx` watch mode.
- `npm start` runs the TypeScript server without watch mode.
- `npm run build` type-checks and compiles into `dist/`.
- `npm run prisma:generate` regenerates the Prisma client after schema changes.
- `npm run prisma:push` synchronizes the schema to the configured PostgreSQL database.
- `npm run prisma:studio` opens Prisma Studio for local data inspection.

No test command is configured. Run `npm run build` and exercise affected endpoints through Swagger at `/api/docs` before submitting changes.

## Coding Style & Naming Conventions

Use strict TypeScript, two-space indentation, double quotes, semicolons, and trailing commas for multiline constructs. Keep ESM imports explicit with `.js` suffixes, even when importing TypeScript modules. Use `camelCase` for variables/functions, `PascalCase` for types, and descriptive suffixes such as `*.controller.ts`, `*.routes.ts`, `*.middleware.ts`, and `*.schema.ts`. Validate external input with Zod and forward operational errors through `next(error)` using `AppError`.

## Testing Guidelines

When adding tests, introduce a documented `npm test` script and place files under `src/**/__tests__/` or a top-level `tests/` directory. Name tests `*.test.ts`. Cover success cases, validation failures, authentication (`401`), authorization (`403`), and database conflicts.

## Commit & Pull Request Guidelines

Git history is unavailable in this checkout, so no repository-specific convention can be inferred. Use short, imperative commits, preferably Conventional Commits, for example `feat(auth): add optional phone number`. Pull requests should explain behavior changes, identify schema or environment changes, link relevant issues, and include verification steps. Update Swagger definitions whenever an API contract changes.

## Security & Configuration

Keep `.env` untracked. Required settings include `DATABASE_URL` and a `JWT_SECRET` of at least 32 characters; optional defaults are defined in `src/config/env.ts`. Never log passwords, tokens, or connection strings. Apply authentication middleware before role-based authorization middleware.
