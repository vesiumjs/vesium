---
sort: 99
tip: Internal
---

# useEntityScope

Scopes `EntityCollection` mutations to the component lifecycle: when the component unmounts, every entity added through `add` is removed automatically. Entities added by hand stay in the scene after unmounting, and re-entering the page leads to leftover or duplicated entities; this is a low-level helper, so prefer `useEntity` for declarative entity loading and use this hook directly only when you need custom collection management (e.g. adding entities to a specific `DataSource`'s `entities` collection — exactly how `@vesium/plot` uses it).

:::warning
This is a low-level helper for custom collection management (used internally by `@vesium/plot`). Prefer the high-level hook (`useEntity`) unless you need custom collection management.
:::

## Usage

```ts
import { Entity } from 'cesium';
import { useEntityScope } from 'vesium';

// Without options, the target collection defaults to useViewer().value.entities
const { add, remove } = useEntityScope();
const entity = add(new Entity({ id: 'demo' }));
// Removed automatically on unmount; add also accepts a Promise
```

## Return Value

- `add(instance)` - Adds an entity; accepts a Promise and joins the collection once it resolves; throws `collection is not defined` when no collection is available
- `remove(instance)` - Removes the entity; returns whether the removal succeeded (`false` when no collection is available)
- `scope` - A readonly reactive `Set` of the added entities

## Notes

- The target collection defaults to `useViewer().value.entities`; pass a custom `EntityCollection` via `collection` (accepts a ref or getter), e.g. `dataSource.entities`.
- Use `remove` for manual cleanup before unmounting; the instance is then no longer processed by the automatic cleanup.

## Type Definitions

:::dts ./index.ts
