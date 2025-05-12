import { CallbackProperty, Color, ConstantPositionProperty, ConstantProperty, Entity, PolygonHierarchy, Rectangle } from 'cesium';
import { toCartesian3 } from 'vesium';
import { control, interval } from '../skeleton';
import { PlotScheme } from '../usePlot';

export const schemeMeasureArea = new PlotScheme({
  type: 'measureArea',
  forceComplete: packable => packable.positions!.length >= 3,
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
      entity.position = new ConstantPositionProperty(
        toCartesian3(
          Rectangle.center(Rectangle.fromCartesianArray(positions)),
        ),
      );
      entity.label!.text = new ConstantProperty('123123');
      entity.polyline!.positions = undefined;
      entity.polygon!.hierarchy = new CallbackProperty(() => {
        positions.push(positions[0]);
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
