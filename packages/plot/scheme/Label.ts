import { CallbackPositionProperty, Entity } from 'cesium';
import { moved } from '../skeleton';

/**
 * 基础label标绘配置
 */
import { PlotScheme } from '../usePlot';

export const PlotSchemeLabel = new PlotScheme({
  type: 'Label',
  complete: packable => packable.positions!.length >= 1,
  skeletons: [
    moved,
  ],
  initRender() {
    return {
      entities: [new Entity({ label: { text: 'Label' } })],
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
