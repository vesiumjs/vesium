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
  pick: any;

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

  const execute = (pick: unknown, startPosition: Cartesian2, endPosition: Cartesian2, hovering: boolean) => {
    listener({
      event: {
        startPosition: startPosition.clone(),
        endPosition: endPosition.clone(),
      },
      pick,
      hovering,
    });
  };

  useScreenSpaceEventHandler(
    ScreenSpaceEventType.MOUSE_MOVE,
    ({ startPosition, endPosition }) => {
      if (!startPosition.equals(motionEvent.value?.startPosition) || !endPosition.equals(motionEvent.value?.endPosition)) {
        motionEvent.value = { startPosition: startPosition.clone(), endPosition: endPosition.clone() };
      }
    },
  );

  // hovering
  watch([pick, motionEvent], ([pick, motionEvent]) => {
    if (pick && motionEvent) {
      const { startPosition, endPosition } = motionEvent;
      execute(pick, startPosition, endPosition, true);
    }
  });

  // hover end
  watch(pick, (pick, prevPick) => {
    if (prevPick && motionEvent.value) {
      const { startPosition, endPosition } = motionEvent.value;
      execute(prevPick, startPosition, endPosition, false);
    }
  });
}
