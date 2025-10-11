import type { ImageryLayer, ImageryLayerCollection } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';
import { isPromise } from '@vesium/shared';
import { computed, toValue } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

export interface UseImageryLayerScopeOptions {
  /**
   * The collection of ImageryLayer to be added
   * @default useViewer().value.imageryLayers
   */
  collection?: MaybeRefOrGetter<ImageryLayerCollection | undefined>;

  /**
   * The second parameter passed to the `remove` function
   *
   * `imageryLayers.remove(imageryLayer,destroyOnRemove)`
   */
  destroyOnRemove?: boolean;
}

/**
 * Make `add` and `remove` operations of `ImageryLayerCollection` scoped,
 * automatically remove `ImageryLayer` instance when component is unmounted.
 */
export function useImageryLayerScope(options: UseImageryLayerScopeOptions = {}) {
  const { collection: _collection, destroyOnRemove } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.imageryLayers;
  });

  return useCollectionScope<ImageryLayer>({
    addEffect(instance, index?: number) {
      if (!collection.value) {
        throw new Error('collection is not defined');
      }

      if (isPromise(instance)) {
        return new Promise<ImageryLayer>((resolve, reject) => {
          instance.then((i) => {
            collection.value.add(i, index);
            resolve(i);
          }).catch(error => reject(error));
        });
      }
      else {
        collection.value.add(instance, index);
        return instance;
      }
    },
    removeEffect(instance, destroy) {
      return !!collection.value?.remove(instance, destroy);
    },
    removeScopeArgs: [destroyOnRemove],
  });
}
