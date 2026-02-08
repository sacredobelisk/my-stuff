---
name: coding-standard
description: React and TypeScript coding conventions for this project. Apply these rules whenever writing, editing, or reviewing code.
---

# Coding Standard

## Code Quality Principles

### 1. Readability First

- Code is read more than written
- Clear variable and function names
- Self-documenting code preferred over comments
- Consistent formatting

### 2. KISS (Keep It Simple, Stupid)

- Simplest solution that works
- Avoid over-engineering
- No premature optimization
- Easy to understand > clever code

### 3. DRY (Don't Repeat Yourself)

- Extract common logic into functions
- Create reusable components
- Share utilities across modules
- Avoid copy-paste programming

### 4. YAGNI (You Aren't Gonna Need It)

- Don't build features before they're needed
- Avoid speculative generality
- Add complexity only when required
- Start simple, refactor when needed

## TypeScript/JavaScript Standards

### Variable Naming

```typescript
// ✅ GOOD: Descriptive names
const marketSearchQuery = "election";
const isUserAuthenticated = true;
const totalRevenue = 1000;

// ❌ BAD: Unclear names
const q = "election";
const flag = true;
const x = 1000;
```

### Function Naming

```typescript
// ✅ GOOD: Verb-noun pattern
async function fetchMarketData(marketId: string) {}
function calculateSimilarity(a: number[], b: number[]) {}
function isValidEmail(email: string): boolean {}

// ❌ BAD: Unclear or noun-only
async function market(id: string) {}
function similarity(a, b) {}
function email(e) {}
```

### Immutability Pattern (CRITICAL)

```typescript
// ✅ ALWAYS use spread operator
const updatedUser = {
  ...user,
  name: "New Name",
};

const updatedArray = [...items, newItem];

// ❌ NEVER mutate directly
user.name = "New Name"; // BAD
items.push(newItem); // BAD
```

### Error Handling

```typescript
// ✅ GOOD: Comprehensive error handling
async function fetchData(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw new Error("Failed to fetch data");
  }
}

// ❌ BAD: No error handling
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}
```

### Type Safety

```typescript
// ✅ GOOD: Proper types
interface Market {
  id: string;
  name: string;
  status: "active" | "resolved" | "closed";
  created_at: Date;
}

function getMarket(id: string): Promise<Market> {
  // Implementation
}

// ❌ BAD: Using 'any'
function getMarket(id: any): Promise<any> {
  // Implementation
}
```

## React Best Practices

### Component Structure

```typescript
// ✅ GOOD: Functional component with types
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}

// ❌ BAD: No types, unclear structure
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

### Custom Hooks

```typescript
// ✅ GOOD: Reusable custom hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const debouncedQuery = useDebounce(searchQuery, 500);
```

### State Management

```typescript
// ✅ GOOD: Proper state updates
const [count, setCount] = useState(0);

// Functional update for state based on previous state
setCount((prev) => prev + 1);

// ❌ BAD: Direct state reference
setCount(count + 1); // Can be stale in async scenarios
```

### Conditional Rendering

```typescript
// ✅ GOOD: Clear conditional rendering
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ BAD: Ternary hell
{isLoading ? <Spinner /> : error ? <ErrorMessage error={error} /> : data ? <DataDisplay data={data} /> : null}
```

## Functions & Components

- Use **arrow functions** for components, handlers, callbacks, and utilities — not the `function` keyword

  ```tsx
  // correct
  export const MyComponent = () => { ... };
  const handleClick = () => { ... };
  export const formatCurrency = (value: number) => ...;

  // incorrect
  export function MyComponent() { ... }
  function handleClick() { ... }
  ```

- Destructure props at the parameter level
  ```tsx
  export const Nav = ({ drawerWidth, mobileOpen }: Props) => { ... };
  ```
- Use implicit return for simple components that are just JSX with no logic

## Exports

- **Named exports** for all components, hooks, utilities, and types
- **Default exports only** for route page components
- Export inline at the declaration, not at the bottom of the file

## Types

- Use `interface` for object shapes (props, data models, options)
- Use `type` for unions, intersections, and single-value aliases
- Use `export type` / `import type` for type-only exports and imports (`verbatimModuleSyntax` is enabled)
- Define props types above the component, named `Props` (or a descriptive name if exported)
- Inline the type for trivial one-off props: `({ children }: { children: React.ReactNode })`
- Use `readonly` on class properties where applicable
- Prefer utility types (`Omit`, `Record`, `PropsWithChildren`) over manual rewriting

## Naming

| Thing                            | Convention                  | Example                             |
| -------------------------------- | --------------------------- | ----------------------------------- |
| Files (components, hooks, utils) | kebab-case                  | `bill-calculator.tsx`, `use-api.ts` |
| Components                       | PascalCase                  | `BillCalculatorPage`                |
| Functions & variables            | camelCase                   | `handleDrawerToggle`                |
| Constants                        | UPPER_SNAKE_CASE            | `DEFAULT_TAX_PERCENT`               |
| Types & interfaces               | PascalCase                  | `RequestOptions`                    |
| Hooks                            | camelCase with `use` prefix | `useLocalStorage`                   |

## Formatting

- 2-space indentation
- 120-character print width
- Double quotes for strings
- Semicolons always
- Trailing commas (ES5)
- `const` over `let` — only use `let` when reassignment is truly needed
- alphabetical ordering for object properties and type/interface members where possible

## Imports

- Order imports by source:
  1. React and external libraries
  2. Internal imports via `~/` path alias
  3. Type-only imports with `import type`
- Use the `~/*` path alias for internal imports (maps to `./app/*`)
- No wildcard imports — always import specific names

## Styling

- Use MUI `sx` prop for component styling
- No CSS modules, no styled-components
- Use `app.css` only for minimal global overrides

## Patterns

- Ternary operators and logical `&&` for conditional rendering
- `?.` optional chaining and `??` / `??=` nullish coalescing over manual null checks
- Template literals for string interpolation, never concatenation
- Early returns to reduce nesting
- Custom error classes over generic `Error`
- `useMemo` for expensive calculations, `useCallback` for stable callback references
- Hooks return objects (multiple values) or tuples (value + setter pairs)
- `try/catch` with silent fallback for non-critical parse errors

## Comments

- JSDoc for exported utility functions and hooks
- Inline comments to explain **why**, not what
- No redundant or closing-bracket comments

## Code Smell Detection

Watch for these anti-patterns:

### 1. Long Functions

```typescript
// ❌ BAD: Function > 50 lines
function processMarketData() {
  // 100 lines of code
}

// ✅ GOOD: Split into smaller functions
function processMarketData() {
  const validated = validateData();
  const transformed = transformData(validated);
  return saveData(transformed);
}
```

### 2. Deep Nesting

```typescript
// ❌ BAD: 5+ levels of nesting
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // Do something
        }
      }
    }
  }
}

// ✅ GOOD: Early returns
if (!user) return;
if (!user.isAdmin) return;
if (!market) return;
if (!market.isActive) return;
if (!hasPermission) return;

// Do something
```

### 3. Magic Numbers

```typescript
// ❌ BAD: Unexplained numbers
if (retryCount > 3) {
}
setTimeout(callback, 500);

// ✅ GOOD: Named constants
const MAX_RETRIES = 3;
const DEBOUNCE_DELAY_MS = 500;

if (retryCount > MAX_RETRIES) {
}
setTimeout(callback, DEBOUNCE_DELAY_MS);
```

**Remember**: Code quality is not negotiable. Clear, maintainable code enables rapid development and confident refactoring.
