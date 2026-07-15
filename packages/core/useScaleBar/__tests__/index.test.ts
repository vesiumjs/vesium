import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createViewer } from '../../createViewer';
import { useScaleBar } from '../../index';

const mocks = vi.hoisted(() => {
  let _surfaceDistance = 1000;
  return {
    addEventListener: vi.fn(),
    getPickRay: vi.fn(),
    pick: vi.fn(),
    get surfaceDistance() { return _surfaceDistance; },
    set surfaceDistance(v: number) { _surfaceDistance = v; },
    EllipsoidGeodesic: class {
      surfaceDistance = _surfaceDistance;
      constructor(_left?: any, _right?: any) {}
    },
  };
});

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
  return { ...actual, Viewer, EllipsoidGeodesic: mocks.EllipsoidGeodesic };
});

describe('useScaleBar', () => {
  it('should return 0 width/distance when pick ray is not available', async () => {
    mocks.getPickRay.mockReturnValue(undefined);

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
    await nextTick();
    expect(result.width.value).toBe(0);
    expect(result.distance.value).toBeUndefined();
    expect(result.distanceText.value).toBeUndefined();
    expect(mocks.addEventListener).toHaveBeenCalled();
  });

  it('should calculate distance and width when picks succeed', async () => {
    mocks.getPickRay.mockReturnValue({});
    mocks.pick.mockReturnValue({});
    mocks.surfaceDistance = 1000;

    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useScaleBar({ maxPixel: 80 });
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    await nextTick();
    expect(result.pixelDistance.value).toBe(1000);
    expect(result.distance.value).toBe(50000);
    expect(result.width.value).toBe(50);
    expect(result.distanceText.value).toBe('50km');
  });

  it('should handle smaller distances', async () => {
    mocks.getPickRay.mockReturnValue({});
    mocks.pick.mockReturnValue({});
    mocks.surfaceDistance = 10;

    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useScaleBar({ maxPixel: 80 });
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    await nextTick();
    expect(result.pixelDistance.value).toBe(10);
    expect(result.distance.value).toBe(500);
    expect(result.width.value).toBe(50);
    expect(result.distanceText.value).toBe('500m');
  });

  it('should support custom maxPixel option', async () => {
    mocks.getPickRay.mockReturnValue({});
    mocks.pick.mockReturnValue({});
    mocks.surfaceDistance = 1000;

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
    await nextTick();
    expect(result.distance.value).toBe(50000);
    expect(result.width.value).toBe(50);
  });

  it('should support ref for maxPixel', async () => {
    mocks.getPickRay.mockReturnValue({});
    mocks.pick.mockReturnValue({});
    mocks.surfaceDistance = 1000;

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
    await nextTick();
    expect(result.distance.value).toBe(100000);
    expect(result.width.value).toBe(100);
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useScaleBar();
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
