# my-stuff

Personal web application with utility tools, built as a React SPA.

## Project Purpose

A personal site combining:

- **About** - Landing page with bio and a BoardGameGeek "last plays" widget
- **Bill Calculator** - Split bills proportionally with tax/tip calculations
- **QR Code Generator** - Generate a downloadable QR code from text or a URL
- **Resume** - Static resume page
- **Board Game 10x10** - BoardGameGeek-powered yearly play-count challenge tracker

Live at: `sean-obrien.net`

## Tech Stack

| Category   | Technology                              |
| ---------- | --------------------------------------- |
| Framework  | React 19, React Router 8                |
| Language   | TypeScript (strict mode)                |
| Build      | Vite 8                                  |
| UI Library | MUI (Material UI) 9, Base UI 1          |
| Data       | TanStack Query 5 (server state/caching) |
| Styling    | CSS, Sass                               |
| Linting    | ESLint 9 (flat config), Prettier        |

## Project Structure

```
app/
├── apis/                    # API clients and hooks
│   ├── bgg/                 # BoardGameGeek API (collection, plays)
│   ├── hooks/use-api/       # Generic fetch wrapper (get/post/put/patch/delete)
│   └── utils/               # Shared API types and helpers
├── components/               # Feature-based component folders
│   ├── about/                # About/landing page
│   ├── bgg/                  # BoardGameGeek-powered widgets (10x10, last-plays, highest-rated)
│   ├── bill-calculator/      # Bill splitting feature
│   │   ├── configuration/    # Types and utilities
│   │   └── hooks/            # Feature-specific hooks
│   ├── nav/                  # Navigation drawer
│   ├── number-field/         # Reusable number input
│   ├── providers/            # Theme and TanStack Query providers
│   ├── qr-code-generator/    # QR code generator feature
│   │   ├── configuration/    # Types and utilities
│   │   └── hooks/            # Feature-specific hooks
│   └── resume/                # Resume page and subcomponents
├── helpers/                  # Shared helpers (dates, numbers, strings)
├── hooks/                     # Shared custom hooks
├── routes/                    # Page components (file-based routing)
├── utils/                     # Shared utilities (env vars, shared types)
├── root.tsx                   # App shell with layout
└── routes.ts                  # Route definitions
```

## Essential Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm start         # Serve production build
npm run lint      # Run ESLint
npm run typecheck # Type check with tsc
```

## Key Files

| File                                                                  | Purpose                                     |
| --------------------------------------------------------------------- | ------------------------------------------- |
| [root.tsx](../app/root.tsx)                                           | App shell, layout structure, error boundary |
| [routes.ts](../app/routes.ts)                                         | Route configuration                         |
| [react-router.config.ts](../react-router.config.ts)                   | SSR disabled (SPA mode)                     |
| [vite.config.ts](../vite.config.ts)                                   | Build configuration                         |
| [tsconfig.json](../tsconfig.json)                                     | TypeScript config with `~/` path alias      |
| [apis/hooks/use-api/use-api.ts](../app/apis/hooks/use-api/use-api.ts) | Generic fetch wrapper used by all API hooks |

## Path Aliases

Use `~/` to import from the `app/` directory:

```typescript
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { formatCurrency } from "~/helpers/numbers";
import { PROCESS_ENVS } from "~/utils/env-vars";
```

## Environment Variables

Env vars are validated at startup via [utils/env-vars.ts](../app/utils/env-vars.ts), which throws if a required `VITE_`-prefixed variable is missing.

| Variable              | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `VITE_BGA_AUTH_TOKEN` | BoardGameGeek API auth token, used by the About and Board Game 10x10 pages |

## Adding New Routes

1. Create page component in [app/routes/](../app/routes/)
2. Add route to [app/routes.ts](../app/routes.ts):
   ```typescript
   route("/my-route", "routes/my-route.tsx");
   ```
3. Add nav item in [app/components/nav/nav.tsx](../app/components/nav/nav.tsx)

## Adding New Features

Follow the bill-calculator/qr-code-generator pattern:

1. Create feature folder under `app/components/`
2. Add `configuration/` subfolder with `types.ts` and `utils.ts`
3. Add `hooks/` subfolder for feature-specific state management
4. Main component imports and composes hooks

## Additional Documentation

When working on related topics, check these files:

| Topic                                    | File                                                               |
| ---------------------------------------- | ------------------------------------------------------------------ |
| Design patterns, algorithms, conventions | [docs/architectural_patterns.md](docs/architectural_patterns.md)   |
| React/TypeScript coding conventions      | [skills/coding-standard/SKILL.md](skills/coding-standard/SKILL.md) |
