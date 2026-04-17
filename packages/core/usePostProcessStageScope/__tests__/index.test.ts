import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { usePostProcessStageScope } from '../../index';

const mocks = vi.hoisted(() => ({
  add: vi.fn(i => i),
  remove: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    postProcessStages = {
      add: mocks.add,
      remove: mocks.remove,
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer };
});

describe('usePostProcessStageScope', () => {
  it('should add post process stage to scope and collection', async () => {
    mocks.add.mockClear();
    const mockStage = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, scope } = usePostProcessStageScope();
        add(mockStage);
        return { scope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    expect(wrapper.vm.scope.has(mockStage)).toBe(true);
    expect(mocks.add).toHaveBeenCalledWith(mockStage);
  });

  it('should remove stage on cleanup', async () => {
    mocks.remove.mockClear();
    const mockStage = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePostProcessStageScope();
        add(mockStage);
        return { removeScope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    wrapper.vm.removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockStage);
  });

  it('should destroy stage when destroyOnRemove is true', async () => {
    mocks.remove.mockReturnValue(true);
    const mockDestroy = vi.fn();
    const mockIsDestroyed = vi.fn(() => false);
    const mockStage = {
      id: 'test',
      destroy: mockDestroy,
      isDestroyed: mockIsDestroyed,
    } as any;

    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePostProcessStageScope({ destroyOnRemove: true });
        add(mockStage);
        return { removeScope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    wrapper.vm.removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockStage);
    expect(mockDestroy).toHaveBeenCalled();
    mocks.remove.mockReset();
  });

  it('should not destroy stage when destroyOnRemove is false', async () => {
    mocks.remove.mockClear();
    const mockDestroy = vi.fn();
    const mockIsDestroyed = vi.fn(() => false);
    const mockStage = {
      id: 'test',
      destroy: mockDestroy,
      isDestroyed: mockIsDestroyed,
    } as any;

    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePostProcessStageScope({ destroyOnRemove: false });
        add(mockStage);
        return { removeScope };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    wrapper.vm.removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockStage);
    expect(mockDestroy).not.toHaveBeenCalled();
  });
});
