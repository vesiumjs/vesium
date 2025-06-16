import { CallbackPositionProperty, CallbackProperty, Cartesian3, Color, Entity, LabelGraphics, PolylineGraphics } from 'cesium';
import { control } from '../skeleton';
import { PlotScheme } from '../usePlot';
import { distance } from './utils';

export const schemeMeasureDistance = new PlotScheme({
  type: 'measureDistance',
  allowManualComplete: packable => packable.positions!.length >= 2,
  skeletons: [
    control,
  ],
  initEntites: () => [
    new Entity({
      polyline: {
        width: 2,
        material: Color.YELLOW.withAlpha(0.5),
      },
    }),
  ],
  render(options) {
    const { mouse, packable, previous } = options;
    const previousEntities = previous.entities ?? this.initEntites!()!;

    const entities = [...previousEntities];

    const positions = [...packable.positions ?? []];
    mouse && positions.push(mouse);

    if (positions.length < 2) {
      return {
        entities,
      };
    }

    const pl = entities[0]!;

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

    distance(positions).then(({ count, stages }) => {
      stages.forEach((stage, index) => {
        entities[index + 1]!.position = new CallbackPositionProperty(() => Cartesian3.midpoint(positions[index], positions[index + 1], new Cartesian3()), false);
        entities[index + 1]!.label!.text = new CallbackProperty(() => `${stage.toFixed(2)} m`, false);
      });
      if (stages.length > 1) {
        entities[entities.length - 1]!.position = new CallbackPositionProperty(() => positions[positions.length - 1], false);
        entities[entities.length - 1]!.label!.text = new CallbackProperty(() => `${count.toFixed(2)} m`, false);
      }
      else {
        entities[entities.length - 1]!.position = undefined;
        entities[entities.length - 1]!.label!.text = undefined;
      }
    });

    return {
      entities,
    };
  },
});
