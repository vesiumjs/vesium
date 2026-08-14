# useElementOverlay

Anchor an HTML element to a geographic coordinate in the Cesium scene and update its position in real time as the camera moves. Based on `scene.postUpdate`, the position is synced on every frame with built-in alignment (`horizontal`/`vertical`), pixel offset (`offset`), ground clamping (`clampToGround`), and coordinate-system selection; it returns `x`/`y`/`style` and applies them to the target element by default.

## Usage

:::demo src="./demo.vue"
:::

```vue
<script setup lang="ts">
import * as Cesium from 'cesium';
import { useElementOverlay } from 'vesium';
import { shallowRef } from 'vue';

const elRef = shallowRef<HTMLDivElement>();
const position = shallowRef(Cesium.Cartesian3.fromDegrees(120, 30, 0));
const { x, y, style } = useElementOverlay(elRef, position, { offset: { x: 0, y: -20 } });
</script>

<template>
  <div ref="elRef" class="absolute" :style="style">
    My Label
  </div>
</template>
```

## Options

- `horizontal` / `vertical` - The horizontal/vertical origin, defaults to `'center'` / `'bottom'`; one of `'center' | 'left' | 'right'` / `'center' | 'bottom' | 'top'`.
- `offset` - The pixel offset on top of the anchor, defaults to `{ x: 0, y: 0 }`.
- `referenceWindow` - `true` positions relative to the browser viewport (adding the canvas's page position); omitted positions relative to the Cesium canvas.
- `applyStyle` - Whether to apply `left`/`top` to the target automatically, defaults to `true`; set to `false` to bind the returned `x`/`y`/`style` yourself.
- `clampToGround` - Whether to clamp the coordinate to the ground (via `scene.clampToHeight`); requires height data such as terrain or 3D Tiles.

## Return Value

- `x` / `y` - Pixel coordinates (`ComputedRef<number>`, 1 decimal place, already offset by the element's own size per the alignment origin); `style` - a CSS string ready to bind, e.g. `left:100px;top:200px;`.

## Notes

- `clampToGround` relies on `scene.clampToHeight` and falls back to the original coordinate when terrain is not loaded or clamping fails; the demo uses world terrain, which requires network access and an Ion token.

## Type Definitions

:::dts ./index.ts
:::
