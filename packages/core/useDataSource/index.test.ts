import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { createViewer } from '../createViewer';
import { useDataSource } from '../index';

const mockDataSources = {
  add: vi.fn(ds => Promise.resolve(ds)),
  remove: vi.fn(),
  isDestroyed: () => false,
};

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    dataSources = mockDataSources;
    destroy = vi.fn();
    isDestroyed = vi.fn(() => false);
    canvas = document.createElement('canvas');
    constructor(_el?: any, _options?: any) {}
  }
  class CustomDataSource {
    constructor(name?: string) {
      (this as any).name = name;
    }
  }
  return {
    ...actual,
    Viewer,
    CustomDataSource,
  };
});

describe('useDataSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add dataSource to viewer', async () => {
    const mockDs = new Cesium.CustomDataSource() as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        useDataSource(mockDs);
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    await nextTick();
    // computedAsync needs time
    await new Promise(resolve => setTimeout(resolve, 10));
    await nextTick();
    expect(mockDataSources.add).toHaveBeenCalledWith(mockDs);
  });

  it('should remove dataSource on cleanup', async () => {
    const mockDs = new Cesium.CustomDataSource() as any;
    const active = ref(true);
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        useDataSource(mockDs, { isActive: active });
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
    expect(mockDataSources.remove).toHaveBeenCalledWith(mockDs, undefined);
    wrapper.unmount();
  });

  it('should handle async dataSource getter', async () => {
    const mockDs = new Cesium.CustomDataSource('async') as any;
    const asyncGetter = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return mockDs;
    };

    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        useDataSource(asyncGetter);
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    await nextTick();
    // Wait for async getter + computedAsync
    await new Promise(resolve => setTimeout(resolve, 30));
    await nextTick();

    expect(mockDataSources.add).toHaveBeenCalledWith(mockDs);
  });

  it('should handle ref of promise dataSource', async () => {
    const mockDs = new Cesium.CustomDataSource('promise-ref') as any;
    const dataSourceRef = ref(Promise.resolve(mockDs)) as any;

    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        useDataSource(dataSourceRef);
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 20));
    await nextTick();

    expect(mockDataSources.add).toHaveBeenCalledWith(mockDs);
  });
});
