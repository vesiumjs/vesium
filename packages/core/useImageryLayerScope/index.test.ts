import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { useImageryLayerScope } from '../index';

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
  it('should add imagery layer to scope and collection', async () => {
    mocks.add.mockClear();
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

  it('should remove layer on cleanup', async () => {
    mocks.remove.mockClear();
    const mockLayer = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = useImageryLayerScope({ destroyOnRemove: true });
        add(mockLayer);
        return { removeScope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    wrapper.vm.removeScope(true);
    expect(mocks.remove).toHaveBeenCalledWith(mockLayer, true);
  });
});
