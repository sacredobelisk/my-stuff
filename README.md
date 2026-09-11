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

BGG's XML API requires an `Authorization` header on every request, so the token is a real
credential. It is read only by [netlify/functions/bgg.ts](netlify/functions/bgg.ts) and is
deliberately **not** `VITE_`-prefixed — that prefix would inline it into the client bundle.

Because the board game pages go through that function, they need `npx netlify dev` rather than
`npm run dev`, which serves the SPA alone and will 404 on `/api/bgg/*`. Everything else works
under either.

## Commands

```bash
npm run dev        # SPA only, HMR at http://localhost:5173 (no /api/bgg proxy)
npx netlify dev    # SPA + Netlify functions at http://localhost:8888
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
├── utils/          # Page meta and shared types
├── root.tsx        # Document shell, app bar, nav, error boundary
└── routes.ts       # Route table

netlify/
└── functions/      # Server-side code: the BGG proxy that holds the auth token
```

Feature components follow a consistent shape: the component itself at the top level, with `configuration/`
(types and pure helpers) and `hooks/` (state) beside it.

## Conventions

Coding standards live in [.claude/skills/coding-standard/SKILL.md](.claude/skills/coding-standard/SKILL.md);
architectural notes are in [.claude/docs/architectural_patterns.md](.claude/docs/architectural_patterns.md).
