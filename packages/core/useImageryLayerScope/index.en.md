---
sort: 99
tip: Internal
---

# useImageryLayerScope

Scopes `ImageryLayerCollection` mutations to the component lifecycle: when the component unmounts, every imagery layer added through `add` is removed automatically. Layers stack on top of each other, so dynamically added layers accumulate in `viewer.imageryLayers` if left unmanaged, covering the base map and consuming memory; `add` accepts an insertion index to control the stacking order, and for common layer loading prefer `useImageryLayer`.

:::warning
This is a low-level helper for custom collection management. Prefer the high-level hook (`useImageryLayer`) unless you need custom collection management.
:::

## Usage

```ts
import { ImageryLayer, UrlTemplateImageryProvider } from 'cesium';
import { useImageryLayerScope } from 'vesium';

const { add } = useImageryLayerScope({ destroyOnRemove: true });
// The second argument is the insertion index: 0 inserts at the bottom
add(new ImageryLayer(new UrlTemplateImageryProvider({
  url: 'https://example.com/{z}/{x}/{y}.png',
})), 0);
```

## Return Value

- `add(instance, index?)` - Adds a layer; `index` is an optional insertion index forwarded to `imageryLayers.add(layer, index)`; accepts a Promise
- `remove(instance, destroy?)` - Removes the layer; `destroy` is forwarded to `imageryLayers.remove(layer, destroy)`; returns whether the removal succeeded
- `scope` - A readonly reactive `Set` of the added layers

## Notes

- The target collection defaults to `useViewer().value.imageryLayers`; pass a custom `ImageryLayerCollection` via `collection` (accepts a ref or getter).
- `destroyOnRemove` is also used as the second argument of `imageryLayers.remove(layer, destroy)` during unmount cleanup.

## Type Definitions

:::dts ./index.ts
