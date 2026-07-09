import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { useGraphicEvent } from '../../index';

const mocks = vi.hoisted(() => {
  const handlers = new Map<any, ((event: any) => void)[]>();
  return {
    handlers,
    setInputAction: vi.fn((action: any, type: any) => {
      const list = handlers.get(type) ?? [];
      list.push(action);
      handlers.set(type, list);
    }),
    removeInputAction: vi.fn((type: any) => {
      handlers.delete(type);
    }),
    destroy: vi.fn(),
    pick: vi.fn(),
  };
});

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    canvas = { style: { setProperty: vi.fn() } };
    cesiumWidget = { canvas: document.createElement('canvas') };
    isDestroyed = () => false;
    destroy = vi.fn();
    scene = {
      pick: mocks.pick,
      screenSpaceCameraController: { enableRotate: true },
    };

    constructor() {}
  }

  class ScreenSpaceEventHandler {
    setInputAction = mocks.setInputAction;
    removeInputAction = mocks.removeInputAction;
    destroy = mocks.destroy;
    constructor(_canvas?: any) {}
  }

  return {
    ...actual,
    Viewer,
    ScreenSpaceEventHandler,
  };
});

/** Trigger every input action that was registered for a given `ScreenSpaceEventType`. */
function triggerType(type: any, event: any) {
  (mocks.handlers.get(type) ?? []).forEach(action => action(event));
}

const C2 = (x: number, y: number) => new Cesium.Cartesian2(x, y);

describe('useGraphicEvent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mocks.handlers.clear();
    mocks.pick.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useGraphicEvent();
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });

  it('should register and trigger a positioned listener and remove it', async () => {
    const graphic = { id: 'g' };
    const listener = vi.fn();
    let api: any;

    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        api = useGraphicEvent();
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();

    // The positioned input action for LEFT_CLICK should be registered.
    expect(mocks.handlers.get(Cesium.ScreenSpaceEventType.LEFT_CLICK)).toBeDefined();

    api.add(graphic, 'LEFT_CLICK', listener);

    // Simulate a click on the graphic.
    mocks.pick.mockReturnValue({ id: graphic });
    triggerType(Cesium.ScreenSpaceEventType.LEFT_CLICK, { position: C2(5, 5) });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].pick).toEqual({ id: graphic });

    // Removing the listener should stop further triggering.
    listener.mockClear();
    api.remove(graphic, 'LEFT_CLICK', listener);
    mocks.pick.mockReturnValue({ id: graphic });
    triggerType(Cesium.ScreenSpaceEventType.LEFT_CLICK, { position: C2(5, 5) });
    expect(listener).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('should trigger a global positioned listener regardless of pick', async () => {
    const listener = vi.fn();
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useGraphicEvent().add('global', 'LEFT_CLICK', listener);
        return {};
      },
      template: '<div></div>',
    });
    await nextTick();

    mocks.pick.mockReturnValue({ id: 'something-else' });
    triggerType(Cesium.ScreenSpaceEventType.LEFT_CLICK, { position: C2(1, 1) });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should clear all listeners for a graphic via clear', async () => {
    const graphic = { id: 'g' };
    const listener = vi.fn();
    mount({
      setup() {
        createViewer(document.createElement('div'));
        const { add: a, clear } = useGraphicEvent();
        a(graphic, 'LEFT_CLICK', listener);
        clear(graphic, 'all');
        return {};
      },
      template: '<div></div>',
    });
    await nextTick();

    mocks.pick.mockReturnValue({ id: graphic });
    triggerType(Cesium.ScreenSpaceEventType.LEFT_CLICK, { position: C2(5, 5) });
    expect(listener).not.toHaveBeenCalled();
  });

  it('should trigger a hover listener and set the cursor', async () => {
    const graphic = { id: 'g' };
    const listener = vi.fn();
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useGraphicEvent().add(graphic, 'HOVER', listener, { cursor: 'pointer' });
        return {};
      },
      template: '<div></div>',
    });
    await nextTick();

    mocks.pick.mockReturnValue({ id: graphic });
    triggerType(Cesium.ScreenSpaceEventType.MOUSE_MOVE, { startPosition: C2(0, 0), endPosition: C2(10, 10) });
    await nextTick();
    await vi.advanceTimersByTimeAsync(30);

    const hoverCalls = listener.mock.calls.filter(c => c[0].hovering === true);
    expect(hoverCalls.length).toBeGreaterThanOrEqual(1);
  });

  it('should trigger a hover-end listener when the pick becomes empty', async () => {
    const graphic = { id: 'g' };
    const listener = vi.fn();
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useGraphicEvent().add(graphic, 'HOVER', listener);
        return {};
      },
      template: '<div></div>',
    });
    await nextTick();

    // First hover over the graphic.
    mocks.pick.mockReturnValue({ id: graphic });
    triggerType(Cesium.ScreenSpaceEventType.MOUSE_MOVE, { startPosition: C2(0, 0), endPosition: C2(10, 10) });
    await nextTick();
    await vi.advanceTimersByTimeAsync(30);
    listener.mockClear();

    // Then move away (empty pick) causing hover end.
    mocks.pick.mockReturnValue(undefined);
    triggerType(Cesium.ScreenSpaceEventType.MOUSE_MOVE, { startPosition: C2(10, 10), endPosition: C2(20, 20) });
    await nextTick();
    await vi.advanceTimersByTimeAsync(30);

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ hovering: false }));
  });

  it('should trigger a drag listener during dragging', async () => {
    const graphic = { id: 'g' };
    const listener = vi.fn();
    mount({
      setup() {
        createViewer(document.createElement('div'));
        useGraphicEvent().add(graphic, 'DRAG', listener);
        return {};
      },
      template: '<div></div>',
    });
    await nextTick();

    mocks.pick.mockReturnValue({ id: graphic });

    triggerType(Cesium.ScreenSpaceEventType.LEFT_DOWN, { position: C2(5, 5) });
    await nextTick();
    triggerType(Cesium.ScreenSpaceEventType.MOUSE_MOVE, { startPosition: C2(5, 5), endPosition: C2(15, 15) });
    await nextTick();
    await vi.advanceTimersByTimeAsync(30);

    const dragCalls = listener.mock.calls.filter(c => c[0].dragging === true);
    expect(dragCalls.length).toBeGreaterThanOrEqual(1);
  });

  it('should remove an input action on unmount', async () => {
    mocks.handlers.clear();
    const wrapper = mount({
      setup() {
        createViewer(document.createElement('div'));
        useGraphicEvent().add({ id: 'g' }, 'LEFT_CLICK', vi.fn());
        return {};
      },
      template: '<div></div>',
    });
    await nextTick();
    expect(mocks.handlers.get(Cesium.ScreenSpaceEventType.LEFT_CLICK)).toBeDefined();

    wrapper.unmount();
    await nextTick();
    expect(mocks.removeInputAction).toHaveBeenCalled();
  });
});
