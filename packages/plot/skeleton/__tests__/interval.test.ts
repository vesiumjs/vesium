import { Cartesian3, JulianDate } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { PlotFeature } from '../../usePlot/PlotFeature';
import { PlotScheme } from '../../usePlot/PlotScheme';
import { SampledPlotProperty } from '../../usePlot/SampledPlotProperty';
import { interval } from '../interval';

vi.mock('vesium', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    canvasCoordToCartesian: () => new Cartesian3(99, 0, 0),
  };
});

function createFeature() {
  const sampled = new SampledPlotProperty({
    packables: [{
      time: new JulianDate(),
      positions: [new Cartesian3(0, 0, 0), new Cartesian3(1, 0, 0)],
    }],
  });
  const scheme = new PlotScheme({
    type: `interval-test-${Date.now()}-${Math.random()}`,
    initRender: () => ({}),
    skeletons: [interval],
  });
  return new PlotFeature({ scheme, sampled });
}

describe('interval skeleton drag state', () => {
  it('isolates dragIndex per plot feature', () => {
    const featureA = createFeature();
    const featureB = createFeature();
    const skeleton = interval();
    const event = { endPosition: { x: 1, y: 1 } };

    const drag = (feature: PlotFeature, index: number, dragging: boolean) => {
      skeleton.onDrag!({
        feature,
        viewer: {} as any,
        sampled: feature.sampled,
        packable: feature.sampled.getValue(),
        event: event as any,
        index,
        lockCamera: () => {},
        dragging,
      } as any);
    };

    // A 开始拖拽中点 index 0：插入新控制点
    drag(featureA, 0, true);
    expect(featureA.sampled.getValue().positions).toHaveLength(3);

    // B 开始拖拽：必须重新插入，而不是复用 A 残留的 dragIndex
    drag(featureB, 0, true);
    expect(featureB.sampled.getValue().positions).toHaveLength(3);

    // 拖拽结束后（dragging=false）状态重置，下一次拖拽再次插入
    drag(featureB, 0, false);
    drag(featureB, 0, true);
    expect(featureB.sampled.getValue().positions).toHaveLength(4);
  });
});
