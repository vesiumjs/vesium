---
subText: 实时帧率
---

# useCesiumFps

响应式获取 Cesium 的实时渲染帧率（FPS）与帧间隔。Cesium 没有暴露响应式帧率 API；本 hook 监听 `scene.postRender`，按节流间隔（默认 100ms）计算帧间隔并输出响应式的 `fps` 与 `interval`，适合性能监控面板、按帧率动态调整渲染质量等场景。

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useCesiumFps } from 'vesium';

// delay 控制节流采样间隔（毫秒），越小越灵敏、开销越高
const { fps, interval } = useCesiumFps({ delay: 100 });
// fps.value -> 当前帧率
// interval.value -> 当前帧间隔（毫秒）
```

## 配置项

- `delay` - 节流采样间隔（毫秒），默认 `100`。

## 返回值

- `fps` - 每秒帧数，由 `1000 / interval` 计算得出。
- `interval` - 帧间隔（毫秒）。

## 注意事项

- 依赖 `useViewer()`，使用前需先调用 `createViewer`。
- 首帧渲染前 `interval` 为 `0`，此时 `fps` 为 `Infinity`。

## Type Definitions

:::dts ./index.ts
:::
