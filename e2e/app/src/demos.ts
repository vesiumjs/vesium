import type { Component } from 'vue';

export interface DemoRoute {
  path: string;
  label: string;
  component: Component;
  host?: boolean;
}

/**
 * Demos that create their own viewer and don't need the host wrapper, which
 * provides the viewer through `cesium-container.vue` (e2e mode).
 */
const HOST_EXCLUDED = new Set(['core/createViewer']);

/**
 * Each route mounts one docs demo component (the demo.vue files inside the
 * packages directory) as the e2e test scene. Demos are discovered via Vite's
 * glob import, so new demos are picked up automatically.
 *
 * `useElementOverlay` is registered for manual browsing only and has no automated e2e test:
 * its demo requires Cesium world terrain (network + Ion token), which the offline e2e host
 * cannot provide.
 */
const demoModules = import.meta.glob<{ default: Component }>(
  '../../../packages/**/demo.vue',
  { eager: true },
);

export const demoRoutes: DemoRoute[] = Object.entries(demoModules).map(([file, module]) => {
  // e.g. '../../../packages/core/useEntity/demo.vue' -> 'core/useEntity'
  const id = file.replace(/^.*\/packages\//, '').replace(/\/demo\.vue$/, '');
  const [pkg, ...rest] = id.split('/');
  const label = rest.length === 0 ? pkg : pkg === 'core' ? rest.join('/') : `${pkg}: ${rest.join('/')}`;

  return {
    path: `/${id}`,
    label,
    component: module.default,
    host: !HOST_EXCLUDED.has(id),
  };
});
