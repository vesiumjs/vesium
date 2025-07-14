import { CallbackPositionProperty, Entity } from 'cesium';
import { moved } from '../skeleton';

/**
 * billboard标绘配置
 */
import { PlotScheme } from '../usePlot';

export const PlotSchemeBillboard = new PlotScheme({
  type: 'Billboard',
  complete: packable => packable.positions!.length >= 1,
  skeletons: [
    moved,
  ],
  initRender: () => {
    return { entities: [new Entity({ billboard: { image: '/favicon.svg', width: 32, height: 32 } })] };
  },
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
