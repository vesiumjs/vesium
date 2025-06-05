import { CallbackProperty, Color, ConstantPositionProperty, ConstantProperty, Entity, PolygonHierarchy, Rectangle } from 'cesium';
import { toCartesian3 } from 'vesium';
import { control, interval } from '../skeleton';
import { PlotScheme } from '../usePlot';
import { area } from './utils';

export const schemeMeasureArea = new PlotScheme({
  type: 'measureArea',
  allowManualComplete: packable => packable.positions!.length >= 3,
  skeletons: [
    control,
    interval,
  ],
  initEntites: () => [
    new Entity({
      label: {
        font: '14pt',
      },
      polyline: {
        material: Color.YELLOW.withAlpha(0.5),
      },
      polygon: {
        material: Color.YELLOW.withAlpha(0.5),
      },
    }),
  ],
  render(options) {
    const { mouse, packable } = options;
    const entity = options.previous.entities?.[0]
      ?? new Entity({
        label: {
          font: '14pt',
        },
        polyline: {
          material: Color.YELLOW.withAlpha(0.5),
        },
        polygon: {
          material: Color.YELLOW.withAlpha(0.5),
        },
      });

    const positions = [...packable.positions ?? []];
    mouse && positions.push(mouse);

    if (positions.length === 2) {
      entity.position = undefined;
      entity.label!.text = undefined;
      entity.polygon!.hierarchy = undefined;
      entity.polyline!.positions = new CallbackProperty(() => positions, false);
    }
    else if (positions.length >= 3) {
      positions.push(positions[0]);
      entity.position = new ConstantPositionProperty(
        toCartesian3(
          Rectangle.center(Rectangle.fromCartesianArray(positions)),
        ),
      );
      entity.label!.text = new ConstantProperty('');

      area(positions).then((e) => {
        let text: string = '';
        if (e / 1000 / 1000 > 10) {
          text = `${(e / 1000 / 1000).toFixed(2)}km²`;
        }
        else {
          text = `${(+e).toFixed(2)}m²`;
        }
        entity.label!.text = new ConstantProperty(text);
      });
      entity.polyline!.positions = undefined;
      entity.polygon!.hierarchy = new CallbackProperty(() => {
        return positions.length >= 3 ? new PolygonHierarchy([...positions]) : undefined;
      }, false);
    }
    else {
      entity.position = undefined;
      entity.polygon!.hierarchy = undefined;
      entity.polyline!.positions = undefined;
    }

    return {
      entities: [entity],
    };
  },
});
