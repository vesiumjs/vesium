---
text: useScreenSpaceEventHandler
---

# useScreenSpaceEventHandler

Use Cesium's `ScreenSpaceEventHandler` in a Vue-friendly way for mouse/touch screen-space events: the handler is recreated automatically when the canvas changes; listeners are re-registered when the event type or modifier changes; it is destroyed on component unmount. Use it for clicks, movement, wheel, pinch gestures, etc., with the event type changeable at runtime.

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useScreenSpaceEventHandler } from 'vesium';

const stop = useScreenSpaceEventHandler(
  Cesium.ScreenSpaceEventType.LEFT_CLICK,
  (event) => {
    console.log(event.position); // positioned events carry the screen position
  },
  { modifier: Cesium.KeyboardEventModifier.SHIFT }, // fire only while Shift is held
);

stop(); // cleanup is automatic on unmount; you can also stop manually
```

## Options

- `type` - The screen-space event type (`Cesium.ScreenSpaceEventType`); supports a ref/getter for dynamic changes. The callback argument type is derived from `type` (positioned events such as clicks receive a `PositionedEvent`, `MOUSE_MOVE` a `MotionEvent`, `WHEEL` a `number`, pinch gestures a `TwoPointEvent` / `TwoPointMotionEvent`). Nothing is registered when omitted.
- `inputAction` - The listener callback; nothing is registered when omitted.
- `modifier` - The modifier key(s) forwarded to Cesium; an array requires all listed keys to be held. Supports ref/getter for dynamic changes.
- `isActive` - Whether the listener is active, defaults to `true`; it only pauses/resumes listener registration without recreating the whole composable.

## Return Value

- Returns a stop function (`WatchStopHandle`): calling it stops the current listener and destroys the handler immediately; it is also called automatically on component unmount.

## Notes

- The handler is created on top of the canvas: when the canvas changes (e.g. the viewer is recreated), the old instance is destroyed and a new one is created automatically — no manual handling needed.

## Type Definitions

:::dts ./index.ts
:::
