import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createViewer } from '../../createViewer';
import { useSceneDrillPick } from '../../index';

const mocks = vi.hoisted(() => ({
  drillPick: vi.fn(() => [{ id: 'picked' }]),
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
  }

  class Viewer {
    scene = {
      drillPick: mocks.drillPick,
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer, Cartesian2 };
});

describe('useSceneDrillPick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should drill pick objects at position', async () => {
    const pos = new Cesium.Cartesian2(10, 10);
    let pick: ReturnType<typeof useSceneDrillPick>;

    mount({
      setup() {
        createViewer(document.createElement('div'));
        pick = useSceneDrillPick(pos, { throttled: 0 });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(r => setTimeout(r, 20));
    expect(mocks.drillPick).toHaveBeenCalledWith(pos, undefined, 3, 3);
    expect(pick!.value).toEqual([{ id: 'picked' }]);
  });

  it('should respect width, height and limit options', async () => {
    const pos = new Cesium.Cartesian2(10, 10);

    mount({
      setup() {
        createViewer(document.createElement('div'));
        useSceneDrillPick(pos, { throttled: 0, width: 5, height: 7, limit: 2 });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(r => setTimeout(r, 20));
    expect(mocks.drillPick).toHaveBeenCalledWith(pos, 2, 5, 7);
  });

  it('should return undefined for undefined position', async () => {
    const pos = ref<Cesium.Cartesian2 | undefined>(undefined);
    let pick: ReturnType<typeof useSceneDrillPick>;

    mount({
      setup() {
        createViewer(document.createElement('div'));
        pick = useSceneDrillPick(pos, { throttled: 0 });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(r => setTimeout(r, 20));
    expect(pick!.value).toBeUndefined();
  });

  it('should return empty array when drillPick returns empty', async () => {
    mocks.drillPick.mockReturnValue([]);
    const pos = new Cesium.Cartesian2(10, 10);
    let pick: ReturnType<typeof useSceneDrillPick>;

    mount({
      setup() {
        createViewer(document.createElement('div'));
        pick = useSceneDrillPick(pos, { throttled: 0 });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(r => setTimeout(r, 20));
    expect(pick!.value).toEqual([]);
  });

  it('should skip drillPick when isActive is false', async () => {
    const pos = new Cesium.Cartesian2(10, 10);
    let pick: ReturnType<typeof useSceneDrillPick>;

    mount({
      setup() {
        createViewer(document.createElement('div'));
        pick = useSceneDrillPick(pos, { throttled: 0, isActive: false });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    await new Promise(r => setTimeout(r, 20));
    expect(pick!.value).toBeUndefined();
    expect(mocks.drillPick).not.toHaveBeenCalled();
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useSceneDrillPick(new Cesium.Cartesian2(10, 10));
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
