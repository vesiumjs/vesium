/**
 * polyline
 */
import { CallbackProperty, Color, Entity } from 'cesium';

import { control, intervalNonclosed, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

export const PlotSchemePolyline = new PlotScheme({
  type: 'Polyline',
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
    const cache = positions.length >= 2 ? positions : [];
    entity.polyline!.positions = new CallbackProperty(() => cache, false);
    return {
      entities: [entity],
    };
  },
});
