---
sort: 0
subText: Core Hooks
---

# Overview

The `vesium` package (`packages/core`) provides Vue Composition API hooks that bridge Cesium lifecycle and scene objects into Vue reactivity: hooks register and clean up Cesium objects automatically, release resources on component unmount, and drive scene updates from data changes.

## Exports

### Viewer lifecycle

Use these when you need to create the Viewer and share it with the current component and its descendants.

- `createViewer` — create and manage a `Cesium.Viewer` instance
- `useViewer` — retrieve the `Viewer` instance injected by the current or an ancestor component

### Events & picking

Use these when you need to respond to mouse / screen-space interaction or pick scene objects on click.

- `useCesiumEventListener` — subscribe to Cesium event objects; auto re-subscribes or destroys the listener on dependency change or unmount
- `useScreenSpaceEventHandler` — listen to canvas screen-space events; auto rebuilds or destroys the handler on dependency change or unmount
- `useGraphicEvent` — unified click / hover / drag events over scene graphics
- `useScenePick` — reactive `scene.pick` results at a screen position
- `useSceneDrillPick` — reactive `scene.drillPick` results through overlapping objects

### Scoped collections

Use these when you want collection add/remove operations scoped to the component lifecycle.

- `useCollectionScope` — scope collection add/remove to the component lifecycle
- `useDataSourceScope` — scoped data source collection management; auto removes on unmount
- `useEntityScope` — scoped entity collection management; auto removes `Entity` instances on unmount
- `useImageryLayerScope` — scoped imagery layer collection management; auto removes `ImageryLayer` instances on unmount
- `usePostProcessStageScope` — scoped post-process stage collection management; auto removes `PostProcessStage` instances on unmount
- `usePrimitiveScope` — scoped primitive collection management; auto removes and destroys `Primitive` instances on unmount

### Data sources & graphics

Use these when you need to load data sources or create graphic objects that sync with the scene as data changes.

- `useDataSource` — load and manage data sources; activation controlled by `isActive`
- `useEntity` — create and synchronize `Entity` instances; activation controlled by `isActive`
- `useImageryLayer` — manage imagery layers; activation controlled by `isActive`
- `usePrimitive` — manage primitives; activation controlled by `isActive` (recipes for `GeoJsonPrimitive` / `MVTDataProvider` / `Cesium3DTileset` / panoramas — see `usePrimitive` docs)
- `usePostProcessStage` — manage post-process stages; activation controlled by `isActive`

### Camera & UI

Use these when you need to track the camera, show performance or scale info, or overlay HTML at a scene position.

- `useCameraState` — reactive camera state (heading, pitch, roll, position), throttled
- `useCesiumFps` — FPS and frame interval tracking
- `useElementOverlay` — overlay HTML elements on scene positions
- `useScaleBar` — scale bar with a distance label

### Utilities

- `toPromiseValue` — normalize sync / async values into a promise
