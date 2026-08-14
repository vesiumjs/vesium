import type { PlotFeature, PlotSkeleton } from '../usePlot';
import { Cartesian3, Color } from 'cesium';
import { canvasCoordToCartesian } from 'vesium';
import { PlotAction } from '../usePlot';

/**
 * Draws non-closed interval skeleton points, e.g. for lines. When dragging, a control point is
 * inserted between the two points and dragged continuously.
 */
export function intervalNonclosed(): PlotSkeleton {
  // Drag state is isolated per plot feature so that a shared scheme singleton cannot leak state
  // between features.
  const dragIndexes = new WeakMap<PlotFeature, number>();
  return {
    disabled: ({ active, defining }) => !active || defining,
    cursor: 'pointer',
    dragCursor: 'crosshair',
    format(packable) {
      const _positions = packable.positions ?? [];
      if (_positions.length < 2) {
        return [];
      }
      const midpoints: Cartesian3[] = [];
      for (let i = 0; i < _positions.length - 1; i++) {
        midpoints.push(Cartesian3.midpoint(_positions[i], _positions[i + 1], new Cartesian3()));
      }
      return midpoints;
    },
    onDrag({ feature, viewer, sampled, packable, event, index, lockCamera, dragging }) {
      lockCamera();
      const position = canvasCoordToCartesian(event.endPosition, viewer.scene);
      if (!position) {
        return;
      }
      const positions = [...packable.positions ?? []];
      const dragIndex = dragIndexes.get(feature) ?? -1;
      // Treat as a new drag when the tracked dragIndex is stale: either no drag is active, the
      // drag target index changed (e.g. a previous LEFT_UP was missed), or the positions were
      // shrunk below the tracked insertion point.
      if (dragIndex === -1 || dragIndex !== index || dragIndex + 1 >= positions.length) {
        dragIndexes.set(feature, index);
        positions.splice(index + 1, 0, position);
      }
      else {
        positions[dragIndex + 1] = position;
      }
      if (!dragging) {
        dragIndexes.set(feature, -1);
      }
      sampled.setSample({
        time: packable.time,
        derivative: packable.derivative,
        positions,
      });
    },
    render: ({ position, action }) => {
      const colors = {
        [PlotAction.IDLE]: Color.GREEN.withAlpha(0.4),
        [PlotAction.HOVER]: Color.GREEN.withAlpha(0.6),
        [PlotAction.ACTIVE]: Color.GREEN.withAlpha(1.0),
      };
      return {
        position,
        point: {
          pixelSize: 6,
          color: colors[action],
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          outlineWidth: 1,
          outlineColor: Color.WHITE.withAlpha(0.4),
        },
      };
    },
  };
}
