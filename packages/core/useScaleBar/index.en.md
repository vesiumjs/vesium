# useScaleBar

Reactive generation of Cesium scale bar data: pixel distance, scale width, and formatted distance text. A hand-drawn scale bar requires computing how many meters one pixel represents and recomputing on camera moves or canvas resizes; this hook picks two adjacent pixels at the bottom-center of the canvas, computes the geodesic distance between their ground points, and selects a tick from a fixed table — recomputing automatically (throttled) on camera movement or canvas resize. Use it for a conventional scale bar overlaid on a corner of the Cesium canvas.

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useScaleBar } from 'vesium';

// maxPixel controls the maximum pixel width of the scale (default 80px)
const { pixelDistance, width, distance, distanceText } = useScaleBar({ maxPixel: 80 });
```

## Options

- `maxPixel` - The maximum width of the scale (px), default `80`.
- `delay` - Throttled delay (ms) for recomputation on camera events, default `8`.

## Return Value

- `pixelDistance` - The actual distance of a single pixel in the current canvas (m).
- `width` - The width of the scale (px).
- `distance` - The actual distance covered by the scale width (m).
- `distanceText` - Formatted distance text, e.g. `100m`, `100km`.

## Notes

- Depends on `useViewer()`, so `createViewer` must be called first.
- The distance is computed by picking the ground with `globe.pick`: when the camera has no ground intersection (e.g. facing the sky), the last computed value is kept; `pixelDistance` is only `undefined` before the first successful pick.
- `distanceText` is shown in `km` when the distance exceeds 1000m.

## Type Definitions

:::dts ./index.ts
:::
