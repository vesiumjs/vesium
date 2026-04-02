---
sort: 99
subText: 范围化操作后置处理
tip: 内部
---

# usePostProcessStageScope

将 `PostProcessStageCollection` 的增删操作范围化，并在组件卸载时自动移除创建的后置处理。

:::warning
这是一个底层辅助函数，主要供 `usePostProcessStage` 使用。除非你需要自定义集合管理逻辑，否则优先使用 `usePostProcessStage`。
:::

## Usage

```ts
import { PostProcessStage } from 'cesium';
import { usePostProcessStageScope } from 'vesium';

const { add, remove } = usePostProcessStageScope();

const stage = add(new PostProcessStage({
  fragmentShader: `
    uniform sampler2D colorTexture;
    varying vec2 v_textureCoordinates;
    void main() {
      gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
    }
  `,
}));

// 也支持异步创建
add(Promise.resolve(new PostProcessStage({
  fragmentShader: `
    uniform sampler2D colorTexture;
    varying vec2 v_textureCoordinates;
    void main() {
      gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
    }
  `,
})));
```

## 说明

- 目标集合默认使用 `useViewer().value.scene.postProcessStages`。
- `add` 同时支持 `PostProcessStage` 和 `PostProcessStageComposite`。
- 如果需要在卸载前手动清理，可以直接调用 `remove`。

## Type Definitions

:::dts ./index.ts
