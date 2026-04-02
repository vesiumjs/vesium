import { Cartesian3, JulianDate } from 'cesium';
import { describe, expect, it } from 'vitest';
import { SampledPlotProperty } from './SampledPlotProperty';

describe('sampledPlotProperty', () => {
  it('interpolates between adjacent samples', () => {
    const start = JulianDate.fromDate(new Date('2024-01-01T00:00:00Z'));
    const end = JulianDate.addSeconds(start, 10, new JulianDate());
    const mid = JulianDate.addSeconds(start, 5, new JulianDate());

    const property = new SampledPlotProperty({
      packables: [
        {
          time: start,
          positions: [new Cartesian3(0, 0, 0)],
          derivative: 'start',
        },
        {
          time: end,
          positions: [new Cartesian3(10, 0, 0)],
          derivative: 'end',
        },
      ],
    });

    const result = property.getValue(mid);
    expect(result.positions[0].x).toBeCloseTo(5);
    expect(result.derivative).toBe('start');
  });

  it('uses the next derivative at the exact next sample', () => {
    const start = JulianDate.fromDate(new Date('2024-01-01T00:00:00Z'));
    const end = JulianDate.addSeconds(start, 10, new JulianDate());

    const property = new SampledPlotProperty({
      packables: [
        {
          time: start,
          positions: [new Cartesian3(0, 0, 0)],
          derivative: 'start',
        },
        {
          time: end,
          positions: [new Cartesian3(10, 0, 0)],
          derivative: 'end',
        },
      ],
    });

    const result = property.getValue(end);
    expect(result.positions[0].x).toBeCloseTo(10);
    expect(result.derivative).toBe('end');
  });
});
