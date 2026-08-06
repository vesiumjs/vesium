import type { CallbackProperty, PolygonHierarchy } from 'cesium';
import { Cartesian3, Entity, JulianDate } from 'cesium';
import { describe, expect, it } from 'vitest';
import { PlotSchemePolygon } from '../Polygon';

describe('plotSchemePolygon render', () => {
  it('does not grow the captured positions array across callback invocations', async () => {
    const entity = new Entity({ polyline: {}, polygon: {} });
    const renderResult = await PlotSchemePolygon.render!({
      packable: {
        positions: [
          new Cartesian3(0, 0, 0),
          new Cartesian3(1, 0, 0),
          new Cartesian3(0, 1, 0),
        ],
      },
      defining: true,
      mouse: undefined,
      previous: { entities: [entity] },
      getPositions: () => [],
    });

    const hierarchyProperty = renderResult.entities![0]!.polygon!.hierarchy as unknown as CallbackProperty;
    const time = new JulianDate();
    const first = hierarchyProperty.getValue(time) as PolygonHierarchy;
    expect(first.positions).toHaveLength(4);
    expect(Cartesian3.equals(first.positions.at(-1)!, first.positions[0]!)).toBe(true);

    // 多次调用回调，环必须保持稳定，不得持续增长
    hierarchyProperty.getValue(time);
    hierarchyProperty.getValue(time);
    const last = hierarchyProperty.getValue(time) as PolygonHierarchy;
    expect(last.positions).toHaveLength(4);
  });
});
