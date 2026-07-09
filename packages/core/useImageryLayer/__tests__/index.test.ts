import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createViewer } from '../../createViewer';
import { useImageryLayer } from '../../index';

const mocks = vi.hoisted(() => ({
  add: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    imageryLayers = {
      add: mocks.add,
      remove: mocks.remove,
      isDestroyed: () => false,
    };

    destroy = vi.fn();
    isDestroyed = vi.fn(() => false);
    canvas = document.createElement('canvas');
    constructor(_el?: any, _options?: any) {}
  }
  return {
    ...actual,
    Viewer,
  };
});

describe('useImageryLayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add imagery layer to viewer', async () => {
    const mockLayer = { isDestroyed: () => false } as any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useImageryLayer(mockLayer);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mocks.add).toHaveBeenCalledWith(mockLayer, undefined);
  });

  it('should support index parameter', async () => {
    const mockLayer = { isDestroyed: () => false } as any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useImageryLayer(mockLayer, { index: 1 });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mocks.add).toHaveBeenCalledWith(mockLayer, 1);
  });

  it('should remove layer on isActive toggle', async () => {
    const mockLayer = { isDestroyed: () => false } as any;
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
    expect(mocks.remove).toHaveBeenCalledWith(mockLayer, undefined);
    wrapper.unmount();
  });

  it('should re-add layer when isActive becomes true again', async () => {
    const mockLayer = { isDestroyed: () => false } as any;
    const active = ref(false);
    mocks.add.mockClear();
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useImageryLayer(mockLayer, { isActive: active });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mocks.add).not.toHaveBeenCalled();

    active.value = true;
    await nextTick();
    expect(mocks.add).toHaveBeenCalledWith(mockLayer, undefined);
  });

  it('should handle async getter layer source', async () => {
    const mockLayer = { isDestroyed: () => false } as any;
    const asyncGetter = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return mockLayer;
    };

    mount({
      setup() {
        createViewer(document.createElement('div'));
        useImageryLayer(asyncGetter);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 30));
    await nextTick();
    expect(mocks.add).toHaveBeenCalledWith(mockLayer, undefined);
  });

  it('should handle empty array gracefully', async () => {
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useImageryLayer([]);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mocks.add).not.toHaveBeenCalled();
  });

  it('should handle undefined layer gracefully', async () => {
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useImageryLayer(undefined);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    await nextTick();
    expect(mocks.add).not.toHaveBeenCalled();
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useImageryLayer({ isDestroyed: () => false } as any);
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
