import type { CommonCoord } from '@vesium/shared';
import type { MaybeComputedElementRef } from '@vueuse/core';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { cartesianToCanvasCoord, toCartesian3 } from '@vesium/shared';
import { unrefElement, useElementBounding, useElementSize } from '@vueuse/core';
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
   */
  clampToGround?: MaybeRefOrGetter<boolean>;
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
  style: ComputedRef<string | undefined>;
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
    () => {
      const scene = viewer.value?.scene;
      if (!scene || !cartesian3.value) {
        coord.value = undefined;
        return;
      }

      let finalPosition = toValue(clampToGround) ? scene.clampToHeight(cartesian3.value) : cartesian3.value;
      finalPosition ??= cartesian3.value;
      const result = cartesianToCanvasCoord(finalPosition, scene);
      if (result) {
        result.x = +result.x.toFixed(1);
        result.y = +result.y.toFixed(1);
        coord.value = !Cartesian2.equals(result, coord.value) ? result : coord.value;
      }
    },
  );

  const canvasBounding = useElementBounding(() => viewer.value?.canvas.parentElement);
  const targetSize = useElementSize(target, undefined, { box: 'border-box' });

  const finalOffset = computed(() => {
    const _offset = toValue(offset);
    let x = _offset?.x ?? 0;
    const _horizontal = toValue(horizontal);
    if (_horizontal === 'center') {
      x -= targetSize.width.value / 2;
    }
    else if (_horizontal === 'right') {
      x -= targetSize.width.value;
    }

    let y = _offset?.y ?? 0;
    const _vertical = toValue(vertical);
    if (_vertical === 'center') {
      y -= targetSize.height.value / 2;
    }
    else if (_vertical === 'bottom') {
      y -= targetSize.height.value;
    }

    return {
      x,
      y,
    };
  });

  const x = computed(() => {
    let v = coord.value?.x ?? 0;
    if (toValue(referenceWindow)) {
      v += canvasBounding.x.value;
    }
    return +(v + finalOffset.value.x).toFixed(1);
  });

  const y = computed(() => {
    let v = coord.value?.y ?? 0;
    if (toValue(referenceWindow)) {
      v += canvasBounding.y.value;
    }
    return +(v + finalOffset.value.y).toFixed(1);
  });

  const style = computed(() => `left:${x.value}px;top:${y.value}px;`);

  watchEffect(() => {
    const applyStyle = toValue(options.applyStyle ?? true);
    if (!applyStyle) {
      return;
    }
    const element = unrefElement(target);
    if (element && applyStyle) {
      element.style?.setProperty?.('left', `${x.value}px`);
      element.style?.setProperty?.('top', `${y.value}px`);
    }
  }, {
    flush: 'post',
  });

  return {
    x,
    y,
    style,
  };
}
