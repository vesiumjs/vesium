# usePrimitive

Reactively adds low-level rendering objects `Primitive` (`BillboardCollection`, `Cesium3DTileset`, `GroundPrimitive`, etc.) to a `PrimitiveCollection` (defaults to `viewer.scene.primitives`; pass `'ground'` to use `viewer.scene.groundPrimitives`). Unlike descriptive `Entity` objects, `Primitive` instances hold GPU resources directly (vertex buffers, textures, etc.), so `usePrimitive` destroys instances by default on removal (`destroyOnRemove` defaults to `true`) to release video memory, and handles automatic cleanup when the data changes or the component unmounts. It suits low-level rendering scenarios such as batched primitives and 3D Tiles where precise control over rendering layers and resources is needed.

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { usePrimitive } from 'vesium';

// Single value: you create the instance; the hook adds and destroys it. Arrays/getters work the same way
const tileset = usePrimitive(new Cesium.Cesium3DTileset({ url: '/data/tileset.json' }));

// Array: manage a batch of primitives
const billboards = new Cesium.BillboardCollection();
const primitives = usePrimitive([tileset, billboards]);

const controlled = usePrimitive(tileset, {
  collection: 'ground', // Adds to scene.groundPrimitives (GroundPrimitive must live there)
  isActive: true, // When false, the primitive is not added
  destroyOnRemove: true, // Destroy the instance and release GPU resources on removal (default true)
});
```

## Options

- `collection` - The target `PrimitiveCollection`; defaults to `useViewer().value.scene.primitives`. Passing `'ground'` uses `viewer.scene.groundPrimitives` (ground-attached primitives like `GroundPrimitive` must live there).
- `destroyOnRemove` - Whether the hook additionally calls `destroy()` on removal, defaults to `true`. Note that `PrimitiveCollection` defaults to `destroyPrimitives: true`, so `remove` destroys the primitive anyway; set the collection's `destroyPrimitives` to `false` to keep instances.
- `isActive` - Whether active, defaults to `true`.
- `evaluating` - A ref receiving the async evaluation state.

## Return Value

- A single value (or getter/ref/async getter) returns `ComputedRef<T | undefined>`.
- An array returns `ComputedRef<T[] | undefined>`.

## Notes

- Primitives are destroyed by default on removal (`PrimitiveCollection` defaults to `destroyPrimitives: true`); a destroyed primitive cannot be re-added. To toggle the same primitive, set the collection's `destroyPrimitives` to `false`.
- It relies on `useViewer()`: nothing is added before the viewer is created (`viewer.value` is `undefined`); use it inside the component tree provided by `createViewer`.

## Type Definitions

:::dts ./index.ts
:::
