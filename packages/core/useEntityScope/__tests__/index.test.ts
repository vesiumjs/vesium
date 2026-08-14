import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { useEntityScope } from '../../index';

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add entity to scope and collection', async () => {
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

  it('should remove entity from collection via removeScope', async () => {
    const mockEntity = { id: 'test' } as any;
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = useEntityScope();
        add(mockEntity);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockEntity);
  });

  it('should handle async entity add', async () => {
    const mockEntity = { id: 'async' } as any;
    const asyncEntity = Promise.resolve(mockEntity);

    mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add } = useEntityScope();
        add(asyncEntity);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mocks.add).toHaveBeenCalledWith(mockEntity);
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useEntityScope();
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
