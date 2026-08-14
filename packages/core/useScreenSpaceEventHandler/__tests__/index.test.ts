import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createViewer } from '../../createViewer';
import { useScreenSpaceEventHandler } from '../../index';

const mocks = vi.hoisted(() => ({
  setInputAction: vi.fn(),
  removeInputAction: vi.fn(),
  destroy: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class ScreenSpaceEventHandler {
    setInputAction = mocks.setInputAction;
    removeInputAction = mocks.removeInputAction;
    destroy = mocks.destroy;
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    expect(mocks.setInputAction).toHaveBeenCalledWith(action, type, undefined);
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
    active.value = false;
    await nextTick();
    expect(mocks.removeInputAction).toHaveBeenCalledWith(type, undefined);
    wrapper.unmount();
  });

  it('should destroy handler on unmount', async () => {
    const action = vi.fn();
    const type = Cesium.ScreenSpaceEventType.LEFT_CLICK;

    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        useScreenSpaceEventHandler(type, action);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    wrapper.unmount();
    expect(mocks.destroy).toHaveBeenCalled();
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useScreenSpaceEventHandler(Cesium.ScreenSpaceEventType.LEFT_CLICK, vi.fn());
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
