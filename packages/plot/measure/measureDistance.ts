import { CallbackPositionProperty, CallbackProperty, Cartesian3, Color, Entity, LabelGraphics, PolylineGraphics } from 'cesium';
import { control } from '../skeleton';
import { PlotScheme } from '../usePlot';
import { distance } from './utils';

// Render sequence number per entity, used to discard stale async calculation results
const renderIds = new WeakMap<Entity, number>();

export const schemeMeasureDistance = new PlotScheme({
  type: 'MeasureDistance',
  allowManualComplete: packable => packable.positions!.length >= 2,
  skeletons: [
    control,
  ],
  initRender() {
    return {
      entities: [
        new Entity({
          polyline: {
            width: 2,
            material: Color.YELLOW.withAlpha(0.5),
          },
        }),
      ],
    };
  },
  render(context) {
    const { mouse, packable, previous } = context;

    const entities = previous.entities;
    if (!entities?.[0]) {
      return { entities };
    }
    const pl = entities[0];

    const positions = [...packable.positions ?? []];
    mouse && positions.push(mouse);

    if (positions.length < 2) {
      // Invalidate the pending calculation and trim the label entities, so undoing back to fewer
      // than 2 points cannot write stale results
      renderIds.set(pl, (renderIds.get(pl) ?? 0) + 1);
      entities.splice(1);
      return {
        entities,
      };
    }

    pl.polyline ??= new PolylineGraphics();
    pl.polyline!.positions = new CallbackProperty(() => positions, false);

    positions.forEach((item, index) => {
      if (!entities[index + 1]) {
        entities[index + 1] = new Entity({
          position: item,
          label: new LabelGraphics({
            backgroundColor: Color.fromCssColorString('#fff'),
            font: '12pt sans-serif',

          }),
        });
      }
    });

    entities.splice(positions.length, entities.length - positions.length - 1);

    const renderId = (renderIds.get(pl) ?? 0) + 1;
    renderIds.set(pl, renderId);
    distance(positions)
      .then(({ count, stages }) => {
        // Discard results superseded by a newer render so an old distance cannot overwrite the
        // new labels or write out of bounds
        if (renderIds.get(pl) !== renderId) {
          return;
        }
        stages.forEach((stage, index) => {
          entities[index + 1]!.position = new CallbackPositionProperty(() => Cartesian3.midpoint(positions[index], positions[index + 1], new Cartesian3()), false);
          entities[index + 1]!.label!.text = new CallbackProperty(() => `${stage.toFixed(2)} m`, false);
        });
        if (stages.length > 1) {
          entities.at(-1)!.position = new CallbackPositionProperty(() => positions.at(-1), false);
          entities.at(-1)!.label!.text = new CallbackProperty(() => `${count.toFixed(2)} m`, false);
        }
        else {
          entities.at(-1)!.position = undefined;
          entities.at(-1)!.label!.text = undefined;
        }
      })
      .catch(() => {
        // Keep the labels empty when the distance calculation fails
      });

    return {
      entities,
    };
  },
});
