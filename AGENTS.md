# Vesium Agent Guidelines

请根据开发者提问的语言，决定交流时使用的语言。

This document provides essential information for AI agents operating in the Vesium repository. Vesium is a Vue component and composition-api library for Cesium.

## 🛠 Build, Lint, and Test Commands

The project uses `pnpm` as the package manager.

- **Install dependencies:** `pnpm install`
- **Build all packages:** `pnpm build:ci` (uses `tsdown`)
- **Type check:** `pnpm type-check` (uses `vue-tsc`)
- **Linting:** `pnpm lint` (uses `eslint` with `@antfu/eslint-config`)
- **Unit Tests:**
  - Run all tests: `pnpm test:unit`
  - Run a single test file: `pnpm vitest <path-to-file>`
  - Run tests in UI mode: `pnpm vitest --ui`
  - _Note: Use `@vue/test-utils` and mock Cesium classes via `vi.mock` or `setupCesiumMocks` from `@vesium/shared` for core hook testing._
  - _Important: Many core hooks (e.g., `useEntity`, `useDataSource`) support async parameters (Getters or Promises). When testing these, ensure to wait for `computedAsync` resolution using `setTimeout` or `await nextTick()` as needed._
- **E2E Tests:**
  - Run E2E tests: `pnpm test:e2e`
  - Open Cypress for E2E: `pnpm test:e2e:dev`
- **Documentation:**
  - Dev mode: `pnpm docs:dev`
  - Build docs: `pnpm docs:build`

## 🎨 Code Style & Conventions

### 1. General Principles

- **Framework:** Vue 3 with Composition API.
- **Language:** TypeScript is mandatory. Use strict typing.
- **Cesium Integration:** Follow Cesium's lifecycle and memory management practices. Use `useViewer` to access the Cesium Viewer instance.
- **Reactivity:** Cesium objects (Viewer, Entity, Primitive) MUST be wrapped in `ShallowRef` to avoid performance degradation from Vue's deep reactivity.

### 2. Imports

- Use clean imports. Group them: external libraries first, then internal packages.
- Internal workspace packages are referenced via `@vesium/*` (e.g., `@vesium/shared`, `@vesium/geometry`).
- Prefer named exports over default exports for better tree-shaking.

### 3. Formatting & Naming

- **Formatting:** Handled by ESLint with `@antfu/eslint-config`. Semicolons are REQUIRED (`semi: true`).
- **Naming:**
  - Composition functions (hooks): Start with `use` (e.g., `useViewer`, `useEntity`).
  - Components: PascalCase (e.g., `MyComponent.vue`).
  - Variables/Functions: camelCase.
  - Constants: UPPER_SNAKE_CASE.
  - Types/Interfaces: PascalCase.

### 4. Types

- Use `interface` for object shapes and `type` for unions or aliases.
- Leverage Vue's `Ref` and `ShallowRef` appropriately.
- Explicitly define return types for public functions and hooks.
- Common types are defined in `@vesium/shared/src/types.ts` (e.g., `Nullable`, `CommonCoord`).

### 5. Error Handling

- Use descriptive error messages.
- Use `assertError` from `@vesium/shared` for condition checks.
- For missing injections or critical failures, throw an `Error` early.
- Example: `if (!injectViewer) throw new Error('Viewer instance not found...');`

### 6. File Structure

- **Packages:** Logic is split into `packages/core`, `packages/shared`, `packages/plot`, `packages/geometry`.
- **Tests:** Place unit tests in the same directory as the source file, named `index.test.ts` (especially for `packages/core`).
- **Demos:** Each hook/component usually has a `demo.vue` and documentation in `index.en.md` / `index.zh.md` within its directory.
- **Monorepo:** Managed by `pnpm-workspace.yaml`.

## 🤖 AI Context & Project Status

- **Linting:** ESLint is configured to ignore `.agents/` (skill docs) and Markdown formatting.
- **TS Compatibility:** Project target is `ES2022`. Ensure support for `at()`, `replaceAll()`, etc.
- **Test Strategy:** We use `vitest`. When testing core hooks, use the `mount()` pattern from `@vue/test-utils` to provide the proper `Viewer` context.
- **Plotting Module:** The `PlotFeature` constructor automatically determines the `defining` state based on whether initial positions are provided (restoring scene).
- **Integrity Note:** Always run `pnpm type-check` after modifying shared types or core logic.

## 📦 Core Packages

- `@vesium/core`: Core Vue hooks for Cesium lifecycle.
- `@vesium/shared`: Universal utility functions and type definitions.
- `@vesium/geometry`: Specialized geometry and coordinate calculations.
- `@vesium/plot`: Plotting and measurement tools (Arrows, Distance, Area).
