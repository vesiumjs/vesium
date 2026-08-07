import type { PlotFeature, PlotSkeleton } from '../usePlot';
import { Cartesian3, Color } from 'cesium';
import { canvasCoordToCartesian } from 'vesium';
import { PlotAction } from '../usePlot';

/**
 * 绘制非封闭的间隔框架点，如线段。拖拽时，会在两点之间插入一个控制点，并持续拖拽该点。
 */
export function intervalNonclosed(): PlotSkeleton {
  // 拖拽状态按标绘实例隔离，避免多个标绘共用方案单例时相互污染
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
      // 索引越界（如上次拖拽的 LEFT_UP 丢失后残留）时视为新拖拽重新插入
      if (dragIndex === -1 || dragIndex + 1 >= positions.length) {
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
