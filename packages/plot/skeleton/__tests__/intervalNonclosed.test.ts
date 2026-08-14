import { Cartesian3, JulianDate } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { PlotFeature } from '../../usePlot/PlotFeature';
import { PlotScheme } from '../../usePlot/PlotScheme';
import { SampledPlotProperty } from '../../usePlot/SampledPlotProperty';
import { intervalNonclosed } from '../intervalNonclosed';

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
    type: `interval-nonclosed-test-${Date.now()}-${Math.random()}`,
    initRender: () => ({}),
    skeletons: [intervalNonclosed],
  });
  return new PlotFeature({ scheme, sampled });
}

describe('intervalNonclosed skeleton drag state', () => {
  it('isolates dragIndex per plot feature', () => {
    const featureA = createFeature();
    const featureB = createFeature();
    const skeleton = intervalNonclosed();
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

    // A starts dragging midpoint index 0: a new control point is inserted
    drag(featureA, 0, true);
    expect(featureA.sampled.getValue().positions).toHaveLength(3);

    // B must insert again instead of reusing A's leftover dragIndex
    drag(featureB, 0, true);
    expect(featureB.sampled.getValue().positions).toHaveLength(3);

    // After the drag ends (dragging=false) the state resets, so the next drag inserts again
    drag(featureB, 0, false);
    drag(featureB, 0, true);
    expect(featureB.sampled.getValue().positions).toHaveLength(4);
  });

  it('recovers from a stale dragIndex left by a missed drag end', () => {
    const feature = createFeature();
    const skeleton = intervalNonclosed();
    const event = { endPosition: { x: 1, y: 1 } };

    const drag = (index: number, dragging: boolean) => {
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

    // Drag index 1 to insert a point (dragIndex=1), then externally reset the positions to 2
    // points (simulating a stale state where the reset never happened)
    drag(1, true);
    feature.sampled.setSample({
      time: feature.sampled.getTimes()[0],
      positions: [new Cartesian3(0, 0, 0), new Cartesian3(1, 0, 0)],
    });

    // The stale dragIndex=1 is now out of bounds: treat it as a new drag and insert instead of
    // overwriting positions[2]
    drag(0, true);
    const positions = feature.sampled.getValue().positions;
    expect(positions).toHaveLength(3);
    expect(Cartesian3.equals(positions[1]!, new Cartesian3(99, 0, 0))).toBe(true);
  });

  it('re-treats a stale dragIndex as a new drag when the drag target index changes', () => {
    const feature = createFeature();
    const skeleton = intervalNonclosed();
    const event = { endPosition: { x: 1, y: 1 } };

    const drag = (index: number, dragging: boolean) => {
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

    // Drag midpoint index 0: insert a point at index 1 (dragIndex=0), leaving the state stale by
    // never dispatching the final dragging=false event
    drag(0, true);
    expect(feature.sampled.getValue().positions).toHaveLength(3);

    // Start a new drag on midpoint index 1 while the stale dragIndex=0 is still tracked and the
    // positions still have 3 points. It must insert at index 2, not move positions[1].
    drag(1, true);
    const positions = feature.sampled.getValue().positions;
    expect(positions).toHaveLength(4);
    expect(Cartesian3.equals(positions[2]!, new Cartesian3(99, 0, 0))).toBe(true);
    // The previously dragged midpoint stays in place and the tail point is untouched
    expect(Cartesian3.equals(positions[1]!, new Cartesian3(99, 0, 0))).toBe(true);
    expect(Cartesian3.equals(positions[3]!, new Cartesian3(1, 0, 0))).toBe(true);
  });
});
