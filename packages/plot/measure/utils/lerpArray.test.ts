import { Cartesian3 } from 'cesium';
import { describe, expect, it } from 'vitest';
import { lerpArray } from './lerpArray';

describe('lerpArray', () => {
  it('returns start, interpolated points, and end', async () => {
    const result = await lerpArray({
      start: new Cartesian3(0, 0, 0),
      end: new Cartesian3(10, 0, 0),
      count: 2,
    });

    expect(result).toHaveLength(3);
    expect(result.map(item => item.x)).toEqual([0, 5, 10]);
  });
});
