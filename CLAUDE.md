# my-stuff

Personal web application with utility tools, built as a React SPA.

## Project Purpose

A personal site combining:

- **Web App** - React SPA with navigation and responsive layout
- **Bill Calculator** - Split bills proportionally with tax/tip calculations

Live at: `sean-obrien.net`

## Tech Stack

| Category   | Technology                   |
| ---------- | ---------------------------- |
| Framework  | React 19, React Router 7     |
| Language   | TypeScript (strict mode)     |
| Build      | Vite 7                       |
| UI Library | MUI (Material UI) 7, Base UI |
| Styling    | CSS, Sass                    |
| Linting    | ESLint 9, Prettier           |

## Project Structure

```
app/
├── apis/                 # api files
├── components/          # Feature-based component folders
│   ├── bill-calculator/ # Bill splitting feature
│   │   ├── configuration/  # Types and utilities
│   │   └── hooks/          # Feature-specific hooks
│   ├── nav/             # Navigation drawer
│   ├── number-field/    # Reusable number input
│   └── providers/       # Theme and context providers
├── helpers/             # Shared helpers
├── hooks/               # Shared custom hooks
├── routes/              # Page components (file-based routing)
├── utils/               # Shared utilities
├── root.tsx             # App shell with layout
└── routes.ts            # Route definitions
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

| File                                             | Purpose                                     |
| ------------------------------------------------ | ------------------------------------------- |
| [root.tsx](app/root.tsx)                         | App shell, layout structure, error boundary |
| [routes.ts](app/routes.ts)                       | Route configuration                         |
| [react-router.config.ts](react-router.config.ts) | SSR disabled (SPA mode)                     |
| [vite.config.ts](vite.config.ts)                 | Build configuration                         |
| [tsconfig.json](tsconfig.json)                   | TypeScript config with `~/` path alias      |

## Path Aliases

Use `~/` to import from the `app/` directory:

```typescript
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { formatCurrency } from "~/helpers/number";
import { PROCESS_ENVS } from "~/utils/env-vars";
```

## Adding New Routes

1. Create page component in [app/routes/](app/routes/)
2. Add route to [app/routes.ts](app/routes.ts):
   ```typescript
   route("/my-route", "routes/my-route.tsx");
   ```
3. Add nav item in [app/components/nav/nav.tsx:18-21](app/components/nav/nav.tsx#L18-L21)

## Adding New Features

Follow the bill-calculator pattern:

1. Create feature folder under `app/components/`
2. Add `configuration/` subfolder with `types.ts` and `utils.ts`
3. Add `hooks/` subfolder for feature-specific state management
4. Main component imports and composes hooks

## Additional Documentation

When working on related topics, check these files:

| Topic                                    | File                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| Design patterns, algorithms, conventions | [.claude/docs/architectural_patterns.md](.claude/docs/architectural_patterns.md) |
