---
subText: 比例尺
---

# useScaleBar

响应式生成 Cesium 比例尺数据：单像素距离、比例尺宽度、格式化的距离文本。手动画比例尺需自行计算像素距离并在相机移动、画布变化时重算；本 hook 通过拾取画布底边中心相邻像素的地面点计算像素距离，从固定档位表选出刻度，相机移动或画布缩放时自动（节流）重算，适合叠加在画布角落的常规比例尺 UI。

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useScaleBar } from 'vesium';

// maxPixel 控制比例尺最大像素宽度（默认 80px）
const { pixelDistance, width, distance, distanceText } = useScaleBar({ maxPixel: 80 });
```

## 配置项

- `maxPixel` - 比例尺的最大像素宽度（px），默认 `80`。
- `delay` - 相机事件触发重算的节流延迟（毫秒），默认 `8`。

## 返回值

- `pixelDistance` - 当前画布中单个像素对应的实际距离（米）。
- `width` - 比例尺宽度（像素）。
- `distance` - 比例尺宽度对应的实际距离（米）。
- `distanceText` - 距离的格式化文本，如 `100m`、`100km`。

## 注意事项

- 依赖 `useViewer()`，使用前需先调用 `createViewer`。
- 距离经 `globe.pick` 拾取地面计算：相机朝向无地面交点（如朝向天空）时保留上一次计算的值；从未成功拾取过时才为 `undefined`。
- `distanceText` 超过 1000m 时以 `km` 显示。

## Type Definitions

:::dts ./index.ts
:::
