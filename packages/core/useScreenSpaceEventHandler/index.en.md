---
text: useScreenSpaceEventHandler
---

# useScreenSpaceEventHandler

Use Cesium's `ScreenSpaceEventHandler` in a Vue-friendly way.

The handler is recreated when the canvas or tracked inputs change, and it is destroyed automatically when the component scope is disposed.

## Usage

:::demo src="./demo.vue"
:::

```ts
const stop = useScreenSpaceEventHandler(
  Cesium.ScreenSpaceEventType.LEFT_CLICK,
  (event) => {
    console.log(event.position);
  },
  {
    modifier: Cesium.KeyboardEventModifier.SHIFT,
    isActive: true,
  },
);

// later
stop();
```

## Notes

- The composable returns a stop function, so calling it tears down the current handler immediately.
- `isActive` pauses listener registration without forcing a full recreation.
- `modifier` is forwarded to Cesium's keyboard modifier argument.

## Type Definitions

:::dts ./index.ts
