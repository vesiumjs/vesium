# usePostProcessStage

Reactively adds post-process effect `PostProcessStage` instances to a `PostProcessStageCollection` (defaults to `viewer.scene.postProcessStages`). Post-process effects apply to the rendered result of the whole scene (bloom, silhouette, black-and-white filters, etc.); `usePostProcessStage` automatically removes the previous batch when the data changes or the component unmounts and destroys instances by default (`destroyOnRemove` defaults to `true`). Note that toggling `isActive` to `false` triggers removal, and `PostProcessStageCollection.remove` always destroys the stage (`destroyOnRemove: false` cannot prevent it); re-adding a destroyed stage produces no effect — create a new instance each time you need to toggle.

## Usage

:::demo src="./demo.vue"
:::

```ts
import { PostProcessStage } from 'cesium';
import { usePostProcessStage } from 'vesium';

// The effect is defined by fragmentShader
const bloomStage = new PostProcessStage({
  name: 'bloom',
  fragmentShader: 'uniform sampler2D colorTexture; varying vec2 v_textureCoordinates; void main() { gl_FragColor = texture2D(colorTexture, v_textureCoordinates); }',
});

const controlled = usePostProcessStage(bloomStage, {
  isActive: true, // false removes the stage; Cesium's remove always destroys it
});
```

## Options

- `collection` - The target `PostProcessStageCollection`; defaults to `useViewer().value.scene.postProcessStages`.
- `destroyOnRemove` - Whether the hook additionally calls `destroy()` on removal, defaults to `true`. Note that Cesium's `PostProcessStageCollection.remove` always destroys the stage; this option cannot prevent it.
- `isActive` - Whether active, defaults to `true`; when `false`, the stage is not added and the effect does not apply.
- `evaluating` - A ref receiving the async evaluation state.

## Return Value

- A single value (or getter/ref/async getter) returns `ComputedRef<T | undefined>`.
- An array returns `ComputedRef<T[] | undefined>`.

## Notes

- When the same stage instance is managed by multiple `usePostProcessStage` hooks at once, removal and destruction by one of them affects the other holders; manage each instance with a single hook.
- Cleanup calls `collection.remove(item)` unconditionally (unlike `useDataSource`/`usePrimitive`, it does not check whether the collection has been destroyed); do not rely on this hook's cleanup after the viewer is destroyed.

## Type Definitions

:::dts ./index.ts
:::
