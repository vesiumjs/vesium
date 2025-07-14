import { CallbackProperty, Entity, PolygonHierarchy } from 'cesium';
import { toCartesian3, toCoord } from 'vesium';

import { flagRect } from '../geom';

import { control, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

export const PlotSchemePolygonFlagRect = new PlotScheme({
  type: 'PolygonFlagRect',
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
    context.mouse && points.push(context.mouse.clone());
    const coords = points.map(e => toCoord(e)!); ;

    if (coords.length < 2) {
      entity.polygon!.hierarchy = undefined;
      return context.previous;
    }
    const positions = flagRect(coords).map(item => toCartesian3(item)!);
    const hierarchy = new PolygonHierarchy(positions);
    entity.polygon!.hierarchy = new CallbackProperty(() => hierarchy, false);
    return {
      entities: [entity],
    };
  },
});
