import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createViewer } from '../createViewer';
import { useScenePick } from '../index';

const mocks = vi.hoisted(() => ({
  pick: vi.fn(() => ({ id: 'picked' })),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    scene = {
      pick: mocks.pick,
    };

    constructor(_el?: any) {}
  }
  class Cartesian2 {
    x = 0;
    y = 0;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    clone() {
      return new Cartesian2(this.x, this.y);
    }

    equals(other: any) {
      return other.x === this.x && other.y === this.y;
    }
  }
  return { ...actual, Viewer, Cartesian2 };
});

describe('useScenePick', () => {
  it('should pick object at position', async () => {
    mocks.pick.mockClear();
    const pos = new Cesium.Cartesian2(10, 10);
    let pick: any;

    mount({
      setup() {
        createViewer(document.createElement('div'));
        pick = useScenePick(pos);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    // refThrottled might need a bit of time
    await new Promise(r => setTimeout(r, 20));
    expect(mocks.pick).toHaveBeenCalledTimes(1);
    expect(pick.value).toEqual({ id: 'picked' });
  });

  it('should recompute when width changes', async () => {
    mocks.pick.mockClear();
    const pos = new Cesium.Cartesian2(10, 10);
    const width = ref(3);
    const height = ref(3);
    let pick: any;

    mount({
      setup() {
        createViewer(document.createElement('div'));
        pick = useScenePick(pos, { width, height });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(r => setTimeout(r, 20));
    expect(mocks.pick).toHaveBeenCalledTimes(1);

    width.value = 5;
    await nextTick();
    await new Promise(r => setTimeout(r, 20));

    expect(mocks.pick).toHaveBeenCalledTimes(2);
    expect(pick.value).toEqual({ id: 'picked' });
  });
});
