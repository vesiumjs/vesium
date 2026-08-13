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
- `pnpm docs:dev` — docs dev server (`vitepress`)
- `pnpm docs:build` — build docs

## E2E tests (Cypress)

- `cypress/e2e/docs.cy.ts` — smoke tests against the built VitePress docs site (`vitepress build packages` + `vitepress preview packages`).
- `cypress/e2e/app.cy.ts` — behavior tests against the e2e host app in `e2e/app/` (a plain Vite + Vue app, not VitePress). The host reuses the **docs demo components** (`packages/**/demo.vue`) as its test scenes: `demo-host.vue` wraps each demo with `packages/.vitepress/theme/components/cesium-container.vue` in `e2e` mode (no Ion network access, `baseLayer: false`, default input actions kept) and exposes the viewer on `window.__app` (see `e2e/app/src/state.ts`). Assertions use `cy.window().its(...)` so Cypress retries until the scene reaches the expected state.
- The viewer is created with the base layer disabled (`baseLayer: false`) so tests are deterministic and offline-friendly.
- Note: `useElementOverlay` has no behavior test — its demo requires Cesium world terrain (network + Ion token).
- Adding a new behavior test: register the new demo route in `e2e/app/src/main.ts` (hash router, auto-listed in the `app.vue` nav), then assert in `cypress/e2e/app.cy.ts`. When a demo needs a new scene-state hook, extend `e2e/app/src/viewer-probe.vue` or the host wrapper — keep `demo.vue` files untouched so docs and e2e share the same scenes.

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
