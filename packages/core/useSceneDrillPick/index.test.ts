import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { useSceneDrillPick } from '../index';

const mocks = vi.hoisted(() => ({
  drillPick: vi.fn(() => [{ id: 'picked' }]),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    scene = {
      drillPick: mocks.drillPick,
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  class Cartesian2 {
    x = 0;
    y = 0;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }
  return { ...actual, Viewer, Cartesian2 };
});

describe('useSceneDrillPick', () => {
  it('should drill pick objects at position', async () => {
    mocks.drillPick.mockClear();
    const pos = new Cesium.Cartesian2(10, 10);

    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        const pick = useSceneDrillPick(pos, { throttled: 0 });
        return { pick };
      },
      template: '<div></div>',
    });

    await nextTick();
    // Use an effect to track the pick value change
    await new Promise((resolve) => {
      vi.waitFor(() => {
        if ((wrapper.vm as any).pick !== undefined) {
          resolve(true);
          return true;
        }
        return false;
      }, { timeout: 1000 }).then(resolve).catch(resolve);
    });

    expect(mocks.drillPick).toHaveBeenCalled();
    expect((wrapper.vm as any).pick).toEqual([{ id: 'picked' }]);
  });
});
