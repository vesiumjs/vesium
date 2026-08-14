import { CallbackProperty, Color, ConstantPositionProperty, ConstantProperty, Entity, PolygonHierarchy, Rectangle } from 'cesium';
import { toCartesian3 } from 'vesium';
import { control, interval } from '../skeleton';
import { PlotScheme } from '../usePlot';
import { area } from './utils';

// Render sequence number per entity, used to discard stale async calculation results
const renderIds = new WeakMap<Entity, number>();

export const schemeMeasureArea = new PlotScheme({
  type: 'MeasureArea',
  allowManualComplete: packable => packable.positions!.length >= 3,
  skeletons: [
    control,
    interval,
  ],

  initRender() {
    return {
      entities: [
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
    };
  },
  render(context) {
    const entity = context.previous.entities?.[0];
    if (!entity) {
      return { entities: [] };
    }
    const { mouse, packable } = context;

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
        toCartesian3(Rectangle.center(Rectangle.fromCartesianArray(positions))),
      );
      entity.label!.text = new ConstantProperty('');

      const renderId = (renderIds.get(entity) ?? 0) + 1;
      renderIds.set(entity, renderId);
      area(positions)
        .then((e) => {
          // Discard results superseded by a newer render so an old area cannot overwrite the new one
          if (renderIds.get(entity) !== renderId) {
            return;
          }
          let text: string = '';
          if (e / 1000 / 1000 > 10) {
            text = `${(e / 1000 / 1000).toFixed(2)}km²`;
          }
          else {
            text = `${(+e).toFixed(2)}m²`;
          }
          entity.label!.text = new ConstantProperty(text);
        })
        .catch(() => {
          // Keep the label empty when the area calculation fails
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
