import * as turf from '@turf/turf';

import { CallbackProperty, Color, Entity } from 'cesium';

import { toCartesian3, toCoord } from 'vesium';
import { control, intervalNonclosed, moved } from '../skeleton';
/**
 * polyline-Curve
 */
import { PlotScheme } from '../usePlot';

export const PlotSchemePolylineCurve = new PlotScheme({
  type: 'PolylineCurve',
  allowManualComplete: packable => packable.positions!.length > 1,
  skeletons: [
    moved,
    control,
    intervalNonclosed,
  ],
  initRender() {
    return {
      entities: [new Entity({ polyline: { material: Color.RED, width: 2 } })],
    };
  },
  render(context) {
    const entity = context.previous.entities![0]!;

    const positions = [...context.packable.positions];
    const mouse = context.mouse;
    mouse && positions.push(mouse.clone());
    if (positions.length < 2) {
      entity.polyline!.positions = undefined;
      return context.previous;
    }

    const coords = positions.map(position => toCoord(position)!);
    const { geometry: { coordinates } } = turf.bezierSpline(turf.lineString(coords));

    entity.polyline!.positions = new CallbackProperty(() => coordinates.map(toCartesian3), false);
    return {
      entities: [entity],
    };
  },
});
