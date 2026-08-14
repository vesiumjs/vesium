---
sort: 99
tip: Internal
---

# usePostProcessStageScope

Scopes `PostProcessStageCollection` mutations to the component lifecycle: when the component unmounts, every stage added through `add` is removed automatically. Stages run on the GPU (shaders, textures) and keep consuming video memory unless cleaned up; Cesium's `remove` always destroys the stage (`destroyOnRemove` cannot prevent it); for common post-process effects prefer `usePostProcessStage`.

:::warning
This is a low-level helper for custom `PostProcessStageCollection` management. Prefer `usePostProcessStage` unless you need custom collection management.
:::

## Usage

```ts
import { PostProcessStage } from 'cesium';
import { usePostProcessStageScope } from 'vesium';

const { add } = usePostProcessStageScope();
const stage = add(new PostProcessStage({
  fragmentShader: 'uniform sampler2D colorTexture; varying vec2 v_textureCoordinates; void main() { gl_FragColor = texture2D(colorTexture, v_textureCoordinates); }',
}));
// the stage is removed (and destroyed by Cesium) automatically on unmount
```

## Return Value

- `add(instance)` - Adds a stage; accepts `PostProcessStage`, `PostProcessStageComposite` and Promises; throws `collection is not defined` when no collection is available
- `remove(instance)` - Removes the stage; Cesium's `remove` destroys it, and `destroyOnRemove` only controls whether the hook calls `destroy()` additionally
- `scope` - A readonly reactive `Set` of the added stages

## Notes

- `PostProcessStageCollection.remove` always destroys the stage; `destroyOnRemove` cannot prevent it. The instance cannot be reused after removal — create a new one to show the effect again.
- The target collection defaults to `useViewer().value.postProcessStages`; pass a custom `PostProcessStageCollection` via `collection` (accepts a ref or getter).

## Type Definitions

:::dts ./index.ts
