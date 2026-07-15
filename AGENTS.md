# AGENTS

Vesium is a Vue Composition API library for Cesium.

Communicate in the same language as the developer's questions.
Write code comments in English.

## Packages

- `vesium` (`packages/core`): Core Vue composition hooks for Cesium lifecycle and scene objects.
- `@vesium/shared` (`packages/shared`): Shared utilities and type definitions.
- `@vesium/geometry` (`packages/geometry`): Geometry calculation algorithms for Cesium.
- `@vesium/plot` (`packages/plot`): Plotting and measurement tools.
- `@vesium/parser` (`packages/parser`): JSON serialization/deserialization for Cesium objects.
- `@vesium/special` (`packages/special`): Special effects and rendering for Cesium.

## Commands

Package manager: `pnpm`

- `pnpm install` — install dependencies
- `pnpm build:ci` — build all packages (`tsdown`)
- `pnpm type-check` — type check (`vue-tsc`)
- `pnpm lint` — lint and auto-fix (`eslint`)
- `pnpm test:unit` — unit tests (`vitest`)
- `pnpm vitest <path>` — run a single test file
- `pnpm test:unit:coverage` — unit tests with coverage
- `pnpm test:e2e` — E2E tests (`cypress`)
- `pnpm docs:dev` — docs dev server (`vitepress`)
- `pnpm docs:build` — build docs

## Tests

- Vitest; place under co-located `__tests__/`
- Naming: `*.test.ts` (not `*.spec.ts`)
- `index.ts` → `index.test.ts`; otherwise match source basename (`circle.ts` → `circle.test.ts`)
