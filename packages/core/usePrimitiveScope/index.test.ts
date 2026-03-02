import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { usePrimitiveScope } from '../index';

const mocks = vi.hoisted(() => ({
  add: vi.fn(p => p),
  remove: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    scene = {
      primitives: {
        add: mocks.add,
        remove: mocks.remove,
      },
      groundPrimitives: {
        add: mocks.add,
        remove: mocks.remove,
      },
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer };
});

describe('usePrimitiveScope', () => {
  it('should add primitive to scope and collection', async () => {
    mocks.add.mockClear();
    const mockPrimitive = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, scope } = usePrimitiveScope();
        add(mockPrimitive);
        return { scope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    expect(wrapper.vm.scope.has(mockPrimitive)).toBe(true);
    expect(mocks.add).toHaveBeenCalledWith(mockPrimitive);
  });

  it('should handle ground primitives', async () => {
    mocks.add.mockClear();
    const mockPrimitive = { id: 'test' } as any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add } = usePrimitiveScope({ collection: 'ground' });
        add(mockPrimitive);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mocks.add).toHaveBeenCalledWith(mockPrimitive);
  });

  it('should remove primitive on cleanup', async () => {
    mocks.remove.mockClear();
    const mockPrimitive = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePrimitiveScope();
        add(mockPrimitive);
        return { removeScope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    wrapper.vm.removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockPrimitive);
  });
});
