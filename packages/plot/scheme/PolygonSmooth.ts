import * as turf from '@turf/turf';
import { CallbackProperty, Entity, PolygonHierarchy } from 'cesium';
import { toCartesian3, toCoord } from 'vesium';
import { control, intervalNonclosed, moved } from '../skeleton';
/**
 * polygon-smooth 标绘配置 平滑闭合面
 */
import { PlotScheme } from '../usePlot';

export const PlotSchemePolygonSmooth = new PlotScheme({
  type: 'PolygonSmooth',
  allowManualComplete: packable => packable.positions!.length >= 3,
  skeletons: [
    moved,
    control,
    intervalNonclosed,
  ],
  initRender() {
    return {
      entities: [new Entity({ polygon: {} })],
    };
  },
  render(context) {
    const entity = context.previous.entities![0]!;
    const positions = context.packable.positions;
    const mousePosition = context.mouse;
    mousePosition && positions.push(mousePosition.clone());
    if (positions.length <= 2) {
      entity.polygon!.hierarchy = undefined;
      return context.previous;
    }
    const wgs84s = positions.map(e => toCoord(e)!);
    wgs84s.push(wgs84s[0]);
    const { features } = turf.polygonSmooth(turf.polygon([wgs84s]), {
      iterations: 3,
    });
    const cartesians = features[0].geometry.coordinates[0].map(item => toCartesian3(item as any)).filter(e => !!e);
    const hierarchy = new PolygonHierarchy(cartesians);
    entity.polygon!.hierarchy = new CallbackProperty(() => hierarchy, false);
    return {
      entities: [entity],
    };
  },
});
