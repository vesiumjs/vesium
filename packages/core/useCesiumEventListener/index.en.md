# useCesiumEventListener

Reactively subscribe to events on `Cesium.Event` instances: the listener is re-registered automatically when the dependencies change (e.g. the viewer is recreated) and destroyed on component unmount. Use it for any `Cesium.Event` such as `camera.moveStart` or `scene.postRender`, or to subscribe to several events at once.

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useCesiumEventListener, useViewer } from 'vesium';

const viewer = useViewer();

// Pass a getter when the event instance may not be ready or may change
useCesiumEventListener(() => viewer.value?.camera.moveEnd, () => {
  console.log('Camera move end');
});

// Arrays are supported: subscribe to multiple events at once
useCesiumEventListener(() => [viewer.value?.scene.preRender, viewer.value?.scene.postRender], () => {});
```

:::tip Suggestion
Events are often triggered by real-time frame rendering, which may cause invalid refreshing of Vue's reactivity, so throttling the listeners is recommended. Use the `throttle` function from `@vesium/shared` or [refThrottled](https://vueuse.org/shared/refThrottled/) from VueUse.
:::

## Options

- `isActive` - Whether the listener is active, defaults to `true`; when `false` nothing is registered and the subscription resumes automatically once it becomes `true`. Supports a ref or getter for dynamic control.

## Return Value

- Returns a stop function (`WatchStopHandle`): calling it removes all currently registered listeners immediately; it is also called automatically on component unmount, so no manual cleanup is needed.

## Notes

- `event` accepts a single `Cesium.Event` or an array of them; each entry may be `undefined`, a ref, or a getter, and the listener is re-registered automatically when the dependencies change.

## Type Definitions

:::dts ./index.ts
:::
