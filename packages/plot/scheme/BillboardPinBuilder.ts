import { CallbackPositionProperty, Entity } from 'cesium';
import { moved } from '../skeleton';

/**
 * billboard-pin-builder标绘配置
 */
import { PlotScheme } from '../usePlot';

export const PlotSchemeBillboardPinBuilder = new PlotScheme({
  type: 'BillboardPinBuilder',
  complete: packable => packable.positions!.length >= 1,
  skeletons: [
    moved,
  ],
  initRender() {
    return {
      entities: [new Entity({ billboard: {} })],
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
