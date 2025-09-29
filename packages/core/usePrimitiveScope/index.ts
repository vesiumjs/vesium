import type { PrimitiveCollection } from 'cesium';
import type { MaybeRefOrGetter, ShallowReactive } from 'vue';
import type { EffcetRemovePredicate } from '../useCollectionScope';
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
}

export interface UsePrimitiveScopeRetrun {
  /**
   * A `Set` for storing SideEffect instance,
   * which is encapsulated using `ShallowReactive` to provide Vue's reactive functionality
   */
  scope: Readonly<ShallowReactive<Set<any>>>;

  /**
   * Add SideEffect instance
   */
  add: <T = any>(primitive: T) => T extends Promise<infer U> ? Promise<U> : T;

  /**
   * Remove specified SideEffect instance
   */
  remove: (primitive: any, destroy?: boolean) => boolean;

  /**
   * Remove all SideEffect instance that meets the specified criteria
   */
  removeWhere: (predicate: EffcetRemovePredicate<any>, destroy?: boolean) => void;

  /**
   * Remove all SideEffect instance within current scope
   */
  removeScope: (destroy?: boolean) => void;
}

/**
 * Make `add` and `remove` operations of `PrimitiveCollection` scoped,
 * automatically remove `Primitive` instance when component is unmounted.
 */
export function usePrimitiveScope(options: UsePrimitiveScopeOptions = {}): UsePrimitiveScopeRetrun {
  const { collection: _collection } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    const value = toValue(_collection);
    return value === 'ground' ? viewer.value?.scene?.groundPrimitives : (value || viewer.value?.scene.primitives);
  });

  const { scope, add, remove, removeWhere, removeScope } = useCollectionScope<any>({
    addEffect(instance, ...args) {
      if (!collection.value) {
        throw new Error('collection is not defined');
      }
      if (isPromise(instance)) {
        return new Promise<typeof instance>((resolve, reject) => {
          instance
            .then(instance => resolve(collection.value.add(instance, ...args)))
            .catch(error => reject(error));
        });
      }
      else {
        return collection.value.add(instance, ...args);
      }
    },
    removeEffect(instance, ...args) {
      // @ts-expect-error 'remove' method
      return !!collection.value?.remove(instance, ...args as any[]);
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
