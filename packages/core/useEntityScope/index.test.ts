import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { useEntityScope } from '../index';

const mocks = vi.hoisted(() => ({
  add: vi.fn(e => e),
  remove: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    entities = {
      add: mocks.add,
      remove: mocks.remove,
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer };
});

describe('useEntityScope', () => {
  it('should add entity to scope and collection', async () => {
    mocks.add.mockClear();
    const mockEntity = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, scope } = useEntityScope();
        add(mockEntity);
        return { scope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    expect(wrapper.vm.scope.has(mockEntity)).toBe(true);
    expect(mocks.add).toHaveBeenCalledWith(mockEntity);
  });

  it('should remove entity from collection on cleanup', async () => {
    mocks.remove.mockClear();
    const mockEntity = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = useEntityScope();
        add(mockEntity);
        return { removeScope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    wrapper.vm.removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockEntity);
  });
});
