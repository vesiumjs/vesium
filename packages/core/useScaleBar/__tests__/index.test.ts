import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createViewer } from '../../createViewer';
import { useScaleBar } from '../../index';

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
    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useScaleBar();
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(result.width).toBeDefined();
    expect(result.distance).toBeDefined();
    expect(result.distanceText).toBeDefined();
    expect(result.pixelDistance).toBeDefined();
    expect(typeof result.width.value).toBe('number');
    expect(mocks.addEventListener).toHaveBeenCalled();
  });

  it('should return readonly refs for reactive values', async () => {
    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useScaleBar();
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(result.pixelDistance).toBeDefined();
    expect(typeof result.width.value).toBe('number');
    expect(result.width.value).toBeGreaterThanOrEqual(0);
  });

  it('should support custom maxPixel option', async () => {
    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useScaleBar({ maxPixel: 100 });
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(result.width).toBeDefined();
    expect(result.distance).toBeDefined();
  });

  it('should support custom delay option', async () => {
    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useScaleBar({ delay: 16 });
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(result.width).toBeDefined();
    expect(mocks.addEventListener).toHaveBeenCalled();
  });

  it('should support ref for maxPixel', async () => {
    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useScaleBar({ maxPixel: ref(120) });
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(result.distance).toBeDefined();
    expect(result.width).toBeDefined();
  });
});
