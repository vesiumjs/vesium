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
  - *Note: Ensure `vitest.config.ts` is properly configured as it might be empty or commented out.*
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

### 2. Imports
- Use clean imports. Group them: external libraries first, then internal packages/modules.
- Internal workspace packages are referenced via `@vesium/*` (e.g., `@vesium/shared`).
- Prefer named exports over default exports for better tree-shaking and discoverability.

### 3. Formatting & Naming
- **Formatting:** Handled by ESLint with `@antfu/eslint-config`. Semicolons are enabled (`semi: true`).
- **Naming:**
  - Composition functions (hooks): Start with `use` (e.g., `useViewer`, `useEntity`).
  - Components: PascalCase (e.g., `MyComponent.vue`).
  - Variables/Functions: camelCase.
  - Constants: UPPER_SNAKE_CASE.
  - Types/Interfaces: PascalCase.

### 4. Types
- Use `interface` for object shapes and `type` for unions or aliases.
- Leverage Vue's `Ref` and `ShallowRef` appropriately. Cesium objects (like `Viewer`, `Entity`) should often be wrapped in `ShallowRef` to avoid deep reactivity overhead.
- Explicitly define return types for public functions.
- Common types are defined in `@vesium/shared/src/types.ts` (e.g., `Nullable`, `CommonCoord`).

### 5. Error Handling
- Use descriptive error messages.
- Use `assertError` from `@vesium/shared` for condition checks.
- For missing injections or critical failures, throw an `Error` early.
- Example: `if (!injectViewer) throw new Error('Viewer instance not found...');`

### 6. File Structure
- **Packages:** Logic is split into `packages/core`, `packages/shared`, `packages/plot`, etc.
- **Demos:** Each hook/component usually has a `demo.vue` and documentation in `index.en.md` / `index.zh.md` within its directory.
- **Monorepo:** Managed by `pnpm-workspace.yaml`.

## 🤖 AI Context
- This repository follows `@antfu`'s linting style with semicolons.
- Always check `package.json` in the root and sub-packages for script definitions.
- When adding new features, provide both English and Chinese documentation if possible.
- **Integrity Note:** Be aware that `tests/core` might contain a redundant project mirror that should be ignored or cleaned up.
- **TS Compatibility:** Ensure `compilerOptions.lib` includes `ES2022` or later to support `at()` and `replaceAll()`.
