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

    // 最新的渲染先返回结果，随后旧渲染的结果才返回 —— 旧结果必须被丢弃
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

    // 先渲染 5 个点（4 段），再撤销到 2 个点（1 段，共 3 个实体）
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

    // 旧渲染（4 段）的结果在撤销后返回，不允许越界写入崩溃
    pending[0]!({ stages: [1, 2, 3, 4], count: 10 });
    await Promise.resolve();
    expect(entities.length).toBe(3);
  });
});
