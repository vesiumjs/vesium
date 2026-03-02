import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { useCameraState } from '../index';

const mocks = vi.hoisted(() => ({
  addEventListener: vi.fn(() => vi.fn()),
  computeViewRectangle: vi.fn(() => ({})),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    scene = {
      camera: {
        changed: { addEventListener: mocks.addEventListener },
        position: { clone: () => ({ x: 1, y: 2, z: 3 }) },
        computeViewRectangle: mocks.computeViewRectangle,
      },
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer };
});

describe('useCameraState', () => {
  it('should track camera state', async () => {
    let state: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        state = useCameraState({ delay: 0 });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(state.camera.value).toBeDefined();
    expect(state.position.value).toEqual({ x: 1, y: 2, z: 3 });
    expect(mocks.addEventListener).toHaveBeenCalled();
  });
});
