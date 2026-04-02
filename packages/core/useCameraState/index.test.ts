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
        direction: { clone: () => ({ x: 4, y: 5, z: 6 }) },
        up: { clone: () => ({ x: 7, y: 8, z: 9 }) },
        right: { clone: () => ({ x: 10, y: 11, z: 12 }) },
        positionCartographic: { height: 0, clone: () => ({ longitude: 1, latitude: 2, height: 0 }) },
        positionWC: { clone: () => ({ x: 13, y: 14, z: 15 }) },
        directionWC: { clone: () => ({ x: 16, y: 17, z: 18 }) },
        upWC: { clone: () => ({ x: 19, y: 20, z: 21 }) },
        rightWC: { clone: () => ({ x: 22, y: 23, z: 24 }) },
        computeViewRectangle: mocks.computeViewRectangle,
        heading: 1,
        pitch: 2,
        roll: 3,
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
    expect(state.upWC.value).toEqual({ x: 19, y: 20, z: 21 });
    expect(state.rightWC.value).toEqual({ x: 22, y: 23, z: 24 });
    expect(state.level.value).toBeDefined();
    expect(mocks.addEventListener).toHaveBeenCalled();
  });
});
