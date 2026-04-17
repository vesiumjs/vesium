import type { GroundPrimitive, Primitive, PrimitiveCollection } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';
import { isPromise } from '@vesium/shared';
import { computed, toValue } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

export interface UsePrimitiveScopeOptions {
  /**
   * The collection of Primitive to be added,
   * 'ground' alias `useViewer().value.scene.groundPrimitives`
   * @default useViewer().value.scene.primitives
   */
  collection?: MaybeRefOrGetter<PrimitiveCollection | 'ground' | undefined>;

  /**
   * Whether to destroy the primitive when removed from the collection.
   * When true, the primitive's GPU resources will be released.
   * @default true
   */
  destroyOnRemove?: boolean;
}

/**
 * Make `add` and `remove` operations of `PrimitiveCollection` scoped,
 * automatically remove `Primitive` instance when component is unmounted.
 */
export function usePrimitiveScope(options: UsePrimitiveScopeOptions = {}) {
  const { collection: _collection, destroyOnRemove = true } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    const value = toValue(_collection);
    return value === 'ground' ? viewer.value?.scene?.groundPrimitives : (value || viewer.value?.scene.primitives);
  });

  const { scope, add, remove, removeWhere, removeScope } = useCollectionScope<Primitive | GroundPrimitive>({
    addEffect(instance, ...args) {
      if (!collection.value) {
        throw new Error('collection is not defined');
      }
      if (isPromise(instance)) {
        return new Promise<Primitive | GroundPrimitive>((resolve, reject) => {
          instance
            .then(instance => resolve(collection.value!.add(instance, ...args)))
            .catch(error => reject(error));
        });
      }
      else {
        return collection.value.add(instance, ...args);
      }
    },
    removeEffect(instance) {
      if (!collection.value) {
        return false;
      }
      const removed = collection.value.remove(instance);
      if (removed && destroyOnRemove && instance && typeof instance.destroy === 'function' && !instance.isDestroyed()) {
        instance.destroy();
      }
      return !!removed;
    },
    removeScopeArgs: [],
  },
  );

  return {
    scope,
    add,
    remove,
    removeWhere,
    removeScope,
  };
}
