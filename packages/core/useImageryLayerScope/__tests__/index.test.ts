import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { useImageryLayerScope } from '../../index';

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
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer };
});

describe('useImageryLayerScope', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add imagery layer to scope and collection', async () => {
    const mockLayer = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, scope } = useImageryLayerScope();
        add(mockLayer, 1);
        return { scope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    expect(wrapper.vm.scope.has(mockLayer)).toBe(true);
    expect(mocks.add).toHaveBeenCalledWith(mockLayer, 1);
  });

  it('should remove layer with destroyOnRemove via removeScope', async () => {
    const mockLayer = { id: 'test' } as any;
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = useImageryLayerScope({ destroyOnRemove: true });
        add(mockLayer);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope(true as boolean | undefined);
    expect(mocks.remove).toHaveBeenCalledWith(mockLayer, true);
  });

  it('should support destroyOnRemove: false', async () => {
    const mockLayer = { id: 'test' } as any;
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = useImageryLayerScope({ destroyOnRemove: false });
        add(mockLayer);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope(false as boolean | undefined);
    expect(mocks.remove).toHaveBeenCalledWith(mockLayer, false);
  });

  it('should handle async layer add', async () => {
    const mockLayer = { id: 'async' } as any;
    const asyncLayer = Promise.resolve(mockLayer);

    mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add } = useImageryLayerScope();
        add(asyncLayer);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mocks.add).toHaveBeenCalledWith(mockLayer, undefined);
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useImageryLayerScope();
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
