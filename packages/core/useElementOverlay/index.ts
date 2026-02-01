import type { CommonCoord } from '@vesium/shared';
import type { MaybeComputedElementRef } from '@vueuse/core';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { cartesianToCanvasCoord, throttle, toCartesian3 } from '@vesium/shared';
import { useElementBounding } from '@vueuse/core';
import { Cartesian2 } from 'cesium';
import { computed, shallowRef, toValue, watchEffect } from 'vue';
import { useCesiumEventListener } from '../useCesiumEventListener';
import { useViewer } from '../useViewer';

export interface UseElementOverlayOptions {
  /**
   * Horizontal origin of the target element
   * @default `center`
   */
  horizontal?: MaybeRefOrGetter<'center' | 'left' | 'right' | undefined>;

  /**
   * Vertical origin of the target element
   * @default `bottom`
   */
  vertical?: MaybeRefOrGetter<'center' | 'bottom' | 'top' | undefined>;

  /**
   * Pixel offset presented by the target element
   * @default {x:0,y:0}
   */
  offset?: MaybeRefOrGetter<{ x?: number; y?: number } | undefined>;

  /**
   * The reference element for calculating the position of the target element
   *  - `true` refer to the browser viewport
   *  - `false` refer to the Cesium canvas
   */
  referenceWindow?: MaybeRefOrGetter<boolean>;

  /**
   * Whether to apply style to the target element
   * @default true
   */
  applyStyle?: MaybeRefOrGetter<boolean>;

  /**
   * The position will be clamped to the ground
   *
   * true: Clamp to the ground and more detailed.
   *
   * 'simple': Only calculate ground height, excluding factors such as 3D tileset.
   */
  clampToGround?: MaybeRefOrGetter<boolean | 'simple'>;
}

export interface UseElementOverlayRetrun {
  /**
   * Calculation result of the target element's horizontal direction
   */
  x: ComputedRef<number>;

  /**
   * Calculation result of the target element's vertical direction
   */
  y: ComputedRef<number>;

  /**
   * Calculation `css` of the target element
   */
  style: ComputedRef<{ left: string; top: string }>;
}

/**
 * Cesium HtmlElement Overlay
 */
export function useElementOverlay(
  target?: MaybeComputedElementRef,
  position?: MaybeRefOrGetter<CommonCoord | undefined>,
  options: UseElementOverlayOptions = {},
): UseElementOverlayRetrun {
  const {
    referenceWindow,
    horizontal = 'center',
    vertical = 'bottom',
    clampToGround,
    offset = { x: 0, y: 0 },
  } = options;

  const viewer = useViewer();

  const cartesian3 = computed(() => {
    const positionValue = toValue(position);
    if (!positionValue) {
      return undefined;
    }
    return toCartesian3(positionValue);
  });

  const coord = shallowRef<Cartesian2>();

  useCesiumEventListener(
    () => viewer.value?.scene.postUpdate,
    throttle(async () => {
      const scene = viewer.value?.scene;
      if (!scene || !cartesian3.value) {
        coord.value = undefined;
        return;
      }

      const _clampToGround = toValue(clampToGround);
      let finalPosition = cartesian3.value;
      if (_clampToGround === 'simple') {
        finalPosition = scene.clampToHeight(finalPosition);
      }
      else if (_clampToGround) {
        const [result] = await scene.clampToHeightMostDetailed([finalPosition]);
        finalPosition = result;
      }
      if (!finalPosition) {
        finalPosition = cartesian3.value;
      }
      const result = cartesianToCanvasCoord(finalPosition, scene);
      if (result) {
        result.x = +result.x.toFixed(1);
        result.y = +result.y.toFixed(1);
        coord.value = !Cartesian2.equals(result, coord.value) ? result : coord.value;
      }
    }, 8),
  );

  const canvasBounding = useElementBounding(() => viewer.value?.canvas.parentElement);
  const targetBounding = useElementBounding(target);

  const finalOffset = computed(() => {
    const _offset = toValue(offset);
    let x = _offset?.x ?? 0;
    const _horizontal = toValue(horizontal);
    if (_horizontal === 'center') {
      x -= targetBounding.width.value / 2;
    }
    else if (_horizontal === 'right') {
      x -= targetBounding.width.value;
    }

    let y = _offset?.y ?? 0;
    const _vertical = toValue(vertical);
    if (_vertical === 'center') {
      y -= targetBounding.height.value / 2;
    }
    else if (_vertical === 'bottom') {
      y -= targetBounding.height.value;
    }

    return {
      x,
      y,
    };
  });

  const location = computed(() => {
    const data = {
      x: coord.value?.x ?? 0,
      y: coord.value?.y ?? 0,
    };
    if (toValue(referenceWindow)) {
      data.x += canvasBounding.x.value;
      data.y += canvasBounding.y.value;
    }
    return {
      x: finalOffset.value.x + data.x,
      y: finalOffset.value.y + data.y,
    };
  });

  const x = computed(() => location.value.x);
  const y = computed(() => location.value.y);

  const style = computed(() => ({ left: `${x.value?.toFixed(2)}px`, top: `${y.value?.toFixed(2)}px` }));

  watchEffect(() => {
    const element = toValue(target) as HTMLElement;
    if (element && toValue(options.applyStyle ?? true)) {
      element.style?.setProperty?.('left', style.value.left);
      element.style?.setProperty?.('top', style.value.top);
    }
  });

  return {
    x,
    y,
    style,
  };
}
