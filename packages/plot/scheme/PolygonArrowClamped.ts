import { CallbackProperty, Entity, PolygonHierarchy } from 'cesium';

import { toCartesian3, toCoord } from 'vesium';

import { arrowClamped } from '../geom';
import { control, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

export const PlotSchemePolygonArrowClamped = new PlotScheme({
  type: 'PolygonArrowClamped',
  complete: packable => packable.positions!.length >= 5,
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
    if (points.length < 5) {
      const mouse = context.mouse;
      mouse && points.push(mouse.clone());
    }

    const coords = points.map(e => toCoord(e)!);

    if (coords.length >= 3) {
      const positions = arrowClamped(coords);
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
