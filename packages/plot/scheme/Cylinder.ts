import { CallbackProperty, Cartesian3, ConstantPositionProperty, Entity } from 'cesium';

/**
 * cylinder标绘配置
 */
import { toProperty, toPropertyValue } from 'vesium';

import { control, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

export const PlotSchemeCylinder = new PlotScheme({
  type: 'Cylinder',
  complete: packable => packable.positions!.length >= 2,
  skeletons: [
    moved,
    control,
  ],
  initRender() {
    return {
      entities: [
        new Entity({
          cylinder: {},
        }),
      ],
    };
  },
  render(context) {
    const entity = context.previous.entities![0]!;
    const positions = [...context.packable.positions];
    if (positions.length === 0) {
      return context.previous;
    }

    if (positions.length === 1) {
      const position = context.mouse;
      position && positions.push(position);
    }
    if (positions.length < 2) {
      return context.previous;
    }
    entity.position = new ConstantPositionProperty(positions[0]);
    const radius = Cartesian3.distance(positions[0], positions[1]);
    entity.cylinder!.bottomRadius = new CallbackProperty(() => radius, false);
    if (context.defining || !toPropertyValue(entity.cylinder!.length)) {
      entity.cylinder!.length = toProperty(radius * 2);
    }
    return {
      entities: [entity],
    };
  },
});
