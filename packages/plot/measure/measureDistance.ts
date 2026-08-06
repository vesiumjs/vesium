import { CallbackPositionProperty, CallbackProperty, Cartesian3, Color, Entity, LabelGraphics, PolylineGraphics } from 'cesium';
import { control } from '../skeleton';
import { PlotScheme } from '../usePlot';
import { distance } from './utils';

// 每个实体的渲染序号，用于丢弃过期渲染的异步计算结果
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

    const entities = previous.entities!;

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

    const renderId = (renderIds.get(pl) ?? 0) + 1;
    renderIds.set(pl, renderId);
    distance(positions)
      .then(({ count, stages }) => {
        // 已被更新的渲染取代时丢弃结果，避免旧数据覆盖新距离或越界写入
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
        // 距离计算失败时保持标签为空
      });

    return {
      entities,
    };
  },
});
