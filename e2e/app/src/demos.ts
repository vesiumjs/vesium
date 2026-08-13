import type { Component } from 'vue';
import CreateViewerDemo from '../../../packages/core/createViewer/demo.vue';
import UseCameraStateDemo from '../../../packages/core/useCameraState/demo.vue';
import UseCesiumEventListenerDemo from '../../../packages/core/useCesiumEventListener/demo.vue';
import UseCesiumFpsDemo from '../../../packages/core/useCesiumFps/demo.vue';
import UseDataSourceDemo from '../../../packages/core/useDataSource/demo.vue';
import UseElementOverlayDemo from '../../../packages/core/useElementOverlay/demo.vue';
import UseEntityDemo from '../../../packages/core/useEntity/demo.vue';
import UseGraphicEventDemo from '../../../packages/core/useGraphicEvent/demo.vue';
import UseImageryLayerDemo from '../../../packages/core/useImageryLayer/demo.vue';
import UsePostProcessStageDemo from '../../../packages/core/usePostProcessStage/demo.vue';
import UsePrimitiveDemo from '../../../packages/core/usePrimitive/demo.vue';
import UseScaleBarDemo from '../../../packages/core/useScaleBar/demo.vue';
import UseSceneDrillPickDemo from '../../../packages/core/useSceneDrillPick/demo.vue';
import UseScenePickDemo from '../../../packages/core/useScenePick/demo.vue';
import UseScreenSpaceEventHandlerDemo from '../../../packages/core/useScreenSpaceEventHandler/demo.vue';
import GeometryDemo from '../../../packages/geometry/demo.vue';
import MeasureDemo from '../../../packages/plot/measure/demo.vue';
import SchemeDemo from '../../../packages/plot/scheme/demo.vue';
import SkeletonDemo from '../../../packages/plot/skeleton/demo.vue';
import UsePlotDemo from '../../../packages/plot/usePlot/demo.vue';

export interface DemoRoute {
  path: string;
  label: string;
  component: Component;
  host?: boolean;
}

/**
 * Each route mounts one docs demo component (the demo.vue files inside the
 * packages directory) as the e2e test scene. `host: true` wraps the demo in
 * `demo-host.vue`, which provides the viewer through `cesium-container.vue`
 * (e2e mode).
 *
 * `useElementOverlay` is registered for manual browsing only and has no automated e2e test:
 * its demo requires Cesium world terrain (network + Ion token), which the offline e2e host
 * cannot provide.
 */
export const demoRoutes: DemoRoute[] = [
  { path: '/core/createViewer', label: 'createViewer', component: CreateViewerDemo },
  { path: '/core/useCameraState', label: 'useCameraState', component: UseCameraStateDemo, host: true },
  { path: '/core/useCesiumEventListener', label: 'useCesiumEventListener', component: UseCesiumEventListenerDemo, host: true },
  { path: '/core/useCesiumFps', label: 'useCesiumFps', component: UseCesiumFpsDemo, host: true },
  { path: '/core/useDataSource', label: 'useDataSource', component: UseDataSourceDemo, host: true },
  { path: '/core/useElementOverlay', label: 'useElementOverlay', component: UseElementOverlayDemo, host: true },
  { path: '/core/useEntity', label: 'useEntity', component: UseEntityDemo, host: true },
  { path: '/core/useGraphicEvent', label: 'useGraphicEvent', component: UseGraphicEventDemo, host: true },
  { path: '/core/useImageryLayer', label: 'useImageryLayer', component: UseImageryLayerDemo, host: true },
  { path: '/core/usePostProcessStage', label: 'usePostProcessStage', component: UsePostProcessStageDemo, host: true },
  { path: '/core/usePrimitive', label: 'usePrimitive', component: UsePrimitiveDemo, host: true },
  { path: '/core/useScaleBar', label: 'useScaleBar', component: UseScaleBarDemo, host: true },
  { path: '/core/useSceneDrillPick', label: 'useSceneDrillPick', component: UseSceneDrillPickDemo, host: true },
  { path: '/core/useScenePick', label: 'useScenePick', component: UseScenePickDemo, host: true },
  { path: '/core/useScreenSpaceEventHandler', label: 'useScreenSpaceEventHandler', component: UseScreenSpaceEventHandlerDemo, host: true },
  { path: '/geometry', label: 'geometry', component: GeometryDemo, host: true },
  { path: '/plot/measure', label: 'plot: measure', component: MeasureDemo, host: true },
  { path: '/plot/scheme', label: 'plot: scheme', component: SchemeDemo, host: true },
  { path: '/plot/skeleton', label: 'plot: skeleton', component: SkeletonDemo, host: true },
  { path: '/plot/usePlot', label: 'plot: usePlot', component: UsePlotDemo, host: true },
];
