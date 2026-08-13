---
subText: Core Hooks
---

# Overview

The `vesium` package (`packages/core`) provides Vue Composition API hooks that bridge Cesium lifecycle and scene objects into Vue reactivity.

## Exports

### Viewer lifecycle

- `createViewer` — create and manage a `Cesium.Viewer` instance
- `useViewer` — retrieve the `Viewer` instance injected by `createViewer`

### Events & picking

- `useCesiumEventListener` — subscribe to Cesium event objects
- `useScreenSpaceEventHandler` — listen to canvas screen-space events
- `useGraphicEvent` — unified click / hover / drag events over scene graphics
- `useScenePick` — reactive `scene.pick` results at a screen position
- `useSceneDrillPick` — reactive `scene.drillPick` results through overlapping objects

### Scoped collections

- `useCollectionScope` — scope collection add/remove to the component lifecycle
- `useDataSourceScope` — scoped data source collection management
- `useEntityScope` — scoped entity collection management
- `useImageryLayerScope` — scoped imagery layer collection management
- `usePostProcessStageScope` — scoped post-process stage collection management
- `usePrimitiveScope` — scoped primitive collection management

### Data sources & graphics

- `useDataSource` — load and manage data sources (e.g. GeoJSON)
- `useEntity` — create and synchronize `Entity` instances
- `useImageryLayer` — manage imagery layers
- `usePrimitive` — manage primitives
- `usePostProcessStage` — manage post-process stages

### Camera & UI

- `useCameraState` — reactive camera state (heading, pitch, roll, position)
- `useCesiumFps` — FPS and frame interval tracking
- `useElementOverlay` — overlay HTML elements on scene positions
- `useScaleBar` — scale bar with a distance label

### Utilities

- `toPromiseValue` — normalize sync / async values into a promise
