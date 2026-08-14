# useGraphicEvent

Unified click, hover, and drag event listeners plus mouse cursor styles for Cesium graphics (Entity, Primitive, DataSource, etc.): `scene.pick` happens internally and callbacks fire only when the target graphic is hit. Listeners live in a `WeakMap` and are released automatically when the graphic is garbage collected or the component unmounts — no need to worry about leaks.

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useEntity, useGraphicEvent } from 'vesium';

const graphicEvent = useGraphicEvent();
useEntity(() => {
  const entity = new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(140, 10),
    point: { pixelSize: 15 }, // an entity with a graphic can be picked
  });
  graphicEvent.add(entity, 'LEFT_CLICK', ({ pick }) => {
    console.log('clicked', pick.id);
  });
  graphicEvent.add(entity, 'HOVER', ({ hovering }) => {
    entity.point!.color = new Cesium.ConstantProperty(hovering ? Cesium.Color.RED : Cesium.Color.WHITE);
  });
  return entity;
});
```

## Options (options of `add`)

- `cursor` - The cursor style on hover, defaults to `'pointer'`; can be a string or a function `(event: GraphicHoverEvent) => string | null | undefined`.
- `dragCursor` - The cursor style while dragging, defaults to `'crosshair'` (only takes effect for `DRAG` events, and only while dragging).

## Return Value

- `add(graphic, type, listener, options?)` - Registers a listener and returns a remove function; pass `'global'` as `graphic` to fire when any graphic is hit; `type` is `'HOVER'`, `'DRAG'`, or a positioned event type such as `'LEFT_CLICK'` (full list in the type definitions).
- `remove` / `clear` - Remove / clear the listeners of the given graphic; pass `'all'` as `clear`'s `type` to clear every listener on that graphic.
- Event payloads: positioned events are `{ event, pick }`; `HOVER` adds `hovering: boolean`; `DRAG` adds `dragging: boolean` and `lockCamera()`.

## Notes

- `graphic` can be any object pickable by `scene.pick` (`Entity`, `Primitive`, `DataSource`, etc.); `'global'` is stored under an internal symbol, so clean it up explicitly via `remove`/`clear` or the remove function returned by `add`. No need to worry about leaks: listeners in the `WeakMap` are released when the graphic is garbage collected, and the internal screen events stop on component unmount.

## Type Definitions

:::dts ./index.ts
:::
