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
- `pnpm tsc` — type check (`vue-tsc`)
- `pnpm eslint` — ESLint check and auto-fix
- `pnpm test:unit` — unit tests (`vitest`)
- `pnpm vitest <path>` — run a single test file
- `pnpm test:unit:coverage` — unit tests with coverage
- `pnpm test:e2e` — E2E tests (`cypress`): docs smoke + e2e app
- `pnpm test:e2e:docs` — docs site smoke tests only
- `pnpm test:e2e:app` — e2e app behavior tests only
- `pnpm test:e2e:dev` / `pnpm test:e2e:app:dev` — run Cypress in interactive mode
- `pnpm docs:dev` — docs dev server (`vitepress`); `dts` blocks generate their type definitions in-process from the current sources, so no separate type generation step is needed
- `pnpm docs:build` — build docs (same in-process type generation)

## E2E tests (Cypress)

- `cypress/e2e/docs.cy.ts` — smoke tests against the built VitePress docs site (`vitepress build packages` + `vitepress preview packages`).
- `cypress/e2e/app.cy.ts` — host smoke tests plus the integration scenes whose coverage intentionally lives there (geometry/plot). It runs against the e2e host app in `e2e/app/` (a plain Vite + Vue app, not VitePress). The host reuses the **docs demo components** (`packages/**/demo.vue`) as its test scenes: `demo-host.vue` wraps each demo with `packages/.vitepress/theme/components/cesium-container.vue` in `e2e` mode (no Ion network access, `baseLayer: false`, default input actions kept) and exposes the viewer on `window.__app` (see `e2e/app/src/state.ts`). Assertions use `cy.window().its(...)` / `.should(...)` so Cypress retries until the scene reaches the expected state.
- `packages/**/__tests__/*.cy.ts` — behavior tests for core hooks, colocated with each hook (next to its `demo.vue`). They run against the same host app via `pnpm test:e2e:app`; `cypress.config.ts` `specPattern` picks them up, and `vitest.config.ts` excludes them from unit tests.
- In colocated specs, only use static Cesium utilities (`Cesium.Cartesian3.fromDegrees`, `Cesium.Math.toRadians`, …) — never `instanceof` or identity checks, because the spec bundles its own Cesium copy separate from the app's.
- The viewer is created with the base layer disabled (`baseLayer: false`) so tests are deterministic and offline-friendly.
- Note: `useElementOverlay` has no behavior test — its demo requires Cesium world terrain (network + Ion token).
- Adding a new behavior test: demo routes are auto-discovered — `e2e/app/src/demos.ts` globs `packages/**/demo.vue` (hash routes like `/#/core/<hookName>`, auto-listed in the `app.vue` nav), so a new demo only needs a colocated spec `packages/<pkg>/<hook>/__tests__/index.cy.ts`. Exclude a demo from host wrapping via `HOST_EXCLUDED` in `demos.ts` (e.g. `core/createViewer` mounts its own viewer, so `window.__app.viewer` is not set there). Demos may carry `data-testid` attributes and status text for assertions — they render in docs too, so keep them visually unobtrusive. When a demo needs a new scene-state hook, extend `e2e/app/src/viewer-probe.vue` or the host wrapper.

## Tests

- Vitest; place under co-located `__tests__/`
- Naming: `*.test.ts` (not `*.spec.ts`)
- `index.ts` → `index.test.ts`; otherwise match source basename (`circle.ts` → `circle.test.ts`)

## Verification

After code changes, run and ensure all pass before finishing:

1. `pnpm eslint`
2. `pnpm tsc`
3. `pnpm test:unit` (or `pnpm vitest <path>` for scoped changes)

Do not leave the task with eslint, tsc, or test failures.

## Git hooks (husky)

- **pre-commit**: `pnpm lint-staged` — staged files via `eslint --fix`
- **pre-push**: `pnpm eslint` → `pnpm tsc` → `pnpm test:unit run`
