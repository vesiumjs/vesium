import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add post process stage to scope and collection', async () => {
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

  it('should remove stage via removeScope', async () => {
    const mockStage = { id: 'test' } as any;
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePostProcessStageScope();
        add(mockStage);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope();
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

    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePostProcessStageScope({ destroyOnRemove: true });
        add(mockStage);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockStage);
    expect(mockDestroy).toHaveBeenCalled();
    mocks.remove.mockReset();
  });

  it('should not destroy stage when destroyOnRemove is false', async () => {
    // remove 必须返回 true，否则源码中 `removed && destroyOnRemove && destroy()` 会在第一项短路，测试无法触及 false 分支
    mocks.remove.mockClear();
    mocks.remove.mockReturnValue(true);
    const mockDestroy = vi.fn();
    const mockIsDestroyed = vi.fn(() => false);
    const mockStage = {
      id: 'test',
      destroy: mockDestroy,
      isDestroyed: mockIsDestroyed,
    } as any;

    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, removeScope } = usePostProcessStageScope({ destroyOnRemove: false });
        add(mockStage);
        return { removeScope };
      },
      template: '<div></div>',
    });

    await nextTick();
    (wrapper.vm as any).removeScope();
    expect(mocks.remove).toHaveBeenCalledWith(mockStage);
    expect(mockDestroy).not.toHaveBeenCalled();
    mocks.remove.mockReset();
  });

  it('should handle async stage add', async () => {
    const mockStage = { id: 'async' } as any;
    const asyncStage = Promise.resolve(mockStage);

    mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add } = usePostProcessStageScope();
        add(asyncStage);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mocks.add).toHaveBeenCalledWith(mockStage);
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        usePostProcessStageScope();
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
