---
subText: 叠加后置处理
---

# usePostProcessStage

将后处理特效 `PostProcessStage` 响应式地加入 `PostProcessStageCollection`（默认 `viewer.scene.postProcessStages`）。后处理作用于整个场景的渲染结果（泛光、描边、黑白滤镜等），`usePostProcessStage` 在数据变化或组件卸载时自动移除上一批 stage，移除时默认销毁实例（`destroyOnRemove` 默认 `true`）。注意 `isActive` 切到 `false` 会触发移除，而 `PostProcessStageCollection.remove` 会无条件销毁 stage（`destroyOnRemove: false` 无法阻止），销毁后的 stage 重新加入也不会产生特效——反复开关需要每次创建新实例。

## Usage

:::demo src="./demo.vue"
:::

```ts
import { PostProcessStage } from 'cesium';
import { usePostProcessStage } from 'vesium';

// 特效由 fragmentShader 定义
const bloomStage = new PostProcessStage({
  name: 'bloom',
  fragmentShader: 'uniform sampler2D colorTexture; varying vec2 v_textureCoordinates; void main() { gl_FragColor = texture2D(colorTexture, v_textureCoordinates); }',
});

const controlled = usePostProcessStage(bloomStage, {
  isActive: true, // false 时移除；Cesium 的 remove 会无条件销毁 stage
});
```

## 配置项

- `collection` - 目标 `PostProcessStageCollection`，默认 `useViewer().value.scene.postProcessStages`。
- `destroyOnRemove` - 移除时是否由 hook 额外调用 `destroy()`，默认 `true`。注意 Cesium 的 `PostProcessStageCollection.remove` 会无条件销毁 stage，此选项无法阻止。
- `isActive` - 是否激活，默认 `true`；为 `false` 时不加入集合，特效不生效。
- `evaluating` - 接收异步求值状态的 ref。

## 返回值

- 传入单个值（或 getter/ref/异步 getter）返回 `ComputedRef<T | undefined>`。
- 传入数组返回 `ComputedRef<T[] | undefined>`。

## 注意事项

- 同一个 stage 实例被多个 `usePostProcessStage` 同时管理时，其中一个移除并销毁实例会影响其他持有者；建议每个实例只由一个 hook 管理。
- 清理时无条件调用 `collection.remove(item)`（不做集合销毁检查，与 `useDataSource`/`usePrimitive` 不同），viewer 销毁后请勿依赖本 hook 的清理。

## Type Definitions

:::dts ./index.ts
:::
