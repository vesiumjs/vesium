import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { useDataSourceScope } from '../index';

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
  it('should add dataSource to scope and collection', async () => {
    mocks.add.mockClear();
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

  it('should remove dataSource on cleanup with destroyOnRemove', async () => {
    mocks.remove.mockClear();
    const mockDs = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = useDataSourceScope({ destroyOnRemove: true });
        add(mockDs);
        return { removeScope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    // Manually trigger removeScope to test logic,
    // since tryOnScopeDispose is hard to sync in VTU unmount
    wrapper.vm.removeScope(true);
    expect(mocks.remove).toHaveBeenCalledWith(mockDs, true);
  });
});
