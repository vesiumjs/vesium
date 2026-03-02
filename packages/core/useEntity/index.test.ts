import { mount } from '@vue/test-utils';
import * as Cesium from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { createViewer } from '../createViewer';
import { useEntity } from '../index';

const mockEntities = {
  add: vi.fn(e => e),
  remove: vi.fn(),
  isDestroyed: () => false,
};

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  class Viewer {
    entities = mockEntities;
    destroy = vi.fn();
    isDestroyed = vi.fn(() => false);
    canvas = document.createElement('canvas');
    constructor(_el?: any, _options?: any) {}
  }
  class Entity {
    constructor(opts?: any) {
      Object.assign(this, opts);
    }
  }
  return {
    ...actual,
    Viewer,
    Entity,
  };
});

describe('useEntity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add entity to viewer', async () => {
    const mockEntity = new Cesium.Entity() as any;
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        useEntity(mockEntity);
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    await nextTick();
    expect(mockEntities.add).toHaveBeenCalledWith(mockEntity);
  });

  it('should remove entity on cleanup', async () => {
    const mockEntity = new Cesium.Entity() as any;
    const active = ref(true);
    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        useEntity(mockEntity, { isActive: active });
        return {};
      },
      render() { return h('div'); },
    });

    const wrapper = mount(TestComponent);
    await nextTick();

    active.value = false;
    await nextTick();
    expect(mockEntities.remove).toHaveBeenCalledWith(mockEntity);
    wrapper.unmount();
  });

  it('should handle switching from single entity to array', async () => {
    const entityA = new Cesium.Entity({ id: 'A' }) as any;
    const entityB = new Cesium.Entity({ id: 'B' }) as any;
    const data = ref<any>(entityA);

    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        useEntity(data);
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    await nextTick();
    // toPromiseValue is async, computedAsync needs time
    await new Promise(resolve => setTimeout(resolve, 10));
    await nextTick();
    expect(mockEntities.add).toHaveBeenCalledWith(entityA);

    data.value = [entityA, entityB];
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));
    await nextTick();

    // In current implementation, changing data triggers watchEffect cleanup (remove A) and then adds [A, B]
    expect(mockEntities.remove).toHaveBeenCalledWith(entityA);
    expect(mockEntities.add).toHaveBeenCalledWith(entityB);
  });

  it('should handle empty or undefined data', async () => {
    const data = ref<any>(undefined);

    const TestComponent = defineComponent({
      setup() {
        createViewer(document.createElement('div'));
        useEntity(data);
        return {};
      },
      render() { return h('div'); },
    });

    mount(TestComponent);
    await nextTick();
    expect(mockEntities.add).not.toHaveBeenCalled();

    data.value = [];
    await nextTick();
    expect(mockEntities.add).not.toHaveBeenCalled();
  });
});
