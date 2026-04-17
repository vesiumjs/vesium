import type { ScenePickResult } from '@vesium/shared';
import type { Cartesian2, ScreenSpaceEventHandler } from 'cesium';
import { ScreenSpaceEventType } from 'cesium';
import { shallowRef, watch } from 'vue';
import { useScenePick } from '../useScenePick';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';

/**
 * Parameters for graphic hover events
 */
export interface GraphicHoverEvent {
  /**
   * Event of the motion event
   */
  event: ScreenSpaceEventHandler.MotionEvent;

  /**
   * The graphic object picked by `scene.pick`
   */
  pick: ScenePickResult;

  /**
   * Whether the graphic is currently being hoverged. Returns `true` continuously while hoverging, and `false` once it ends.
   */
  hovering: boolean;

}

/**
 * Use graphic hover events with ease, and remove listener automatically on unmounted.
 */
export function useHover(
  listener: (params: GraphicHoverEvent) => void,
) {
  const motionEvent = shallowRef<ScreenSpaceEventHandler.MotionEvent>();
  const pick = useScenePick(() => motionEvent.value?.endPosition);

  const execute = (pickedValue: ScenePickResult, startPosition: Cartesian2, endPosition: Cartesian2, hovering: boolean) => {
    listener({
      event: {
        startPosition: startPosition.clone(),
        endPosition: endPosition.clone(),
      },
      pick: pickedValue,
      hovering,
    });
  };

  useScreenSpaceEventHandler(
    ScreenSpaceEventType.MOUSE_MOVE,
    ({ startPosition, endPosition }) => {
      const prevStart = motionEvent.value?.startPosition;
      const prevEnd = motionEvent.value?.endPosition;
      if (!prevStart || !prevEnd || !startPosition.equals(prevStart) || !endPosition.equals(prevEnd)) {
        motionEvent.value = { startPosition: startPosition.clone(), endPosition: endPosition.clone() };
      }
    },
  );

  // hovering
  watch([pick, motionEvent], ([pickValue, motionValue]) => {
    if (pickValue && motionValue) {
      const { startPosition, endPosition } = motionValue;
      execute(pickValue, startPosition, endPosition, true);
    }
  });

  // hover end
  watch(pick, (pickValue, prevPick) => {
    if (prevPick && motionEvent.value) {
      const { startPosition, endPosition } = motionEvent.value;
      execute(prevPick, startPosition, endPosition, false);
    }
  });
}
