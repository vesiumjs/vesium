import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useCesiumEventListener } from '../index';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Event {
    addEventListener = vi.fn(() => vi.fn());
  }
  return { ...actual, Event };
});

describe('useCesiumEventListener', () => {
  it('should add listener to single event', async () => {
    const mockEvent = new Cesium.Event() as any;
    const listener = vi.fn();

    mount({
      setup() {
        useCesiumEventListener(mockEvent, listener);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mockEvent.addEventListener).toHaveBeenCalledWith(listener, mockEvent);
  });

  it('should handle array of events', async () => {
    const mockEvent1 = new Cesium.Event() as any;
    const mockEvent2 = new Cesium.Event() as any;
    const listener = vi.fn();

    mount({
      setup() {
        useCesiumEventListener([mockEvent1, mockEvent2], listener);
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mockEvent1.addEventListener).toHaveBeenCalled();
    expect(mockEvent2.addEventListener).toHaveBeenCalled();
  });

  it('should toggle listener based on isActive', async () => {
    const mockEvent = new Cesium.Event() as any;
    const listener = vi.fn();
    const isActive = ref(true);

    mount({
      setup() {
        useCesiumEventListener(mockEvent, listener, { isActive });
        return {};
      },
      template: '<div></div>',
    });

    await nextTick();
    expect(mockEvent.addEventListener).toHaveBeenCalledTimes(1);

    const stopFn = (mockEvent.addEventListener as any).mock.results[0].value;

    isActive.value = false;
    await nextTick();
    expect(stopFn).toHaveBeenCalled();
  });
});
