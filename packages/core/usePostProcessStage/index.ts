import type { Arrayable } from '@vueuse/core';
import type { PostProcessStage, PostProcessStageCollection } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { MaybeRefOrAsyncGetter } from '../toPromiseValue';
import { computedAsync } from '@vueuse/core';
import { toValue, watchEffect } from 'vue';
import { toPromiseValue } from '../toPromiseValue';
import { useViewer } from '../useViewer';

export interface UsePostProcessStageOptions {
  /**
   * The collection of PostProcessStage to be added
   * @default useViewer().scene.postProcessStages
   */
  collection?: PostProcessStageCollection;

  /**
   * Whether to destroy the stage when removed from the collection.
   *
   * Note: the default collection (`viewer.scene.postProcessStages`) destroys
   * a stage inside its `remove()` regardless of this option — a removed
   * stage can never be re-added. `false` only matters for custom
   * collections whose `remove` keeps removed stages alive.
   * @default true
   */
  destroyOnRemove?: boolean;

  /**
   * default value of `isActive`
   *
   * Removing a stage destroys it (see `destroyOnRemove`), so when toggled
   * back to `true` a previously removed stage is skipped with a console
   * warning instead of breaking the render loop. To toggle a stage on and
   * off, provide a getter that creates a fresh stage for each activation.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;

  /**
   * Ref passed to receive the updated of async evaluation
   */
  evaluating?: Ref<boolean>;
}

/**
 * Add `PostProcessStage` to the `PostProcessStageCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `PostProcessStage`.
 *
 * Overload 1: Parameter supports passing in a single value.
 */
export function usePostProcessStage<T extends PostProcessStage = PostProcessStage>(
  stage?: MaybeRefOrAsyncGetter<T | undefined>,
  options?: UsePostProcessStageOptions,
): ComputedRef<T | undefined>;

/**
 * Add `PostProcessStage` to the `PostProcessStageCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `PostProcessStage`.
 *
 * Overload 2: Parameter supports passing in an array.
 */
export function usePostProcessStage<T extends PostProcessStage = PostProcessStage>(
  stages?: MaybeRefOrAsyncGetter<Array<T | undefined> | undefined>,
  options?: UsePostProcessStageOptions,
): ComputedRef<T[] | undefined>;

export function usePostProcessStage<T extends PostProcessStage>(
  data?: MaybeRefOrAsyncGetter<Arrayable<T | undefined>>,
  options: UsePostProcessStageOptions = {},
) {
  const {
    collection,
    destroyOnRemove = true,
    isActive = true,
    evaluating,
  } = options;

  const result = computedAsync(
    () => toPromiseValue(data),
    undefined,
    {
      evaluating,
    },
  );

  const viewer = useViewer();

  watchEffect((onCleanup) => {
    if (!viewer.value) {
      return;
    }
    const _isActive = toValue(isActive);
    if (_isActive) {
      const list = Array.isArray(result.value) ? [...result.value] : [result.value];
      const _collection = collection ?? viewer.value.scene.postProcessStages;

      list.forEach((item) => {
        if (!item)
          return;
        // Cesium's `add` accepts destroyed stages but the render loop throws
        // `DeveloperError: This object was destroyed` on the next frame and
        // stops; skip the stage with a warning instead.
        if (typeof item.isDestroyed === 'function' && item.isDestroyed()) {
          console.warn('[vesium] usePostProcessStage: skip adding a destroyed stage. `postProcessStages.remove()` destroys the stage, so toggling `isActive` needs a getter that creates a fresh stage for each activation.');
          return;
        }
        _collection.add(item);
      });
      onCleanup(() => {
        list.forEach((item) => {
          if (item) {
            _collection.remove(item);
            if (destroyOnRemove && typeof item.destroy === 'function' && !item.isDestroyed()) {
              item.destroy();
            }
          }
        });
      });
    }
  });

  return result;
}
