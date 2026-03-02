---
sort: 99
subText: Scope SideEffects
tip: Internal
---

# useCollectionScope

Scope the SideEffects of Cesium-related `Collection` and automatically remove them when unmounted.

:::warning
This is a basic function that is intended to be called by other lower-level functions (e.g., `useEntityScope`). It is recommended to use higher-level hooks unless you need to implement custom collection management logic.
:::

## Usage

```ts
import { useCollectionScope } from 'vesium'

const { add, remove, scope } = useCollectionScope({
  addEffect: (instance) => viewer.entities.add(instance),
  removeEffect: (instance) => viewer.entities.remove(instance)
})

const entity = add({ id: 'test' })
// When the component is unmounted, the entity is automatically removed from viewer.entities
```

## Type Definitions

:::dts ./index.ts
