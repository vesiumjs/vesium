---
sort: 1
---

# createViewer

Initializes a `Viewer` instance, or reuses an existing instance passed in, and exposes it through dependency injection to the current component and its descendants. It encapsulates the boilerplate of calling `destroy()` manually and drilling props: an instance created from an element is destroyed automatically when the component scope ends.

## Usage

:::demo src="./demo.vue" :cesium="false"
:::

:::warning Note
If `createViewer` and `useViewer` are used in the same component, `useViewer` should be called after `createViewer` and will prioritize the instance created by the current component.
:::

```ts
import { createViewer, useViewer } from 'vesium';
import { shallowRef } from 'vue';

const elRef = shallowRef<HTMLElement>();

// Pass in a DOM element (or ref) to create a new instance, destroyed on unmount
const viewer = createViewer(elRef, { /* ...options */ });

// Pass in an existing instance to reuse it without taking over its lifecycle
const sharedViewer = createViewer(window.viewer);
const injectedViewer = useViewer();
```

## Return Value

- `Readonly<ShallowRef<Viewer | undefined>>` - a readonly reference to the `Viewer`; it becomes `undefined` once the instance is destroyed. It points to the same `Viewer` instance as `useViewer()`. (Note: the two are different ref objects; `createViewer` filters out destroyed instances.)

## Notes

- A `MutationObserver` watches `body`: when the `canvas` is removed from the DOM (e.g. by `v-if`), the reference is cleared so consumers do not keep using a stale instance.
- If the element ref is not yet bound, no instance is created; it is created automatically once the element appears.

## Type Definitions

:::dts ./index.ts
:::
