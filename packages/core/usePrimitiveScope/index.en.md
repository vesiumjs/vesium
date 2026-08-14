---
sort: 99
tip: Internal
---

# usePrimitiveScope

Scopes `PrimitiveCollection` mutations to the component lifecycle: when the component unmounts, every primitive added through `add` is removed automatically. Primitives render directly in the scene, so leftovers cause duplicated drawing and GPU resource leaks; instances are destroyed by default on removal (`destroyOnRemove` defaults to `true`), `collection` accepts `'ground'` to switch to `viewer.scene.groundPrimitives`, and for common primitive loading prefer `usePrimitive`.

:::warning
This is a low-level helper for custom collection management (used internally by `@vesium/plot`). Prefer the high-level hook (`usePrimitive`) unless you need custom collection management.
:::

## Usage

```ts
import { Primitive } from 'cesium';
import { usePrimitiveScope } from 'vesium';

// collection: 'ground' switches to viewer.scene.groundPrimitives
const { add } = usePrimitiveScope({ collection: 'ground' });
const primitive = add(new Primitive({ geometryInstances: [] }));
// Removed and destroyed automatically on unmount
```

## Return Value

- `add(instance, ...args)` - Adds a primitive; extra arguments are forwarded to `PrimitiveCollection.add(instance, index)`; accepts a Promise; throws `collection is not defined` when no collection is available
- `remove(instance)` - Removes the primitive; when `destroyOnRemove` is `true` (the default) and the instance is not destroyed, its `destroy()` is called to release GPU resources
- `scope` - A readonly reactive `Set` of the added primitives

## Notes

- The target collection defaults to `useViewer().value.scene.primitives`; pass `collection: 'ground'` to switch to `viewer.scene.groundPrimitives` (for `GroundPrimitive`).
- `PrimitiveCollection.remove` destroys the primitive by default (`destroyPrimitives: true`); `destroyOnRemove` cannot prevent it. The instance cannot be reused after removal — create a new one to show it again.

## Type Definitions

:::dts ./index.ts
