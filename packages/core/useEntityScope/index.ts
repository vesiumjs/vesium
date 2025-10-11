import type { Entity, EntityCollection } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';
import { isPromise } from '@vesium/shared';
import { computed, toValue } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

export interface UseEntityScopeOptions {
  /**
   * The collection of Entity to be added
   * @default useViewer().value.entities
   */
  collection?: MaybeRefOrGetter<EntityCollection | undefined>;
}

/**
 * Make `add` and `remove` operations of `EntityCollection` scoped,
 * automatically remove `Entity` instance when component is unmounted.
 */
export function useEntityScope(options: UseEntityScopeOptions = {}) {
  const { collection: _collection } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.entities;
  });

  return useCollectionScope<Entity>({
    addEffect(instance) {
      if (!collection.value) {
        throw new Error('collection is not defined');
      }

      if (isPromise(instance)) {
        return new Promise<Entity>((resolve, reject) => {
          instance.then((i) => {
            collection.value.add(i);
            resolve(i);
          }).catch(error => reject(error));
        });
      }
      else {
        collection.value.add(instance);
        return instance;
      }
    },
    removeEffect(instance) {
      return !!collection.value?.remove(instance);
    },
    removeScopeArgs: [],
  });
}
