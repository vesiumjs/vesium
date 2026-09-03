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

## Recipes (Cesium 1.142+ / 1.145+ vectors)

`GeoJsonPrimitive` / `MVTDataProvider` / `BufferPolygonCollection` / `BufferPolylineCollection` are high-throughput vector entry points (added straight to `scene.primitives`, no Entity layer). Prefer an async getter so the hook adds them once loaded:

```ts
import * as Cesium from 'cesium';
import { usePrimitive, useViewer } from 'vesium';

const viewer = useViewer();

// GeoJSON loaded directly as buffer primitives; 1.145+ drapes onto terrain / 3D Tiles / both, `scene` is required when clamping
const geojson = usePrimitive(() => Cesium.GeoJsonPrimitive.fromUrl('/data/city.geojson', {
  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  scene: viewer.value!.scene,
}));

// MVT vector tiles; 1.145+ supports the same `heightReference` + `scene` pair
const mvt = usePrimitive(() => Cesium.MVTDataProvider.fromUrl('https://tiles/{z}/{x}/{y}.mvt', {
  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  scene: viewer.value!.scene,
}));

// Lines/polygons draped onto 3D Tiles (new in 1.145): only polyline/polygon collections support draping,
// and only once added to `scene.primitives`; a draped collection is not drawn as geometry of its own
const drapedLines = usePrimitive(() => new Cesium.BufferPolylineCollection({
  heightReference: Cesium.HeightReference.CLAMP_TO_3D_TILE,
  widthUnits: 'meters', // new in 1.145: width in ground meters instead of screen pixels
}));
```

- Draped polyline antialiasing is on by default; turn it off for performance with `viewer.scene.vectorProvider.antialias = false` (1.145+).
- `ClippingPolygon` (1.145): `positions` / `holes` are immutable (`Object.freeze`), remove and re-add to update; `holes` are supported (including inverse clipping), read bounds from `polygon.rectangle` (`computeRectangle` is deprecated), and `ClippingPolygonCollection.quality` / `debugShowDistanceTexture` / `destroy` are deprecated too.
- Experimental `scene.snap` (1.144+, `surfacePosition` added in 1.145) and `IonSnapService` (server-side snap for BIM/CAD database models) have no wrapper yet; use `viewer.value.scene.snap(position)` directly when needed.

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
