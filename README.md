# my-stuff

The source for [sean-obrien.net](https://www.sean-obrien.net) — a personal site with a handful of small tools.

- **About** — landing page, with recent board game plays pulled from BoardGameGeek.
- **Bill Calculator** — splits a bill proportionally across a group, with adjustable tax and tip.
- **QR Code Generator** — turns any text or URL into a downloadable QR code.
- **Resume** — professional history.
- **Board Game 10x10** — progress against the 10x10 board game challenge.

## Tech Stack

| Category  | Technology                          |
| --------- | ----------------------------------- |
| Framework | React 19, React Router 8 (SPA mode) |
| Language  | TypeScript                          |
| Build     | Vite                                |
| UI        | MUI, Base UI                        |
| Data      | TanStack Query, fast-xml-parser     |
| Dates     | js-joda                             |
| Tooling   | ESLint, Prettier, Vitest            |

Server-side rendering is off (`ssr: false` in [react-router.config.ts](react-router.config.ts)); the app builds to a
static bundle and is deployed to Netlify, with [public/\_redirects](public/_redirects) handling client-side routing.

## Getting Started

```bash
npm install
```

Copy [.env.example](.env.example) to `.env` and fill in the BoardGameGeek token:

```bash
cp .env.example .env
```

The app starts without it — the request that needs it just fails and the board game pages show an
error instead of plays.

## Commands

```bash
npm run dev        # Dev server with HMR at http://localhost:5173
npm run build      # Production build to /build/client
npm test           # Unit tests
npm run lint       # ESLint
npm run typecheck  # React Router typegen + tsc
```

## Project Structure

```
app/
├── apis/           # Fetch wrapper (use-api) and BoardGameGeek query hooks
├── components/     # Feature components, one folder each
├── helpers/        # Formatting and shared sx
├── hooks/          # Generic reusable hooks
├── routes/         # Route modules — meta + default export only
├── utils/          # Env vars, page meta, shared types
├── root.tsx        # Document shell, app bar, nav, error boundary
└── routes.ts       # Route table
```

Feature components follow a consistent shape: the component itself at the top level, with `configuration/`
(types and pure helpers) and `hooks/` (state) beside it.

## Conventions

Coding standards live in [.claude/skills/coding-standard/SKILL.md](.claude/skills/coding-standard/SKILL.md);
architectural notes are in [.claude/docs/architectural_patterns.md](.claude/docs/architectural_patterns.md).
