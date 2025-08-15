import { arrowStraightSharp } from '@vesium/geometry';
import { CallbackProperty, Entity, PolygonHierarchy } from 'cesium';

import { toCartesian3, toCoord } from 'vesium';

import { control, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

export const PlotSchemePolygonArrowStraightSharp = new PlotScheme({
  type: 'PolygonArrowStraightSharp',
  complete: packable => packable.positions!.length >= 2,
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
    if (points.length < 2) {
      const mouse = context.mouse;
      mouse && points.push(mouse.clone());
    }

    const coords = points.map(e => toCoord(e)!);

    if (coords.length >= 2) {
      const positions = arrowStraightSharp(coords);
      const hierarchy = new PolygonHierarchy(positions.map(item => toCartesian3(item)!));
      entity.polygon!.hierarchy = new CallbackProperty(() => hierarchy, false);
    }
    else {
      entity.polygon!.hierarchy = undefined;
    }
    return {
      entities: [entity],
    };
  },
});
