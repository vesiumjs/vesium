import { mount } from '@vue/test-utils';
import { Cartesian2, Cartesian3 } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { createViewer } from '../createViewer';
import { useElementOverlay } from '../index';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    Cartesian2: {
      equals: (a: any, b: any) => a?.x === b?.x && a?.y === b?.y,
    },
    Viewer: class {
      canvas = { parentElement: document.createElement('div') };
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
    mount({
      setup() {
        createViewer(document.createElement('div'));
        const { x, y } = useElementOverlay(el, new Cartesian3(0, 0, 0));
        expect(x.value).toBeDefined();
        expect(y.value).toBeDefined();
        return {};
      },
      template: '<div></div>',
    });
  });
});
