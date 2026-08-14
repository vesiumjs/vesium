# useCameraState

Reactive access to the `Camera` state (position, directions, heading/pitch/roll, level, and more). Reading `viewer.camera.position` directly does not trigger Vue's reactivity — the camera is driven by Cesium's internal render loop; this hook listens to camera events (default `changed`), throttles updates (default 8ms), and syncs the state into reactive data that follows animations, making it suitable for binding to UI (e.g. a coordinates panel) or driving other logic.

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useCameraState } from 'vesium';

const { position, heading, pitch, roll, level } = useCameraState();
```

## Options

- `camera` - The camera to watch, default `useViewer().value.scene.camera`.
- `event` - The event to watch: `changed` | `moveStart` | `moveEnd`, default `changed`.
- `delay` - Throttled delay (ms), default `8`.

## Return Value

- `position` - The camera position (world coordinates, cloned).
- `heading` / `pitch` / `roll` - The camera heading / pitch / roll (radians).
- `level` - The camera level (estimated from height).
- Other fields (`direction`, `positionCartographic`, `viewRectangle`, etc.) are defined in the type definitions below.

## Notes

- The default camera comes from `useViewer()`, so `createViewer` must be called first.
- The state is synced with throttling (default 8ms), not per frame; the returned vectors/coordinates are cloned, so mutating them does not affect the camera.
- In `positionCartographic`, longitude/latitude are in radians (may fall outside valid ranges in 2D and Columbus View); `level` is estimated from height with an empirical formula, not an official Cesium API.

## Type Definitions

:::dts ./index.ts
:::
