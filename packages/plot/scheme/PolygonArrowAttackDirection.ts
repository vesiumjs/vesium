import { arrowAttackDirection } from '@vesium/geometry';
import { CallbackProperty, Entity, PolygonHierarchy } from 'cesium';

import { toCartesian3, toCoord } from 'vesium';

import { control, intervalNonclosed, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

export const PlotSchemePolygonArrowAttackDirection = new PlotScheme({
  type: 'PolygonArrowAttackDirection',
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

    const points = context.packable.positions;
    context.mouse && points.push(context.mouse.clone());
    const coords = points.map(e => toCoord(e)!);

    if (coords.length < 3) {
      entity.polygon!.hierarchy = undefined;
      return context.previous;
    }
    const positions = arrowAttackDirection(coords).map(item => toCartesian3(item)!);
    const hierarchy = new PolygonHierarchy(positions);
    entity.polygon!.hierarchy = new CallbackProperty(() => hierarchy, false);
    return {
      entities: [entity],
    };
  },
});
