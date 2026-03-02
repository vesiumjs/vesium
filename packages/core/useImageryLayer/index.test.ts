import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { createViewer } from '../createViewer';
import { useImageryLayer } from '../index';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  const mockAdd = vi.fn();
  const mockRemove = vi.fn();
  const mockLayers = {
    add: mockAdd,
    remove: mockRemove,
    isDestroyed: () => false,
  };
  class Viewer {
    imageryLayers = mockLayers;
    destroy = vi.fn();
    isDestroyed = vi.fn(() => false);
    canvas = document.createElement('canvas');
    constructor(_el?: any, _options?: any) {}
  }
  class ImageryLayer {
    isDestroyed = () => false;
    constructor(_provider?: any) {}
  }
  return {
    ...actual,
    Viewer,
    ImageryLayer,
  };
});

describe('useImageryLayer', () => {
  it('should add imagery layer to viewer', async () => {
    const mockLayer = new Cesium.ImageryLayer({} as any) as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        useImageryLayer(mockLayer);
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    await nextTick();
    const viewer = new Cesium.Viewer(document.createElement('div'));
    expect(viewer.imageryLayers.add).toHaveBeenCalledWith(mockLayer, undefined);
  });

  it('should support index parameter', async () => {
    const mockLayer = new Cesium.ImageryLayer({} as any) as any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useImageryLayer(mockLayer, { index: 1 });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    const viewer = new Cesium.Viewer(document.createElement('div'));
    expect(viewer.imageryLayers.add).toHaveBeenCalledWith(mockLayer, 1);
  });

  it('should remove layer on cleanup', async () => {
    const mockLayer = new Cesium.ImageryLayer({} as any) as any;
    const active = ref(true);
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        useImageryLayer(mockLayer, { isActive: active });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    active.value = false;
    await nextTick();
    const viewer = new Cesium.Viewer(document.createElement('div'));
    expect(viewer.imageryLayers.remove).toHaveBeenCalledWith(mockLayer, undefined);
    wrapper.unmount();
  });
});
