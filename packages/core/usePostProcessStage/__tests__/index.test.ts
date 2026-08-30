import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createViewer } from '../../createViewer';
import { usePostProcessStage } from '../../index';

const mocks = vi.hoisted(() => ({
  add: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    scene = {
      postProcessStages: {
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

describe('usePostProcessStage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add post process stage to viewer', async () => {
    const mockStage = { id: 'test' } as any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        usePostProcessStage(mockStage);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mocks.add).toHaveBeenCalledWith(mockStage);
  });

  it('should remove stage on cleanup', async () => {
    const mockStage = { id: 'test' } as any;
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        usePostProcessStage(mockStage);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    wrapper.unmount();
    expect(mocks.remove).toHaveBeenCalledWith(mockStage);
  });

  it('should handle isActive toggle', async () => {
    const mockStage = { id: 'test' } as any;
    const active = ref(true);
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        usePostProcessStage(mockStage, { isActive: active });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    active.value = false;
    await nextTick();
    expect(mocks.remove).toHaveBeenCalledWith(mockStage);
    wrapper.unmount();
  });

  it('should re-add stage when isActive becomes true again', async () => {
    const mockStage = { id: 'test' } as any;
    const active = ref(false);
    mount({
      setup() {
        createViewer(document.createElement('div'));
        usePostProcessStage(mockStage, { isActive: active });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mocks.add).not.toHaveBeenCalled();

    active.value = true;
    await nextTick();
    expect(mocks.add).toHaveBeenCalledWith(mockStage);
  });

  it('should skip a destroyed stage when isActive becomes true again', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mockStage = { id: 'test', isDestroyed: () => true } as any;
    const active = ref(false);
    mount({
      setup() {
        createViewer(document.createElement('div'));
        usePostProcessStage(mockStage, { isActive: active });
        return {};
      },
      template: '<div></div>',
    });

    active.value = true;
    await nextTick();
    expect(mocks.add).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it('should handle async getter stage source', async () => {
    const mockStage = { id: 'async-stage' } as any;
    const asyncGetter = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return mockStage;
    };

    mount({
      setup() {
        createViewer(document.createElement('div'));
        usePostProcessStage(asyncGetter);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 30));
    await nextTick();
    expect(mocks.add).toHaveBeenCalledWith(mockStage);
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        usePostProcessStage({ id: 'test' } as any);
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
