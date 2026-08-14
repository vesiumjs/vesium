# useCesiumFps

Reactive access to Cesium's real-time render frame rate (FPS) and inter-frame interval. Cesium does not expose a reactive frame-rate API; this hook listens to `scene.postRender` and computes the inter-frame interval with throttling (default 100ms), outputting reactive `fps` and `interval` values — useful for performance monitoring panels or adjusting render quality based on the frame rate.

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useCesiumFps } from 'vesium';

// delay controls the throttled sampling interval (ms); smaller is more responsive but costs more
const { fps, interval } = useCesiumFps({ delay: 100 });
// fps.value -> the current FPS
// interval.value -> the current inter-frame interval (ms)
```

## Options

- `delay` - Throttled sampling interval (ms), default `100`.

## Return Value

- `fps` - Frames per second, computed as `1000 / interval`.
- `interval` - The inter-frame interval (ms).

## Notes

- Depends on `useViewer()`, so `createViewer` must be called first.
- Before the first frame is rendered, `interval` is `0`, so `fps` is `Infinity`.

## Type Definitions

:::dts ./index.ts
:::
