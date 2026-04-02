---
sort: 99
subText: Scoped imagery-layer operations
tip: Internal
---

# useImageryLayerScope

Scope `ImageryLayerCollection` mutations so created imagery layers are removed automatically when the component unmounts.

:::warning
This is a low-level helper used by `useImageryLayer`. Prefer `useImageryLayer` unless you need custom collection management.
:::

## Usage

```ts
import { ImageryLayer, UrlTemplateImageryProvider } from 'cesium';
import { useImageryLayerScope } from 'vesium';

const { add, remove } = useImageryLayerScope({
  destroyOnRemove: true,
});

const layer = add(new ImageryLayer(new UrlTemplateImageryProvider({
  url: 'https://example.com/{z}/{x}/{y}.png',
})), 0);

// Async creation is also supported.
add(Promise.resolve(new ImageryLayer(new UrlTemplateImageryProvider({
  url: 'https://example.com/{z}/{x}/{y}.png',
}))));
```

## Notes

- The target collection defaults to `useViewer().value.imageryLayers`.
- `add` accepts an optional insertion index.
- `destroyOnRemove` is forwarded to `imageryLayers.remove(layer, destroyOnRemove)`.

## Type Definitions

:::dts ./index.ts
