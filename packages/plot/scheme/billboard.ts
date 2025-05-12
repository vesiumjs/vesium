import { CallbackPositionProperty, Entity } from 'cesium';
import { moved } from '../skeleton';
import { PlotScheme } from '../usePlot';
/**
 *  广告牌标绘方案
 */
export const schemeBillboard = new PlotScheme({
  type: 'billboard',
  complete: packable => packable.positions!.length >= 1,
  skeletons: [
    moved,
  ],
  initEntites: () => [
    new Entity({ billboard: { image: '/favicon.svg', width: 32, height: 32 } }),
  ],
  render(options) {
    const { mouse, packable } = options;
    const entity = options.previous.entities?.[0] ?? new Entity({ billboard: { } });
    const position = packable.positions?.[0] ?? mouse;
    entity.position = new CallbackPositionProperty(() => position, true);

    return {
      entities: [entity],
    };
  },
});
