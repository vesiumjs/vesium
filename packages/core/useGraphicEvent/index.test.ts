import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { createViewer } from '../createViewer';
import { useGraphicEvent } from '../index';
import { useDrag } from './useDrag';
import { useHover } from './useHover';
import { usePositioned } from './usePositioned';

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
        pick: vi.fn(),
        preRender: { addEventListener: vi.fn() },
        postRender: { addEventListener: vi.fn() },
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

describe('useGraphicEvent & sub-hooks', () => {
  describe('useGraphicEvent', () => {
    it('should add and remove listeners', () => {
      const TestComponent = defineComponent({
        setup() {
          createViewer(document.createElement('div'));
          const { add } = useGraphicEvent();
          const listener = vi.fn();
          const graphic = { id: 'test' };

          const stop = add(graphic, 'LEFT_CLICK', listener);
          expect(typeof stop).toBe('function');

          stop();
          return {};
        },
        render() { return h('div'); },
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
        template: '<div></div>',
      });
    });
  });

  describe('useHover', () => {
    it('should setup hover handlers', () => {
      mount({
        setup() {
          createViewer(document.createElement('div'));
          useHover(vi.fn());
          return {};
        },
        template: '<div></div>',
      });
    });
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
});
