import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { useCesiumFps } from '../index';

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
    let state: any;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        state = useCesiumFps();
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(state.fps).toBeDefined();
    expect(mocks.addEventListener).toHaveBeenCalled();
  });
});
