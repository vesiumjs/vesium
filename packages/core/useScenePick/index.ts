import type { Cartesian2, Viewer } from 'cesium';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { refThrottled } from '@vueuse/core';
import { computed, shallowRef, toRef, toValue, watchEffect } from 'vue';
import { useViewer } from '../useViewer';

export interface UseScenePickOptions {
  /**
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
  /**
   * Throttled sampling (ms)
   * @default 8
   */
  throttled?: number;

  /**
   * The width of the pick rectangle.
   * @default 3
   */
  width?: MaybeRefOrGetter<number | undefined>;

  /**
   * The height of the pick rectangle.
   * @default 3
   */
  height?: MaybeRefOrGetter<number | undefined>;

}

interface PickCacheEntry {
  position: Cartesian2;
  width: number | undefined;
  height: number | undefined;
  pick: any;
}

// Cache the most recent pick for the same viewer/position/size tuple so throttled cursor updates
// do not keep calling scene.pick while the screen inputs are unchanged.
const pickCache = new WeakMap<Viewer, PickCacheEntry>();

/**
 * Uses the `scene.pick` function in Cesium's Scene object to perform screen point picking,
 * return a computed property containing the pick result, or undefined if no object is picked.
 *
 * @param windowPosition The screen coordinates of the pick point.
 */
export function useScenePick(
  windowPosition: MaybeRefOrGetter<Cartesian2 | undefined>,
  options: UseScenePickOptions = {},
): Readonly<ShallowRef<any | undefined>> {
  const { width = 3, height = 3, throttled = 8 } = options;

  const isActive = toRef(options.isActive ?? true);

  const viewer = useViewer();

  const position = refThrottled(computed(() => toValue(windowPosition)?.clone()), throttled, false, true);

  const pick = shallowRef<any | undefined>();
  watchEffect(() => {
    if (viewer.value && position.value && isActive.value) {
      const widthValue = toValue(width);
      const heightValue = toValue(height);
      const cache = pickCache.get(viewer.value);
      if (cache && cache.position.equals(position.value) && cache.width === widthValue && cache.height === heightValue) {
        pick.value = cache.pick;
      }
      else {
        const nextPick = viewer.value?.scene.pick(
          position.value,
          widthValue,
          heightValue,
        );
        pick.value = nextPick;
        pickCache.set(viewer.value, {
          position: position.value.clone(),
          width: widthValue,
          height: heightValue,
          pick: nextPick,
        });
      }
    }
    else {
      // Clear stale picks so consumers do not keep rendering a previous result after the input
      // becomes inactive or the cursor position disappears.
      pick.value = undefined;
    }
  });
  return pick;
}
