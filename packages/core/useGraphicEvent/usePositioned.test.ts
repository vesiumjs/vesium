import { mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import { createViewer } from '../createViewer';
import { usePositioned } from './usePositioned';

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

describe('usePositioned', () => {
  it('should setup positioned handlers', () => {
    mount({
      setup() {
        createViewer(document.createElement('div'));
        usePositioned('LEFT_CLICK', vi.fn());
        return {};
      },
      template: '<div></div>',
    });
  });
});
