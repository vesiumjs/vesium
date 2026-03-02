import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createViewer } from '../createViewer';
import { useDrag } from './useDrag';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    Viewer: class {
      cesiumWidget = { canvas: {} };
      isDestroyed = () => false;
      destroy = vi.fn();
      camera = { changed: { addEventListener: vi.fn() } };
      scene = {
        pick: vi.fn(),
        screenSpaceCameraController: { enableRotate: true },
        camera: { changed: { addEventListener: vi.fn() } },
      };

      constructor() {}
    },
    ScreenSpaceEventHandler: class {
      setInputAction = vi.fn();
      removeInputAction = vi.fn();
      destroy = vi.fn();
    },
  };
});

describe('useDrag', () => {
  it('should setup drag handlers', () => {
    mount({
      setup() {
        createViewer(document.createElement('div'));
        const stop = useDrag(vi.fn());
        expect(typeof stop).toBe('function');
        return {};
      },
      template: '<div></div>',
    });
  });
});
