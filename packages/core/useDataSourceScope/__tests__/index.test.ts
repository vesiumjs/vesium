import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { useDataSourceScope } from '../../index';

const mocks = vi.hoisted(() => ({
  add: vi.fn(ds => ds),
  remove: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    dataSources = {
      add: mocks.add,
      remove: mocks.remove,
      isDestroyed: () => false,
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer };
});

describe('useDataSourceScope', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add dataSource to scope and collection', async () => {
    const mockDs = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, scope } = useDataSourceScope();
        add(mockDs);
        return { scope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    expect(wrapper.vm.scope.has(mockDs)).toBe(true);
    expect(mocks.add).toHaveBeenCalledWith(mockDs);
  });

  it('should remove dataSource via removeScope', async () => {
    const mockDs = { id: 'test' } as any;
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = useDataSourceScope();
        add(mockDs);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockDs, undefined);
  });

  it('should handle async dataSource add', async () => {
    const mockDs = { id: 'async' } as any;
    const asyncDs = Promise.resolve(mockDs);

    mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add } = useDataSourceScope();
        add(asyncDs);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mocks.add).toHaveBeenCalledWith(mockDs);
  });

  it('should pass destroyOnRemove option as default remove arg', async () => {
    const mockDs = { id: 'test' } as any;
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = useDataSourceScope({ destroyOnRemove: true });
        add(mockDs);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockDs, true);
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useDataSourceScope();
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
