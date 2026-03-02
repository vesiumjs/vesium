import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { createViewer } from '../createViewer';
import { usePrimitive } from '../index';

const mockPrimitives = {
  add: vi.fn(p => p),
  remove: vi.fn(),
  isDestroyed: () => false,
};

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    scene = {
      primitives: mockPrimitives,
      groundPrimitives: mockPrimitives,
    };

    destroy = vi.fn();
    isDestroyed = vi.fn(() => false);
    canvas = document.createElement('canvas');
    constructor(_el?: any, _options?: any) {}
  }
  return {
    ...actual,
    Viewer,
    Primitive: vi.fn(),
  };
});

describe('usePrimitive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add primitive to viewer', async () => {
    const mockPrimitive = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        usePrimitive(mockPrimitive);
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    await nextTick();
    expect(mockPrimitives.add).toHaveBeenCalledWith(mockPrimitive);
  });

  it('should handle ground primitives', async () => {
    const mockPrimitive = { id: 'test' } as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        usePrimitive(mockPrimitive, { collection: 'ground' });
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    await nextTick();
    expect(mockPrimitives.add).toHaveBeenCalledWith(mockPrimitive);
  });

  it('should remove primitive on cleanup', async () => {
    const mockPrimitive = { id: 'test' } as any;
    const active = ref(true);
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        usePrimitive(mockPrimitive, { isActive: active });
        return {};
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    await nextTick();

    active.value = false;
    await nextTick();
    expect(mockPrimitives.remove).toHaveBeenCalledWith(mockPrimitive);
    wrapper.unmount();
  });

  it('should handle async primitive with evaluating ref', async () => {
    const mockPrimitive = { id: 'async-primitive' } as any;
    const evaluating = ref(false);
    const asyncGetter = async () => {
      await new Promise(resolve => setTimeout(resolve, 20));
      return mockPrimitive;
    };

    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        usePrimitive(asyncGetter, { evaluating });
        return { evaluating };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();
    expect(wrapper.vm.evaluating).toBe(true);

    await new Promise(resolve => setTimeout(resolve, 30));
    await nextTick();

    expect(wrapper.vm.evaluating).toBe(false);
    expect(mockPrimitives.add).toHaveBeenCalledWith(mockPrimitive);
  });
});
