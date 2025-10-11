import type { PostProcessStage, PostProcessStageCollection, PostProcessStageComposite } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';
import { isPromise } from '@vesium/shared';
import { computed, toValue } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

export interface UsePostProcessStageScopeOptions {
  /**
   * The collection of PostProcessStage to be added
   * @default useViewer().value.postProcessStages
   */
  collection?: MaybeRefOrGetter<PostProcessStageCollection | undefined>;
}

/**
 * Make `add` and `remove` operations of `PostProcessStageCollection` scoped,
 * automatically remove `PostProcessStage` instance when component is unmounted.
 */
export function usePostProcessStageScope(options: UsePostProcessStageScopeOptions = {}) {
  const { collection: _collection } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.postProcessStages;
  });

  return useCollectionScope<PostProcessStage | PostProcessStageComposite>({
    addEffect(instance) {
      if (!collection.value) {
        throw new Error('collection is not defined');
      }
      if (isPromise(instance)) {
        return new Promise<PostProcessStage | PostProcessStageComposite>((resolve, reject) => {
          instance
            .then((instance) => {
              collection.value.add(instance);
              resolve(instance);
            })
            .catch(error => reject(error));
        });
      }
      else {
        return collection.value.add(instance);
      }
    },
    removeEffect(instance, ...args) {
      // @ts-expect-error 'remove' method
      return !!collection.value?.remove(instance, ...args as any[]);
    },
    removeScopeArgs: [],
  });
}
