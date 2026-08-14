---
subText: 叠加HTML元素
---

# useElementOverlay

把 HTML 元素锚定到 Cesium 场景中的某个地理坐标，并随相机变化实时更新位置。基于 `scene.postUpdate` 每帧自动同步，内置对齐（`horizontal`/`vertical`）、像素偏移（`offset`）、贴地（`clampToGround`）与坐标系选择，返回 `x`/`y`/`style` 并默认自动应用到目标元素。

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

## 配置项

- `horizontal` / `vertical` - 水平/垂直对齐原点，默认 `'center'` / `'bottom'`；可选 `'center' | 'left' | 'right'` / `'center' | 'bottom' | 'top'`。
- `offset` - 锚点基础上的像素偏移，默认 `{ x: 0, y: 0 }`。
- `referenceWindow` - `true` 时相对浏览器视口定位（加上 canvas 在页面中的位置），缺省相对 Cesium 画布。
- `applyStyle` - 是否自动把 `left`/`top` 应用到目标元素，默认 `true`；设为 `false` 时自行绑定返回的 `x`/`y`/`style`。
- `clampToGround` - 是否把坐标贴到地表（通过 `scene.clampToHeight`），需要地形或 3D Tiles 等高度数据。

## 返回值

- `x` / `y` - 像素坐标（`ComputedRef<number>`，保留 1 位小数，已按对齐原点扣除元素自身尺寸）；`style` - 可直接绑定到元素的 CSS 字符串（如 `left:100px;top:200px;`）。

## 注意事项

- `clampToGround` 依赖 `scene.clampToHeight`，地形未加载或无法贴地时回退为原始坐标；demo 使用世界地形展示该效果，需要网络连接与 Ion token。

## Type Definitions

:::dts ./index.ts
:::
