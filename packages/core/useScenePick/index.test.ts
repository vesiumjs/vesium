import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { useScenePick } from '../index';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  const mockPick = vi.fn(() => ({ id: 'picked' }));
  class Viewer {
    scene = {
      pick: mockPick,
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
    const viewer = new Cesium.Viewer(document.createElement('div'));
    expect(viewer.scene.pick).toHaveBeenCalled();
    expect(pick.value).toEqual({ id: 'picked' });
  });
});
