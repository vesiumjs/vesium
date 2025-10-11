import type { CesiumDataSource } from '@vesium/shared';
import type { DataSourceCollection } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';
import { isPromise } from '@vesium/shared';
import { computed, toValue } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

export interface UseDataSourceScopeOptions {
  /**
   * The collection of DataSource to be added
   * @default useViewer().value.dataSources
   */
  collection?: MaybeRefOrGetter<DataSourceCollection | undefined>;

  /**
   * The second parameter passed to the `remove` function
   *
   * `dataSources.remove(dataSource,destroyOnRemove)`
   */
  destroyOnRemove?: boolean;
}

/**
 * Scope the SideEffects of `DataSourceCollection` operations and automatically remove them when unmounted
 */
export function useDataSourceScope(options: UseDataSourceScopeOptions = {}) {
  const { collection: _collection, destroyOnRemove } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.dataSources;
  });

  return useCollectionScope<CesiumDataSource>({
    addEffect(instance) {
      if (!collection.value) {
        throw new Error('collection is not defined');
      }

      if (isPromise(instance)) {
        return new Promise<CesiumDataSource>((resolve, reject) => {
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
    removeEffect(instance, destroy) {
      return !!collection.value?.remove(instance, destroy);
    },
    removeScopeArgs: [destroyOnRemove],
  });
}
