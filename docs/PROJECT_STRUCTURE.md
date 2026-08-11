# Frontend Structure

- `src/config`: Vite/runtime configuration wrappers.
- `src/lib`: shared clients and generic helpers.
- `src/services`: API-specific functions.
- `src/hooks`: reusable UI/data hooks. React Query hooks live in `hooks/queries`.
- `src/components`: reusable UI and feature components.
- `src/pages`: route-level screens.
- `src/routes`: router composition.
- `src/store`: client-side state containers.
- `src/types`: shared TypeScript types.
- `src/schemas`: form/client validation schemas.

## Guardrails

- Do not read `import.meta.env` directly outside `config` modules unless the value is intentionally component-local.
- Keep secrets in ignored `.env` files. Commit only `.env.example`.
- Keep route-level data orchestration in pages or hooks, not low-level presentational components.
- Prefer `services` for API calls and `hooks/queries` for React Query wrappers.
- Prefer adding types at API boundaries instead of passing `any` through new code.
