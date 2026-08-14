---
sort: 99
subText: 范围化操作后置处理
tip: 内部
---

# usePostProcessStageScope

将 `PostProcessStageCollection` 的增删操作限定在组件生命周期内：组件卸载时，自动移除所有通过 `add` 添加的后处理阶段。阶段运行在 GPU 上（shader、纹理），不清理会持续占用显存；Cesium 的 `remove` 会无条件销毁 stage（`destroyOnRemove` 无法阻止），常见后处理效果请优先使用 `usePostProcessStage`。

:::warning
这是一个底层辅助函数，用于自定义 `PostProcessStageCollection` 管理。除非你需要自定义集合管理逻辑，否则优先使用 `usePostProcessStage`。
:::

## Usage

```ts
import { PostProcessStage } from 'cesium';
import { usePostProcessStageScope } from 'vesium';

const { add } = usePostProcessStageScope();
const stage = add(new PostProcessStage({
  fragmentShader: 'uniform sampler2D colorTexture; varying vec2 v_textureCoordinates; void main() { gl_FragColor = texture2D(colorTexture, v_textureCoordinates); }',
}));
// 组件卸载时 stage 自动移除（Cesium 的 remove 会同时销毁实例）
```

## 返回值

- `add(instance)` - 添加阶段，支持 `PostProcessStage`、`PostProcessStageComposite` 与 Promise；集合不可用时抛出 `collection is not defined`
- `remove(instance)` - 移除阶段；Cesium 的 `remove` 会销毁实例，`destroyOnRemove` 只控制 hook 是否额外调用 `destroy()`
- `scope` - 已添加阶段的只读响应式 `Set`

## 注意事项

- `PostProcessStageCollection.remove` 会无条件销毁 stage，`destroyOnRemove` 无法阻止；移除后实例不可复用，需要再次显示请创建新实例。
- 目标集合默认 `useViewer().value.postProcessStages`；可通过 `collection` 传入自定义 `PostProcessStageCollection`（支持 ref / getter）。

## Type Definitions

:::dts ./index.ts
