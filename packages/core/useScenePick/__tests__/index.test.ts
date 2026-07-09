import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createViewer } from '../../createViewer';
import { useScenePick } from '../../index';

const mocks = vi.hoisted(() => ({
  pick: vi.fn(() => ({ id: 'picked' })),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
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
      return other instanceof Cartesian2 && other.x === this.x && other.y === this.y;
    }
  }

  class Viewer {
    scene = {
      pick: mocks.pick,
    };

    constructor(_el?: any) {}
  }
  return { ...actual, Viewer, Cartesian2 };
});

describe('useScenePick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    await new Promise(r => setTimeout(r, 20));
    expect(mocks.pick).toHaveBeenCalledTimes(1);
    expect(pick.value).toEqual({ id: 'picked' });
  });

  it('should recompute when width changes', async () => {
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

  it('should return undefined when position is undefined', async () => {
    const pos = ref<any>(undefined);
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
    await new Promise(r => setTimeout(r, 20));
    expect(pick.value).toBeUndefined();
  });

  it('should return undefined when position is null', async () => {
    let pick: any;

    mount({
      setup() {
        createViewer(document.createElement('div'));
        pick = useScenePick(null as any);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(r => setTimeout(r, 20));
    expect(pick.value).toBeUndefined();
  });

  it('should return undefined when pick returns empty', async () => {
    mocks.pick.mockReturnValue(undefined);
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
    await new Promise(r => setTimeout(r, 20));
    expect(pick.value).toBeUndefined();
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useScenePick({} as any);
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
