import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { useCesiumFps } from '../../index';

const mocks = vi.hoisted(() => ({
  addEventListener: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    scene = {
      postRender: { addEventListener: mocks.addEventListener },
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer };
});

describe('useCesiumFps', () => {
  it('should setup fps tracking', async () => {
    let fps: any, interval: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        ({ fps, interval } = useCesiumFps());
        return { fps, interval };
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(fps).toBeDefined();
    expect(interval).toBeDefined();
    expect(mocks.addEventListener).toHaveBeenCalled();
  });

  it('should return readonly interval and computed fps', async () => {
    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useCesiumFps();
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(result.interval).toBeDefined();
    expect(result.fps).toBeDefined();
    expect(typeof result.interval.value).toBe('number');
    expect(typeof result.fps.value).toBe('number');
  });

  it('should support custom delay option', async () => {
    let result: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useCesiumFps({ delay: 200 });
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(result.fps).toBeDefined();
    expect(result.interval).toBeDefined();
  });
});
