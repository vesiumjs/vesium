import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { computed, defineComponent, h, nextTick, shallowRef } from 'vue';
import { createViewer } from '../../../core/createViewer';
import { PlotFeature } from '../PlotFeature';
import { PlotScheme } from '../PlotScheme';
import { SampledPlotProperty } from '../SampledPlotProperty';
import { useSkeleton } from '../useSkeleton';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    cesiumWidget = { canvas: document.createElement('canvas') };
    dataSources = new actual.DataSourceCollection();
    scene = {
      primitives: new actual.PrimitiveCollection(),
      groundPrimitives: new actual.PrimitiveCollection(),
    };

    container = { parentElement: document.createElement('div') };
    destroy = vi.fn();
    isDestroyed = vi.fn(() => false);
    constructor(_el?: any, _options?: any) {}
  }
  return {
    ...actual,
    Viewer,
  };
});

function createFeature(scheme: PlotScheme) {
  const sampled = new SampledPlotProperty({
    packables: [{
      time: new Cesium.JulianDate(),
      positions: [new Cesium.Cartesian3(0, 0, 0)],
    }],
  });
  return new PlotFeature({ scheme, sampled });
}

describe('useSkeleton stale graphics', () => {
  it('removes skeleton entities when render returns undefined', async () => {
    const scheme = new PlotScheme({
      type: `skeleton-test-${Date.now()}-${Math.random()}`,
      initRender: () => ({}),
      skeletons: [
        () => ({
          // Independent of `disabled`: verify that old graphics are cleaned up when render
          // returns undefined
          format: () => [new Cesium.Cartesian3(0, 0, 0)],
          render: ({ active }: { active: boolean }) => (active
            ? { position: new Cesium.Cartesian3(0, 0, 0), point: { pixelSize: 6 } }
            : undefined),
        }),
      ],
    });

    const viewerRef = shallowRef(new (Cesium as any).Viewer());
    const plotsRef = shallowRef<PlotFeature[]>([]);
    const current = shallowRef<PlotFeature>();

    const TestComponent = defineComponent({
      setup() {
        createViewer(viewerRef);
        useSkeleton(computed(() => plotsRef.value), current, () => new Cesium.JulianDate());
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    const entities = () => (viewerRef.value.dataSources.get(0) as any)?.entities?.values ?? [];
    const skeletonEntities = () => entities().filter((e: any) => e.plot instanceof PlotFeature);

    const feature = createFeature(scheme);
    plotsRef.value = [feature];
    await nextTick();
    await nextTick();

    // Skeleton points render while the feature is active
    current.value = feature;
    await nextTick();
    expect(skeletonEntities()).toHaveLength(1);

    // Deactivating must remove the skeleton points instead of leaving stale graphics behind
    current.value = undefined;
    await nextTick();
    expect(feature.skeletons).toHaveLength(0);
    expect(skeletonEntities()).toHaveLength(0);
  });
});
