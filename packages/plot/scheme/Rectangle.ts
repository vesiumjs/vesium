import { CallbackProperty, Entity, Rectangle } from 'cesium';

import { control, moved } from '../skeleton';
/**
 * rectangle
 */
import { PlotScheme } from '../usePlot';

export const PlotSchemeRectangle = new PlotScheme({
  type: 'Rectangle',
  complete: packable => packable.positions!.length >= 2,
  skeletons: [
    moved,
    control,
  ],
  initRender() {
    return {
      entities: [new Entity({ rectangle: {} })],
    };
  },
  render(context) {
    const entity = context.previous.entities![0]!;
    const positions = [...context.packable.positions];
    const mouse = context.mouse;
    mouse && positions.push(mouse.clone());
    if (positions.length < 2) {
      entity.rectangle!.coordinates = undefined;
      return context.previous;
    }
    const coordinates = Rectangle.fromCartesianArray(positions ?? []);
    entity.rectangle!.coordinates = new CallbackProperty(() => coordinates, false);
    return {
      entities: [entity],
    };
  },
});
