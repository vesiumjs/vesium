import { CallbackProperty, Cartographic, Entity, PolygonHierarchy } from 'cesium';
import { toCartesian3, toCartographic, toCoord } from 'vesium';

import { assemblingPlace } from '../geom';

import { control, interval, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

export const PlotSchemePolygonAssemblingPlace = new PlotScheme({
  type: 'PolygonAssemblingPlace',
  complete: packable => packable.positions!.length >= 3,
  skeletons: [
    moved,
    control,
    interval,
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

    if (coords.length < 2) {
      entity.polygon!.hierarchy = undefined;
      return context.previous;
    }

    if (coords.length === 2) {
      const c0 = toCartographic(coords[0])!;
      const c1 = toCartographic(coords[1])!;
      const latitude = c0.latitude;
      const height = c0.height;
      const longitude = c1.longitude - (c0.longitude - c1.longitude);
      coords.push(toCoord(new Cartographic(longitude, latitude, height))!);
    }
    const positions = assemblingPlace(coords).map(item => toCartesian3(item)!);
    const hierarchy = new PolygonHierarchy(positions);
    entity.polygon!.hierarchy = new CallbackProperty(() => hierarchy, false);
    return {
      entities: [entity],
    };
  },
});
