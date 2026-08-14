---
sort: 99
tip: Internal
---

# useCollectionScope

Encapsulates the add/remove side effects of a Cesium-related `Collection` within the component lifecycle: when the component unmounts, every instance added through `add` is removed automatically. Mutating a collection (e.g. `viewer.entities`) by hand often leaves instances behind, causing duplicated entities and resource leaks; unlike the other scoped hooks, this one needs you to describe the real add/remove behavior via `addEffect` / `removeEffect` — `useEntityScope`, `usePrimitiveScope` and the other scoped hooks are built on top of it, and `@vesium/plot` consumes them indirectly.

:::warning
This is a basic function that is intended to be called by other lower-level functions (e.g., `useEntityScope`). It is recommended to use higher-level hooks unless you need to implement custom collection management logic.
:::

## Usage

```ts
import { Entity } from 'cesium';
import { useCollectionScope, useViewer } from 'vesium';

const viewer = useViewer();
const { add } = useCollectionScope({
  addEffect: e => viewer.value!.entities.add(e),
  removeEffect: e => viewer.value!.entities.remove(e),
});
add(new Entity({ id: 'demo' }));
```

## Return Value

- `add(instance, ...args)` - Calls `addEffect` to add the instance and records it in `scope`; with a Promise, the instance enters the collection after it resolves
- `remove(instance, ...args)` - Removes the instance from `scope` first, then calls `removeEffect` for the real removal
- `scope` - A readonly reactive `Set` of added instances; use `scope.has(instance)` to check whether an instance is still in scope
- `removeWhere(predicate, ...args)` - Removes every instance matching the predicate
- `removeScope(...args)` - Clears all instances in the scope (called automatically on unmount)

## Notes

- On unmount `removeScope(removeScopeArgs ?? [])` runs automatically; instances already removed via `remove` are no longer in `scope` and won't be processed again.
- With a Promise passed to `add`, the instance enters the collection and `scope` only after the Promise resolves.

## Type Definitions

:::dts ./index.ts
