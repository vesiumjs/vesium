import { CallbackPositionProperty, Color, Entity } from 'cesium';
import { moved } from '../skeleton';

/**
 * 基础point标绘配置
 */
import { PlotScheme } from '../usePlot';

export const PlotSchemePoint = new PlotScheme({
  type: 'Point',
  complete: packable => packable.positions!.length >= 1,
  skeletons: [
    moved,
  ],
  initRender() {
    return {
      entities: [new Entity({ point: { pixelSize: 10, color: Color.RED } })],
    };
  },
  render(context) {
    const entity = context.previous.entities![0]!;
    const position = context.packable.positions[0] ?? context.mouse!;
    entity.position = new CallbackPositionProperty(() => position, true);
    return {
      entities: [entity],
    };
  },
});
