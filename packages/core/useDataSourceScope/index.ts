import type { CesiumDataSource } from '@vesium/shared';
import type { DataSourceCollection } from 'cesium';
import type { MaybeRefOrGetter, ShallowReactive } from 'vue';
import type { EffcetRemovePredicate } from '../useCollectionScope';
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

export interface UseDataSourceScopeRetrun {
  /**
   * A `Set` for storing SideEffect instance,
   * which is encapsulated using `ShallowReactive` to provide Vue's reactive functionality
   */
  scope: Readonly<ShallowReactive<Set<CesiumDataSource>>>;

  /**
   * Add SideEffect instance
   */
  add: <T extends CesiumDataSource>(dataSource: T) => T extends Promise<infer U> ? Promise<U> : T;

  /**
   * Remove specified SideEffect instance
   */
  remove: (dataSource: CesiumDataSource, destroy?: boolean) => boolean;

  /**
   * Remove all SideEffect instance that meets the specified criteria
   */
  removeWhere: (predicate: EffcetRemovePredicate<CesiumDataSource>, destroy?: boolean) => void;

  /**
   * Remove all SideEffect instance within current scope
   */
  removeScope: (destroy?: boolean) => void;
}

/**
 * // Scope the SideEffects of `DataSourceCollection` operations and automatically remove them when unmounted
 */
export function useDataSourceScope(options: UseDataSourceScopeOptions = {}): UseDataSourceScopeRetrun {
  const { collection: _collection, destroyOnRemove } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.dataSources;
  });

  const addFn = <T extends CesiumDataSource>(dataSource: T | Promise<T>) => {
    if (!collection.value) {
      throw new Error('collection is not defined');
    }
    return collection.value.add(dataSource);
  };

  const removeFn = (dataSource: CesiumDataSource, destroy?: boolean) => {
    return !!collection.value?.remove(dataSource, destroy);
  };

  const { scope, add, remove, removeWhere, removeScope } = useCollectionScope(addFn, removeFn, [destroyOnRemove]);
  return {
    scope,
    add,
    remove,
    removeWhere,
    removeScope,
  };
}
