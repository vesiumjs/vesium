import type { PlotFeatureConstructorOptions } from '../usePlot';
import { CallbackPositionProperty, Entity } from 'cesium';
import { moved } from '../skeleton';
/**
 *  广告牌标绘方案
 */
export const PLOT_BILLBOARD_SCHEME: PlotFeatureConstructorOptions = {
  scheme: {
    type: 'Billboard',
    complete: packable => packable.positions!.length >= 1,
    skeletons: [
      moved,
    ],
    initEntites: [
      new Entity({
        billboard: {
          image: '/favicon.svg',
          width: 32,
          height: 32,
        },
      }),
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
  },
};
