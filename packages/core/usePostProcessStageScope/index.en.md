---
sort: 99
tip: Internal
---

# usePostProcessStageScope

Scope `PostProcessStageCollection` mutations so created stages are removed automatically when the component unmounts.

:::warning
This is a low-level helper used by `usePostProcessStage`. Prefer `usePostProcessStage` unless you need custom collection management.
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

// Async creation is also supported.
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

## Notes

- The target collection defaults to `useViewer().value.scene.postProcessStages`.
- `add` accepts both `PostProcessStage` and `PostProcessStageComposite`.
- Use `remove` when you need manual cleanup before unmounting.

## Type Definitions

:::dts ./index.ts
