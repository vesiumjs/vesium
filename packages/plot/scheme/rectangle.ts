import { CallbackProperty, Color, Entity, Rectangle } from 'cesium';
import { control, interval, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

/**
 * 内置的多边形标绘方案
 */
export const schemeRectangle = new PlotScheme({
  type: 'rectangle',
  complete: packable => packable.positions!.length >= 2,
  skeletons: [
    control,
    interval,
    moved,
  ],
  initEntites: () => [
    new Entity({
      rectangle: {
        material: Color.YELLOW.withAlpha(0.5),
      },
    }),
  ],
  render(options) {
    const { mouse, packable } = options;
    const entity = options.previous.entities?.[0]
      ?? new Entity({
        rectangle: {
          material: Color.YELLOW.withAlpha(0.5),
        },
      });

    const positions = [...packable.positions ?? []];
    mouse && positions.push(mouse);

    if (positions.length >= 2) {
      entity.rectangle!.coordinates = new CallbackProperty(() => Rectangle.fromCartesianArray(positions), false);
    }
    else {
      entity.rectangle!.coordinates = undefined;
    }

    return {
      entities: [entity],
    };
  },
});
