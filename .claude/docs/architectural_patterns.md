# Architectural Patterns

This document describes the design patterns and conventions used throughout the codebase.

## Custom Hooks Pattern

State management logic is extracted into dedicated hooks, keeping components focused on rendering.

**Pattern:** One hook per concern, returning state and handlers as an object.

**Examples:**

- [useLocalStorage](../../app/hooks/useLocalStorage.ts) - Generic localStorage persistence with SSR safety
- [useBillCalculator](../../app/components/bill-calculator/hooks/use-bill-calculator.tsx) - Bill calculation logic
- [useBillCalculatorPeople](../../app/components/bill-calculator/hooks/use-bill-calculator-people.tsx) - People list management

**Convention:**

```typescript
export function useFeatureName(props: Props) {
  // State declarations
  // Derived calculations
  // Handlers
  return {
    /* state and handlers as object */
  };
}
```

Key characteristics:

- Hooks return objects (not tuples) for named destructuring
- Handler functions use `useCallback` when passed to child components
- SSR safety checks: `typeof window !== "undefined"` before browser APIs

## Feature-Based Organization

Components are organized by feature, not by type. Each feature folder is self-contained.

**Structure:**

```
app/components/[feature]/
├── [feature].tsx           # Main component
├── configuration/
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Pure utility functions, constants
└── hooks/
    └── use-[feature].tsx   # Feature-specific hooks
```

**Reference:** [bill-calculator/](../../app/components/bill-calculator/)

## Configuration Folder Pattern

Each feature with complex state has a `configuration/` folder separating types and utilities from components.

**types.ts** - Data interfaces only:

- [bill-calculator/configuration/types.ts](../../app/components/bill-calculator/configuration/types.ts)

**utils.ts** - Pure functions and constants:

- [bill-calculator/configuration/utils.ts](../../app/components/bill-calculator/configuration/utils.ts)
- Factory functions for default data (e.g., `createDefaultBillData`)
- Constants (e.g., `DEFAULT_TAX_PERCENT`)

## Render Props with Base UI

Base UI components use render props to integrate with MUI styling.

**Pattern:** Pass `render` prop with a function receiving `(props, state)`:

```typescript
<BaseNumberField.Root
  render={(props, state) => (
    <FormControl ref={props.ref} disabled={state.disabled}>
      {props.children}
    </FormControl>
  )}
>
```

**Reference:** [number-field.tsx:33-46](../../app/components/number-field/number-field.tsx#L33-L46)

## Theme Provider Pattern

Global theming wraps the app via a provider component.

**Implementation:** [custom-theme.tsx](../../app/components/providers/custom-theme.tsx)

**Usage in root:** [root.tsx:75-76](../../app/root.tsx#L75-L76)

```typescript
<CustomThemeProvider>
  <LayoutContent>{children}</LayoutContent>
</CustomThemeProvider>
```

## File-Based Routing

Routes are defined declaratively in a central configuration file.

**Route definition:** [routes.ts](../../app/routes.ts)

```typescript
export default [
  index("routes/home.tsx"),
  route("/bill-calculator", "routes/bill-calculator.tsx"),
] satisfies RouteConfig;
```

**Route components** export:

- `meta` function for page title/description
- Default export for the page component

**Reference:** [bill-calculator.tsx](../../app/routes/bill-calculator.tsx)

## SSR Considerations

App runs as SPA (SSR disabled in [react-router.config.ts](../../react-router.config.ts)).

However, hooks still check for `window` availability for hydration compatibility:

```typescript
if (typeof window === "undefined") {
  return initialValue;
}
```

**Reference:** [useLocalStorage.ts:15-17](../../app/hooks/useLocalStorage.ts#L15-L17)

## Proportional Props Pattern

Components receive narrow, focused props rather than entire data objects.

**Example:** Nav receives only what it needs:

```typescript
type Props = {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerClose: () => void;
};
```

**Reference:** [nav.tsx:12-16](../../app/components/nav/nav.tsx#L12-L16)

## Key Generation

Unique keys for list items use `crypto.randomUUID()` with fallback:

```typescript
export const generateKey = (() => {
  let counter = 0;
  return () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `person-${Date.now()}-${counter++}`;
  };
})();
```

**Reference:** [utils.ts:13-22](../../app/components/bill-calculator/configuration/utils.ts#L13-L22)
