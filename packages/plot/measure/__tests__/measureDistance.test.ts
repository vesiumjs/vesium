import type { DistanceReturn } from '../utils/distance';
import * as Cesium from 'cesium';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { schemeMeasureDistance } from '../measureDistance';

let pending: Array<(value: DistanceReturn) => void> = [];

vi.mock('../utils', () => ({
  distance: () => new Promise<DistanceReturn>((resolve) => {
    pending.push(resolve);
  }),
}));

describe('measureDistance async race guard', () => {
  beforeEach(() => {
    pending = [];
  });

  it('discards stale async distance results that resolve out of order', async () => {
    const entity = new Cesium.Entity({ polyline: {} });
    const render = (positions: Cesium.Cartesian3[], previous?: Cesium.Entity[]) => {
      const result = schemeMeasureDistance.render!({
        packable: { positions },
        defining: false,
        mouse: undefined,
        previous: { entities: previous ?? [entity] },
        getPositions: () => [],
      });
      return result as { entities: Cesium.Entity[] };
    };

    const first = render([
      Cesium.Cartesian3.fromDegrees(116, 30, 0),
      Cesium.Cartesian3.fromDegrees(117, 30, 0),
    ]);
    const second = render([
      Cesium.Cartesian3.fromDegrees(116, 30, 0),
      Cesium.Cartesian3.fromDegrees(118, 30, 0),
    ], first.entities);

    // The newest render resolves first, then the older render resolves afterwards — the stale
    // result must be discarded
    pending[1]!({ stages: [222222], count: 222222 });
    pending[0]!({ stages: [111111], count: 111111 });
    await Promise.resolve();
    await Promise.resolve();

    const text = second.entities[1]!.label!.text as unknown as Cesium.CallbackProperty;
    const value = text.getValue(new Cesium.JulianDate());
    expect(String(value)).toContain('222222');
    expect(String(value)).not.toContain('111111');
  });

  it('does not crash when a stale result arrives after points are removed', async () => {
    const entity = new Cesium.Entity({ polyline: {} });
    const render = (positions: Cesium.Cartesian3[], previous?: Cesium.Entity[]) => {
      const result = schemeMeasureDistance.render!({
        packable: { positions },
        defining: false,
        mouse: undefined,
        previous: { entities: previous ?? [entity] },
        getPositions: () => [],
      });
      return result as { entities: Cesium.Entity[] };
    };

    // Render 5 points (4 stages) first, then undo back to 2 points (1 stage, 3 entities)
    const first = render([
      Cesium.Cartesian3.fromDegrees(116, 30, 0),
      Cesium.Cartesian3.fromDegrees(116.1, 30, 0),
      Cesium.Cartesian3.fromDegrees(116.2, 30, 0),
      Cesium.Cartesian3.fromDegrees(116.3, 30, 0),
      Cesium.Cartesian3.fromDegrees(116.4, 30, 0),
    ]);
    const entities = render([
      Cesium.Cartesian3.fromDegrees(116, 30, 0),
      Cesium.Cartesian3.fromDegrees(116.1, 30, 0),
    ], first.entities).entities;

    // The stale result (4 stages) resolves after the undo: it must not crash on out-of-bounds
    // writes nor overwrite the new labels
    pending[0]!({ stages: [1, 2, 3, 4], count: 10 });
    await Promise.resolve();
    expect(entities.length).toBe(3);
    for (const item of entities.slice(1)) {
      expect(item.label?.text).toBeUndefined();
    }
  });

  it('discards stale results and trims labels when points shrink below 2', async () => {
    const entity = new Cesium.Entity({ polyline: {} });
    const render = (positions: Cesium.Cartesian3[], previous?: Cesium.Entity[]) => {
      const result = schemeMeasureDistance.render!({
        packable: { positions },
        defining: false,
        mouse: undefined,
        previous: { entities: previous ?? [entity] },
        getPositions: () => [],
      });
      return result as { entities: Cesium.Entity[] };
    };

    const first = render([
      Cesium.Cartesian3.fromDegrees(116, 30, 0),
      Cesium.Cartesian3.fromDegrees(116.1, 30, 0),
    ]);
    // Undo to 1 point → early-return branch (no calculation is started)
    const entities = render([
      Cesium.Cartesian3.fromDegrees(116, 30, 0),
    ], first.entities).entities;

    // A pending result from before the early return resolves: it must be invalidated and not
    // write into the trimmed entities
    pending[0]!({ stages: [111111], count: 111111 });
    await Promise.resolve();
    expect(entities.length).toBe(1);
    expect(entities[1]).toBeUndefined();
  });
});
