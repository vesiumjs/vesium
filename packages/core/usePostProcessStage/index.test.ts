import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { usePostProcessStage } from '../index';

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
  it('should add post process stage to viewer', async () => {
    mocks.add.mockClear();
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
    mocks.remove.mockClear();
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
});
