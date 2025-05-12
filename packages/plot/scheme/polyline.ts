import { CallbackProperty, Entity } from 'cesium';
import { control, intervalNonclosed, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

/**
 * 内置的线段标绘方案
 */
export const schemePolyline = new PlotScheme({
  type: 'polyline',
  forceComplete: packable => packable.positions!.length >= 2,
  skeletons: [
    control,
    intervalNonclosed,
    moved,
  ],
  initEntites: () => [
    new Entity({ polyline: { width: 1 } }),
  ],
  render(options) {
    const { mouse, packable } = options;
    const entity = options.previous.entities?.[0] ?? new Entity({ polyline: { } });
    entity.polyline!.positions = new CallbackProperty(() => {
      const positions = [...packable.positions ?? []].concat(mouse ? [mouse] : []);
      return positions.length >= 2 ? positions : [];
    }, false);

    return {
      entities: [entity],
    };
  },
},
);
