import { mount } from '@vue/test-utils';
import { Cartesian2, Cartesian3 } from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { useElementOverlay } from '../../index';

const mocks = vi.hoisted(() => {
  const postUpdateListeners: ((...args: any[]) => void)[] = [];
  return {
    cartesianToCanvasCoordinates: vi.fn(() => new Cartesian2(100, 200)),
    postUpdate: {
      addEventListener: vi.fn((listener: any) => {
        postUpdateListeners.push(listener);
        return () => {
          const idx = postUpdateListeners.indexOf(listener);
          if (idx >= 0)
            postUpdateListeners.splice(idx, 1);
        };
      }),
    },
    triggerPostUpdate() {
      postUpdateListeners.forEach(fn => fn());
    },
  };
});

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    Cartesian2: actual.Cartesian2,
    Viewer: class {
      canvas = { parentElement: document.createElement('div'), style: { setProperty: vi.fn() } };
      cesiumWidget = { canvas: {} };
      isDestroyed = () => false;
      destroy = vi.fn();
      camera = { changed: { addEventListener: vi.fn() } };
      scene = {
        postUpdate: mocks.postUpdate,
        camera: { changed: { addEventListener: vi.fn() } },
        cartesianToCanvasCoordinates: mocks.cartesianToCanvasCoordinates,
      };

      constructor() {}
    },
  };
});

describe('useElementOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return style with position', async () => {
    let style: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        ({ style } = useElementOverlay(undefined, new Cartesian3(0, 0, 0)));
        return { style };
      },
      template: '<div></div>',
    });

    await nextTick();
    mocks.triggerPostUpdate();
    await nextTick();
    expect(style.value).toContain('left:100px');
    expect(style.value).toContain('top:200px');
  });

  it('should return x=0,y=0 when position is null', async () => {
    let x: any, y: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        ({ x, y } = useElementOverlay(undefined, null));
        return { x, y };
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(x.value).toBe(0);
    expect(y.value).toBe(0);
  });

  it('should return x=0,y=0 when position is undefined', async () => {
    let x: any, y: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        ({ x, y } = useElementOverlay(undefined, undefined));
        return { x, y };
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(x.value).toBe(0);
    expect(y.value).toBe(0);
  });

  it('should set element style via watchEffect on mount', async () => {
    const el = document.createElement('div');
    el.style.setProperty = vi.fn();
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useElementOverlay(el, new Cartesian3(0, 0, 0));
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(el.style.setProperty).toHaveBeenCalledWith('left', '0px');
    expect(el.style.setProperty).toHaveBeenCalledWith('top', '0px');
  });

  it('should not apply style when applyStyle is false', async () => {
    const el = document.createElement('div');
    el.style.setProperty = vi.fn();
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useElementOverlay(el, new Cartesian3(0, 0, 0), { applyStyle: false });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(el.style.setProperty).not.toHaveBeenCalled();
  });
});
