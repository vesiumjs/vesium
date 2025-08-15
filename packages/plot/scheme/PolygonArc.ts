import { arc } from '@vesium/geometry';
import { CallbackProperty, Entity, PolygonHierarchy } from 'cesium';

import { toCartesian3, toCoord } from 'vesium';

import { control, moved } from '../skeleton';
/**
 * 弓形
 */
import { PlotScheme } from '../usePlot';

export const PlotSchemePolygonArc = new PlotScheme({
  type: 'PolygonArc',
  complete: packable => packable.positions!.length >= 3,
  skeletons: [
    moved,
    control,
  ],
  initRender() {
    return {
      entities: [new Entity({ polygon: {} })],
    };
  },
  render(context) {
    const entity = context.previous.entities![0]!;

    const points = context.packable.positions;
    if (points.length < 3) {
      context.mouse && points.push(context.mouse.clone());
    }
    const coords = points.map(e => toCoord(e)!);
    if (coords.length < 3) {
      entity.polygon!.hierarchy = undefined;
      return context.previous;
    }
    const positions = arc(coords).map(item => toCartesian3(item)!);
    const hierarchy = new PolygonHierarchy(positions);
    entity.polygon!.hierarchy = new CallbackProperty(() => hierarchy, false);
    return {
      entities: [entity],
    };
  },
});
