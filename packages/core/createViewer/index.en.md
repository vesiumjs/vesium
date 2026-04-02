---
sort: 1
---

# createViewer

Initializes a Viewer or reuses an existing instance, which can be accessed by `useViewer` in the current component and its descendant components.

## Usage

:::demo src="./demo.vue" :cesium="false"
:::

:::warning Note
If `useViewer` and `createViewer` are used in the same component:

- `useViewer` should be called after `createViewer`

- `useViewer` will preferentially use the instance created by `createViewer` in the current component
  :::

## Behavior

- Passing a `Viewer` instance reuses it and does not destroy it on unmount.
- Passing an element plus options creates a new `Viewer` and destroys it automatically when the component scope ends.
- If the canvas is removed from the DOM, the injected viewer reference is cleared so consumers do not keep using a stale instance.

```ts
// Overload 1: Creates a new instance, which is automatically destroyed when the component unmounts
const viewer = createViewer(elRef, {
  // ...options
});

// Overload 2: Injects an existing instance, which is not automatically destroyed when the component unmounts
const viewer = createViewer(window.viewer);

// After creating an instance, the current component and its descendant components can access the instance using useViewer
const viewer = useViewer();
```
