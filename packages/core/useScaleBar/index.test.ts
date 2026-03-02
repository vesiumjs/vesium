import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { useScaleBar } from '../index';

const mocks = vi.hoisted(() => ({
  addEventListener: vi.fn(),
  getPickRay: vi.fn(),
  pick: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    canvas = document.createElement('canvas');
    scene = {
      camera: {
        getPickRay: mocks.getPickRay,
      },
      globe: {
        pick: mocks.pick,
        ellipsoid: {
          cartesianToCartographic: vi.fn(),
        },
      },
    };

    camera = {
      changed: { addEventListener: mocks.addEventListener },
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer };
});

describe('useScaleBar', () => {
  it('should setup scale bar', async () => {
    let state: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        state = useScaleBar();
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(state.width).toBeDefined();
    expect(mocks.addEventListener).toHaveBeenCalled();
  });
});
