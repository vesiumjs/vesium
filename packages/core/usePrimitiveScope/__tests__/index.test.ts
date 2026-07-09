import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { usePrimitiveScope } from '../../index';

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add primitive to scope and collection', async () => {
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

  it('should remove primitive via removeScope', async () => {
    const mockPrimitive = { id: 'test' } as any;
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePrimitiveScope();
        add(mockPrimitive);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockPrimitive);
  });

  it('should destroy primitive when destroyOnRemove is true', async () => {
    mocks.remove.mockReturnValue(true);
    const mockDestroy = vi.fn();
    const mockIsDestroyed = vi.fn(() => false);
    const mockPrimitive = {
      id: 'test',
      destroy: mockDestroy,
      isDestroyed: mockIsDestroyed,
    } as any;

    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePrimitiveScope({ destroyOnRemove: true });
        add(mockPrimitive);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockPrimitive);
    expect(mockDestroy).toHaveBeenCalled();
    mocks.remove.mockReset();
  });

  it('should not destroy primitive when destroyOnRemove is false', async () => {
    const mockDestroy = vi.fn();
    const mockIsDestroyed = vi.fn(() => false);
    const mockPrimitive = {
      id: 'test',
      destroy: mockDestroy,
      isDestroyed: mockIsDestroyed,
    } as any;

    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePrimitiveScope({ destroyOnRemove: false });
        add(mockPrimitive);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockPrimitive);
    expect(mockDestroy).not.toHaveBeenCalled();
  });

  it('should handle async primitive add', async () => {
    const mockPrimitive = { id: 'async' } as any;
    const asyncPrimitive = Promise.resolve(mockPrimitive);

    mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add } = usePrimitiveScope();
        add(asyncPrimitive);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mocks.add).toHaveBeenCalledWith(mockPrimitive);
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        usePrimitiveScope();
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
