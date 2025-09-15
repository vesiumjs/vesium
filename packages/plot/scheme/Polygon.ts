import { CallbackProperty, Entity, PolygonHierarchy } from 'cesium';
import { control, interval, moved } from '../skeleton';
/**
 * 基础Polygon标绘配置
 */
import { PlotScheme } from '../usePlot';

export const PlotSchemePolygon = new PlotScheme({
  type: 'Polygon',
  allowManualComplete: packable => packable.positions!.length >= 2,
  skeletons: [
    moved,
    control,
    interval,
  ],
  initRender: () => {
    return {
      entities: [new Entity({ polyline: {}, polygon: {} })],
    };
  },
  render(options) {
    const { mouse, packable } = options;
    const entity = options.previous.entities![0];
    const positions = [...packable.positions ?? []];
    mouse && positions.push(mouse);

    if (positions.length === 2) {
      entity.polygon!.hierarchy = undefined;
      entity.polyline!.positions = new CallbackProperty(() => positions, false);
    }
    else if (positions.length >= 3) {
      entity.polyline!.positions = undefined;
      entity.polygon!.hierarchy = new CallbackProperty(() => {
        positions.push(positions[0]);
        return positions.length >= 3 ? new PolygonHierarchy([...positions]) : undefined;
      }, false);
    }
    else {
      entity.polygon!.hierarchy = undefined;
      entity.polyline!.positions = undefined;
    }

    return {
      entities: [entity],
    };
  },
});
