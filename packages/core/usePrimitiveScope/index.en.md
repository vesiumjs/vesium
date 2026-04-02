---
sort: 99
subText: Scoped primitive operations
tip: Internal
---

# usePrimitiveScope

Scope `PrimitiveCollection` mutations so created primitives are removed automatically when the component unmounts.

:::warning
This is a low-level helper used by `usePrimitive`. Prefer `usePrimitive` unless you need custom collection management.
:::

## Usage

```ts
import { Primitive, PrimitiveCollection } from 'cesium';
import { usePrimitiveScope } from 'vesium';

const { add, remove } = usePrimitiveScope({
  collection: 'ground',
});

const primitive = add(new Primitive({
  geometryInstances: [],
}));

// Async creation is also supported.
add(Promise.resolve(new Primitive({
  geometryInstances: [],
})));
```

## Notes

- The target collection defaults to `useViewer().value.scene.primitives`.
- Pass `collection: 'ground'` to use `viewer.value.scene.groundPrimitives`.
- `add` accepts promises and adds the resolved primitive to the collection.

## Type Definitions

:::dts ./index.ts
