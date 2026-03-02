import { vi } from 'vitest';

export function createMockViewer() {
  const mockEntities = {
    add: vi.fn(e => e),
    remove: vi.fn(),
    isDestroyed: vi.fn(() => false),
  };

  const mockDataSources = {
    add: vi.fn(ds => Promise.resolve(ds)),
    remove: vi.fn(),
    isDestroyed: vi.fn(() => false),
  };

  return {
    entities: mockEntities,
    dataSources: mockDataSources,
    destroy: vi.fn(),
    isDestroyed: vi.fn(() => false),
    canvas: document.createElement('canvas'),
  };
}

/**
 * Helper to setup Cesium mocks for a test file
 */
export function setupCesiumMocks() {
  vi.mock('cesium', async (importOriginal) => {
    const actual = await importOriginal() as any;
    class Viewer {
      entities = {
        add: vi.fn(e => e),
        remove: vi.fn(),
        isDestroyed: () => false,
      };

      dataSources = {
        add: vi.fn(ds => Promise.resolve(ds)),
        remove: vi.fn(),
        isDestroyed: () => false,
      };

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

    class CustomDataSource {
      constructor(name?: string) {
        (this as any).name = name;
      }
    }

    return {
      ...actual,
      Viewer,
      Entity,
      CustomDataSource,
    };
  });
}
