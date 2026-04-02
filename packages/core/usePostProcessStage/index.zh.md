---
subText: 叠加后置处理
---

# usePostProcessStage

将 `PostProcessStage` 响应式添加到 Cesium 的后置处理集合中。输入变化时，上一份后置处理会自动移除。

## Usage

```ts
import { ref } from 'vue';
import { PostProcessStage } from 'cesium';
import { usePostProcessStage } from 'vesium';

const enabled = ref(true);

const stage = usePostProcessStage(() => new PostProcessStage({
  fragmentShader: `
    uniform sampler2D colorTexture;
    varying vec2 v_textureCoordinates;
    void main() {
      gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
    }
  `,
}), {
  isActive: enabled,
});
```

## 重载

- 传入单个 stage 时，返回 `ComputedRef<T | undefined>`。
- 传入 stage 数组时，返回 `ComputedRef<T[] | undefined>`。

## 配置项

- `collection` 用于指定目标 `PostProcessStageCollection`。
- `isActive` 控制当前是否生效。
- `evaluating` 用于接收异步解析状态。

## 说明

- 默认集合为 `viewer.scene.postProcessStages`。
- 输入值可以是普通值、getter、ref 或异步 getter。

## Type Definitions

:::dts ./index.ts
