import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createViewer } from '../createViewer';
import { useScreenSpaceEventHandler } from '../index';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  const mockSetInputAction = vi.fn();
  const mockRemoveInputAction = vi.fn();
  const mockDestroy = vi.fn();

  class ScreenSpaceEventHandler {
    setInputAction = mockSetInputAction;
    removeInputAction = mockRemoveInputAction;
    destroy = mockDestroy;
    constructor(_canvas?: any) {}
  }

  class Viewer {
    cesiumWidget = {
      canvas: document.createElement('canvas'),
    };

    destroy = vi.fn();
    isDestroyed = vi.fn(() => false);
    canvas = document.createElement('canvas');
    constructor(_el?: any, _options?: any) {}
  }

  return {
    ...actual,
    Viewer,
    ScreenSpaceEventHandler,
  };
});

describe('useScreenSpaceEventHandler', () => {
  it('should set input action on handler', async () => {
    const action = vi.fn();
    const type = Cesium.ScreenSpaceEventType.LEFT_CLICK;

    mount({
      setup() {
        createViewer(document.createElement('div'));
        useScreenSpaceEventHandler(type, action);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    const handler = new Cesium.ScreenSpaceEventHandler();
    expect(handler.setInputAction).toHaveBeenCalledWith(action, type, undefined);
  });

  it('should remove action on cleanup', async () => {
    const action = vi.fn();
    const type = Cesium.ScreenSpaceEventType.LEFT_CLICK;
    const active = ref(true);

    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        useScreenSpaceEventHandler(type, action, { isActive: active });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    const handler = new Cesium.ScreenSpaceEventHandler();

    active.value = false;
    await nextTick();
    expect(handler.removeInputAction).toHaveBeenCalledWith(type, undefined);
    wrapper.unmount();
  });
});
