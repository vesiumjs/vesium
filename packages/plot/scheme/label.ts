import { CallbackPositionProperty, Entity } from 'cesium';
import { moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

/**
 *  标签文字标绘方案
 */
export const schemeLabel = new PlotScheme({
  type: 'label',
  complete: packable => packable.positions!.length >= 1,
  skeletons: [
    moved,
  ],
  initEntites: () => [
    new Entity({ label: { text: 'Label' } }),
  ],
  render(options) {
    const { mouse, packable } = options;
    const entity = options.previous.entities?.[0] ?? new Entity({ label: {} });
    const position = packable.positions?.[0] ?? mouse;
    entity.position = new CallbackPositionProperty(() => position, true);

    return {
      entities: [entity],
    };
  },
});
