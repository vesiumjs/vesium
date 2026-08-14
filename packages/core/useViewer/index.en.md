---
sort: 2
---

# useViewer

Retrieve the `Viewer` instance injected by `createViewer` in the current component or its ancestors. Any component at any level can get the same instance directly with no prop drilling; if nothing is injected, it throws a clear `Error` instead of silently returning `undefined`.

## Usage

:::warning
If `useViewer` and `createViewer` are used in the same component, `useViewer` must be called after `createViewer` and will prioritize the instance created by the current component.
:::

```ts
import { createViewer, useViewer } from 'vesium';
import { ref } from 'vue';

const elRef = ref<HTMLElement>();
createViewer(elRef);
// Must be called after `createViewer`, otherwise an ancestor-injected instance may be returned
const viewer = useViewer();
```

```vue
<script setup lang="ts">
import { useViewer } from 'vesium';

const viewer = useViewer();
</script>
```

## Return Value

- `Readonly<ShallowRef<Viewer | undefined>>` - a readonly reference to the `Viewer`, pointing to the same `Viewer` instance created by `createViewer`; `undefined` once the instance is destroyed.

## Notes

- If neither the current component nor any ancestor has called `createViewer`, an `Error` is thrown asking whether `createViewer` has been called.
- The returned reference is readonly and cannot be assigned to directly.

## Type Definitions

:::dts ./index.ts
:::
