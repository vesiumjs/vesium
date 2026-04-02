---
subText: Reactive post-process stages
---

# usePostProcessStage

Reactively add `PostProcessStage` instances to Cesium's post-process stage collection. The previous stage is removed automatically when the input changes.

## Usage

```ts
import { PostProcessStage } from 'cesium';
import { usePostProcessStage } from 'vesium';
import { ref } from 'vue';

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

## Overloads

- Pass a single stage to receive a `ComputedRef<T | undefined>`.
- Pass an array of stages to receive a `ComputedRef<T[] | undefined>`.

## Options

- `collection` sets the target `PostProcessStageCollection`.
- `isActive` controls whether the stage is currently applied.
- `evaluating` receives the async loading state.

## Notes

- The default collection is `viewer.scene.postProcessStages`.
- The input can be a value, getter, ref, or async getter.

## Type Definitions

:::dts ./index.ts
