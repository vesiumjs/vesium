import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isReadonly, nextTick } from 'vue';
import { createViewer } from '../../createViewer';
import { useCesiumFps } from '../../index';

const mocks = vi.hoisted(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    scene = {
      postRender: {
        addEventListener: mocks.addEventListener,
        removeEventListener: mocks.removeEventListener,
      },
    };

    isDestroyed = vi.fn(() => false);
    destroy = vi.fn();
    constructor(_el?: any) {}
  }
  return { ...actual, Viewer };
});

describe('useCesiumFps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(performance, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should sample interval and fps from postRender events', async () => {
    let result: ReturnType<typeof useCesiumFps>;
    mount({
      setup() {
        createViewer(document.createElement('div'));
        result = useCesiumFps({ delay: 0 });
        return result;
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mocks.addEventListener).toHaveBeenCalled();

    const onPostRender = mocks.addEventListener.mock.calls[0][0] as () => void;
    vi.mocked(performance.now).mockReturnValue(16);
    onPostRender();
    await nextTick();
    await vi.advanceTimersByTimeAsync(0);
    await nextTick();

    expect(result!.interval.value).toBe(16);
    expect(result!.fps.value).toBeCloseTo(1000 / 16, 5);
    expect(isReadonly(result!.interval)).toBe(true);
  });

  it('should throw when no viewer is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount({
      setup() {
        useCesiumFps();
        return {};
      },
      template: '<div></div>',
    })).toThrow();
    spy.mockRestore();
  });
});
