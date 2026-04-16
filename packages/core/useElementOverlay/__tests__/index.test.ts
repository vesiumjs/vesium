import { mount } from '@vue/test-utils';
import { Cartesian2, Cartesian3 } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { useElementOverlay } from '../../index';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    Cartesian2: {
      equals: (a: any, b: any) => a?.x === b?.x && a?.y === b?.y,
    },
    Viewer: class {
      canvas = { parentElement: document.createElement('div'), style: { setProperty: vi.fn() } };
      cesiumWidget = { canvas: {} };
      isDestroyed = () => false;
      destroy = vi.fn();
      camera = { changed: { addEventListener: vi.fn() } };
      scene = {
        postUpdate: { addEventListener: vi.fn() },
        camera: { changed: { addEventListener: vi.fn() } },
        cartesianToCanvasCoordinates: vi.fn(() => new Cartesian2(100, 200)),
      };

      constructor() {}
    },
  };
});

describe('useElementOverlay', () => {
  it('should calculate positions', async () => {
    const el = document.createElement('div');
    let x: any, y: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        ({ x, y } = useElementOverlay(el, new Cartesian3(0, 0, 0)));
        return { x, y };
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(x).toBeDefined();
    expect(y).toBeDefined();
    expect(typeof x.value).toBe('number');
    expect(typeof y.value).toBe('number');
  });

  it('should return reactive refs', async () => {
    const el = document.createElement('div');
    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useElementOverlay(el, new Cartesian3(0, 0, 0));
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(result.x).toBeDefined();
    expect(result.y).toBeDefined();
  });
});
