import { mount } from '@vue/test-utils';
import { Viewer } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { createViewer } from '../createViewer';
import { useViewer } from '../useViewer';

// Mock Cesium Viewer
vi.mock('cesium', () => {
  class Viewer {
    destroy = vi.fn();
    isDestroyed = vi.fn(() => false);
    canvas = document.createElement('canvas');
    constructor(_el?: any, _options?: any) {
      if (_el instanceof HTMLElement) {
        _el.appendChild(this.canvas);
      }
    }
  }
  return { Viewer };
});

describe('useViewer & createViewer', () => {
  it('should create and provide viewer', () => {
    const TestComponent = defineComponent({
      setup() {
        const viewer = createViewer(document.createElement('div'));
        const injected = useViewer();
        return { viewer, injected };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    expect(wrapper.vm.viewer).toBeDefined();
    expect(wrapper.vm.injected).toBe(wrapper.vm.viewer);
  });

  it('should throw error when useViewer is called without createViewer', () => {
    const TestComponent = defineComponent({
      setup() {
        useViewer();
        return {};
      },
      render() { return h('div'); },
    });

    // Prevent vitest from crashing on the expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mount(TestComponent)).toThrow('injected by `createViewer` was not found');
    spy.mockRestore();
  });

  it('should handle existing viewer instance', () => {
    const TestComponent = defineComponent({
      setup() {
        const mockViewer = new Viewer(document.createElement('div'));
        const viewer = createViewer(mockViewer);
        return { viewer, mockViewer };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    expect(wrapper.vm.viewer).toBe(wrapper.vm.mockViewer);
  });

  it('should set viewer to undefined when canvas is removed from DOM', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let viewerRef: any;
    const TestComponent = defineComponent({
      setup() {
        viewerRef = createViewer(container);
        return { viewerRef };
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent, { attachTo: document.body });
    await nextTick();

    expect(viewerRef.value).toBeDefined();
    const canvas = viewerRef.value.canvas;
    expect(document.body.contains(canvas)).toBe(true);

    // Manually remove canvas to trigger MutationObserver
    canvas.remove();

    // MutationObserver is async
    await new Promise(resolve => setTimeout(resolve, 50));
    await nextTick();

    expect(viewerRef.value).toBeUndefined();

    wrapper.unmount();
    container.remove();
  });
});
