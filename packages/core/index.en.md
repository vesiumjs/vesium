---
text: core
subText: Cesium core hooks
sort: 0
---

# core

The core package provides the viewer lifecycle, reactive Cesium collections, scene interaction hooks, and lower-level scope helpers.

## Quick Start

```ts
import { ref } from 'vue';
import { createViewer, useViewer } from '@vesium/core';

const elRef = ref<HTMLElement>();
createViewer(elRef);
const viewer = useViewer();
```

## Viewer and Lifecycle

- `createViewer` creates or reuses a Cesium Viewer instance.
- `useViewer` retrieves the injected Viewer instance.
- `toPromiseValue` normalizes values, getters, and promises into a Promise.

## Reactive Collections

- `useEntity`, `useDataSource`, `useImageryLayer`, `usePrimitive`, and `usePostProcessStage` reactively add Cesium objects to their collections.
- `useEntityScope`, `useDataSourceScope`, `useImageryLayerScope`, `usePrimitiveScope`, and `usePostProcessStageScope` provide the lower-level scoped add/remove primitives behind those hooks.
- `useCollectionScope` is the shared utility used by the scope helpers.

## Scene and Events

- `useCesiumEventListener` binds Cesium event listeners reactively.
- `useScreenSpaceEventHandler` binds screen-space events reactively.
- `useGraphicEvent` coordinates graphic hover, drag, and click behaviors.
- `useScenePick` and `useSceneDrillPick` perform scene picking.
- `useCameraState` exposes camera-derived state.

## UI Helpers

- `useCesiumFps` tracks Cesium frame rate.
- `useScaleBar` renders a scale bar that reacts to camera and container changes.
- `useElementOverlay` anchors DOM overlays to world positions.

## Shared Utilities

- `@vesium/shared` is re-exported from `@vesium/core`, so coordinate and property helpers are available here too.

## Type Definitions

:::dts ./index.ts
