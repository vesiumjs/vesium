# useImageryLayer

Reactively adds `ImageryLayer` instances to an `ImageryLayerCollection` (defaults to `viewer.imageryLayers`). Layers stack on top of each other and the insertion position (`index`) decides which covers which: `useImageryLayer` controls the insertion position via `index`, the removal behavior via `destroyOnRemove`, and automatically cleans up the previous batch when the data changes or the component unmounts. Note that display properties (`alpha`, `brightness`, `splitDirection`, etc.) are set on the `ImageryLayer` instance itself — the hook only handles collection addition/removal and ordering.

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useImageryLayer } from 'vesium';

const layer = useImageryLayer(new Cesium.ImageryLayer(
  new Cesium.ArcGisMapServerImageryProvider({ url: '/arcgis/rest/services/...' }),
));

const controlled = useImageryLayer(layer, {
  isActive: true, // When false, the layer is removed
  index: 0, // Insertion position: second argument of imageryLayers.add(layer, index)
  destroyOnRemove: false, // Keep the instance when toggling; the default destroys it
});
```

## Options

- `collection` - The target `ImageryLayerCollection`; defaults to `useViewer().value.imageryLayers`.
- `isActive` - Whether active, defaults to `true`.
- `evaluating` - A ref receiving the async evaluation state.
- `destroyOnRemove` - Second argument of `imageryLayers.remove`; no default set (`undefined` passed through), Cesium treats it as `true`.
- `index` - Second argument of `imageryLayers.add(layer, index)`, i.e. the stacking order; in array mode all layers share the same `index`.

## Return Value

- A single value (or getter/ref/async getter) returns `ComputedRef<T | undefined>`.
- An array returns `ComputedRef<T[] | undefined>`.

## Notes

- When toggling with `isActive` and `destroyOnRemove` is left at the default (`undefined` → Cesium treats it as `true`), removal destroys the layer instance and re-enabling cannot restore it; pass `destroyOnRemove: false` to toggle.
- The returned ref is driven by `computedAsync` with an initial value of `[]` — an empty array is truthy, so don't rely on truthiness to check existence.

## Type Definitions

:::dts ./index.ts
:::
