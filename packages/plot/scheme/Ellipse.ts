/**
 * ellipse标绘配置 圆形扩散波
 */
import { CallbackProperty, Cartesian3, ConstantPositionProperty, Entity } from 'cesium';
import { control, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

export const PlotSchemeEllipse = new PlotScheme({
  type: 'Ellipse',
  complete: packable => packable.positions!.length >= 2,
  skeletons: [
    moved,
    control,
  ],
  initRender() {
    return {
      entities: [new Entity({ ellipse: {} })],
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
    entity.ellipse!.semiMinorAxis = new CallbackProperty(() => radius || 1, false);
    entity.ellipse!.semiMajorAxis = entity.ellipse!.semiMinorAxis;

    return {
      entities: [entity],
    };
  },
});
