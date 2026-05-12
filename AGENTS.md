# Agents

## Cursor Cloud specific instructions

### Overview

Resonate is a Next.js 16 (App Router + Turbopack) career management SaaS. It's a monolithic app with no Docker, no Makefile, and no test framework.

### Running the dev server

```bash
npm run dev
```

Starts on http://localhost:3000. Hot-reload works automatically.

### Linting

```bash
npm run lint
# or equivalently: npx eslint .
```

Pre-existing warnings/errors exist in the codebase (unused vars, unescaped entities, etc.) — these are not regressions.

### Building

```bash
npm run build
```

`next.config.ts` has `typescript.ignoreBuildErrors: true`, so the build succeeds even with TS errors.

### Key caveats

- **Clerk middleware runs on every request.** The `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` must be in valid format (`pk_test_<base64-encoded-frontend-api-domain>`). A malformed key causes 500 on all routes.
- **No test framework is configured.** There are no unit/integration tests in this repo.
- **External services:** Clerk (auth), Supabase (DB), Anthropic (AI) are required for full functionality. Stripe and RapidAPI are optional. Without real keys, the landing page renders but authenticated routes return errors.
- **The Chrome extension** lives in `/extension/` and is loaded separately into Chrome (no build step). It communicates with the app at localhost:3000.
- **Database migrations** are in `supabase/migrations/` and are applied via the Supabase dashboard SQL editor, not via CLI.
- **The middleware deprecation warning** ("middleware" file convention is deprecated, use "proxy") is from Next.js 16 and is benign — the middleware still functions.
