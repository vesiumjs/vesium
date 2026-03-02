import { describe, expect, it, vi } from 'vitest';
import { useGraphicEvent } from '../index';
import { createViewer } from '../createViewer';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    Viewer: class {
      canvas = { style: { setProperty: vi.fn() } };
      cesiumWidget = { canvas: {} };
      isDestroyed = () => false;
      destroy = vi.fn();
      camera = { changed: { addEventListener: vi.fn() } };
      scene = { 
        preRender: { addEventListener: vi.fn() },
        postRender: { addEventListener: vi.fn() },
        screenSpaceCameraController: {},
        camera: { changed: { addEventListener: vi.fn() } }
      };
      constructor() {}
    },
    ScreenSpaceEventHandler: class {
      setInputAction = vi.fn();
      removeInputAction = vi.fn();
      destroy = vi.fn();
    }
  };
});

describe('useGraphicEvent', () => {
  it('should add and remove listeners', () => {
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        const { add, remove } = useGraphicEvent();
        const listener = vi.fn();
        const graphic = { id: 'test' };
        
        const stop = add(graphic, 'LEFT_CLICK', listener);
        expect(typeof stop).toBe('function');
        
        stop();
        return {};
      },
      render() { return h('div'); }
    });

    mount(TestComponent);
  });

  it('should handle global events', () => {
     mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add, clear } = useGraphicEvent();
        const listener = vi.fn();
        add('global', 'LEFT_CLICK', listener);
        clear('global', 'all');
        return {};
      },
      template: '<div></div>'
    });
  });
});
