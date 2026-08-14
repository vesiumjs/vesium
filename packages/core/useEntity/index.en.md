# useEntity

Reactively adds Cesium `Entity` instances (points, labels, models, etc.) to an `EntityCollection` (defaults to `viewer.entities`). When the data changes or the component unmounts, the previous batch is removed automatically and the new data added — no manual tracking; values, getters, refs, async getters and arrays are all supported. Removal only calls `collection.remove(entity)` and never destroys the instance: `Entity` is a descriptive object that does not hold GPU resources directly, so it stays reusable and re-addable (unlike `usePrimitive`, which destroys by default).

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useEntity } from 'vesium';

// Single value: you create and own the instance; the hook only adds/removes it
const entity = useEntity(new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(150, 10),
  label: { text: 'entity instance' },
}));

// Getter rebuilds on every evaluation; refs, async getters and arrays also work
const dynamic = useEntity(() => new Cesium.Entity({ /* ... */ }));
```

## Options

- `collection` - The target `EntityCollection`; defaults to `useViewer().value.entities`.
- `isActive` - Whether active, defaults to `true`; toggling adds/removes automatically.
- `evaluating` - A ref receiving the async evaluation state; `true` while evaluating.

## Return Value

- A single value (or getter/ref/async getter) returns `ComputedRef<T | undefined>`.
- An array returns `ComputedRef<T[] | undefined>`.

## Notes

- The returned ref is driven by `computedAsync` with an initial value of `[]` — an empty array is truthy, so don't rely on truthiness to check existence.
- An array input is replaced as a whole: on change, the old batch is fully removed and the new one fully added.

## Type Definitions

:::dts ./index.ts
:::
