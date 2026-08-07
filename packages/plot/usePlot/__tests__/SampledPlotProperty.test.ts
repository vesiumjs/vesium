import { Cartesian3, JulianDate, TimeInterval } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { SampledPlotProperty, SampledPlotStrategy } from '../SampledPlotProperty';

function t(start: JulianDate, seconds: number): JulianDate {
  return JulianDate.addSeconds(start, seconds, new JulianDate());
}

describe('sampledPlotProperty', () => {
  const start = JulianDate.fromDate(new Date('2024-01-01T00:00:00Z'));
  const end = t(start, 10);
  const mid = t(start, 5);

  it('seeds an empty sample when constructed without packables', () => {
    const property = new SampledPlotProperty();
    expect(property.strategy).toBe(SampledPlotStrategy.NEAR);
    expect(property.getTimes()).toHaveLength(1);
    expect(property.getValue().positions).toEqual([]);
    expect(property.isConstant).toBe(false);
  });

  it('interpolates between adjacent samples and keeps previous derivative', () => {
    const property = new SampledPlotProperty({
      packables: [
        { time: start, positions: [new Cartesian3(0, 0, 0)], derivative: 'start' },
        { time: end, positions: [new Cartesian3(10, 0, 0)], derivative: 'end' },
      ],
    });

    const result = property.getValue(mid);
    expect(result.positions[0].x).toBeCloseTo(5);
    expect(result.derivative).toBe('start');
  });

  it('uses the next derivative at the exact next sample', () => {
    const property = new SampledPlotProperty({
      packables: [
        { time: start, positions: [new Cartesian3(0, 0, 0)], derivative: 'start' },
        { time: end, positions: [new Cartesian3(10, 0, 0)], derivative: 'end' },
      ],
    });

    const result = property.getValue(end);
    expect(result.positions[0].x).toBeCloseTo(10);
    expect(result.derivative).toBe('end');
  });

  it('clones positions on setSample and reuses result object on getValue', () => {
    const positions = [new Cartesian3(1, 2, 3)];
    const property = new SampledPlotProperty({
      packables: [{ time: start, positions }],
    });
    positions[0].x = 999;
    const result = { time: start, positions: [new Cartesian3(0, 0, 0)], derivative: 'old' as const };
    const value = property.getValue(start, result);
    expect(value).toBe(result);
    expect(value.positions[0].x).toBe(1);
    expect(value.derivative).toBeUndefined();
  });

  it('keeps chronological order when inserting samples', () => {
    const property = new SampledPlotProperty({
      packables: [{ time: mid, positions: [new Cartesian3(5, 0, 0)] }],
    });
    property.setSample({ time: end, positions: [new Cartesian3(10, 0, 0)] });
    property.setSample({ time: start, positions: [new Cartesian3(0, 0, 0)] });

    const times = property.getTimes();
    expect(times).toHaveLength(3);
    expect(JulianDate.equals(times[0], start)).toBe(true);
    expect(JulianDate.equals(times[1], mid)).toBe(true);
    expect(JulianDate.equals(times[2], end)).toBe(true);
  });

  it('overwrites sample at the same time', () => {
    const property = new SampledPlotProperty({
      packables: [{ time: start, positions: [new Cartesian3(0, 0, 0)], derivative: 'a' }],
    });
    property.setSample({ time: start, positions: [new Cartesian3(3, 0, 0)], derivative: 'b' });
    expect(property.getTimes()).toHaveLength(1);
    expect(property.getValue(start).positions[0].x).toBe(3);
    expect(property.getValue(start).derivative).toBe('b');
  });

  it('supports STRICT / NEAR / CYCLE strategies outside the range', () => {
    const packables = [
      { time: start, positions: [new Cartesian3(0, 0, 0)], derivative: 'start' },
      { time: end, positions: [new Cartesian3(10, 0, 0)], derivative: 'end' },
    ];
    const before = t(start, -5);
    const after = t(start, 15);

    const strict = new SampledPlotProperty({ strategy: SampledPlotStrategy.STRICT, packables });
    expect(strict.getValue(before).positions).toEqual([]);
    expect(strict.getValue(after).derivative).toBeUndefined();

    const near = new SampledPlotProperty({ strategy: SampledPlotStrategy.NEAR, packables });
    expect(near.getValue(before).positions[0].x).toBeCloseTo(0);
    expect(near.getValue(after).positions[0].x).toBeCloseTo(10);

    const cycle = new SampledPlotProperty({ strategy: SampledPlotStrategy.CYCLE, packables });
    const cycled = cycle.getValue(after);
    expect(cycled.positions[0].x).toBeCloseTo(5);
    expect(cycled.derivative).toBe('start');
  });

  it('raises definitionChanged on set and remove', () => {
    const property = new SampledPlotProperty({
      packables: [{ time: start, positions: [new Cartesian3(0, 0, 0)] }],
    });
    const listener = vi.fn();
    property.definitionChanged.addEventListener(listener);

    property.setSample({ time: end, positions: [new Cartesian3(1, 0, 0)] });
    expect(listener).toHaveBeenCalledWith(property);

    expect(property.removeSample(end)).toBe(true);
    expect(property.removeSample(end)).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('removes samples within interval', () => {
    const property = new SampledPlotProperty({
      packables: [
        { time: start, positions: [new Cartesian3(0, 0, 0)] },
        { time: mid, positions: [new Cartesian3(5, 0, 0)] },
        { time: end, positions: [new Cartesian3(10, 0, 0)] },
      ],
    });
    // Collect first to avoid mutation-while-iterating edge cases in source loop.
    property.removeSample(mid);
    property.removeSample(end);
    const times = property.getTimes();
    expect(times).toHaveLength(1);
    expect(JulianDate.equals(times[0], start)).toBe(true);

    property.setSample({ time: mid, positions: [new Cartesian3(5, 0, 0)] });
    property.setSample({ time: end, positions: [new Cartesian3(10, 0, 0)] });
    property.removeSamples(new TimeInterval({
      start: mid,
      stop: end,
      isStartIncluded: true,
      isStopIncluded: true,
    }));
    const remaining = property.getTimes();
    expect(remaining).toHaveLength(1);
    expect(JulianDate.equals(remaining[0], start)).toBe(true);
  });

  it('does not crash when getValue is called after all samples are removed', () => {
    const property = new SampledPlotProperty({
      packables: [{ time: start, positions: [new Cartesian3(0, 0, 0)] }],
    });
    expect(property.removeSample(start)).toBe(true);
    expect(property.getTimes()).toHaveLength(0);
    const value = property.getValue();
    expect(value.positions).toEqual([]);
    expect(property.getValue(start).positions).toEqual([]);
  });

  it('uses custom interpolation algorithm when provided', () => {
    const interpolationAlgorithm = vi.fn((_time, _previous, next) => ({
      time: end,
      positions: [new Cartesian3(42, 0, 0)],
      derivative: next.derivative,
    }));
    const property = new SampledPlotProperty({
      interpolationAlgorithm,
      packables: [
        { time: start, positions: [new Cartesian3(0, 0, 0)], derivative: 'start' },
        { time: end, positions: [new Cartesian3(10, 0, 0)], derivative: 'end' },
      ],
    });
    const result = property.getValue(mid);
    expect(interpolationAlgorithm).toHaveBeenCalled();
    expect(result.positions[0].x).toBe(42);
  });

  it('returns cloned times from getTimes and identity equals', () => {
    const property = new SampledPlotProperty({
      packables: [{ time: start, positions: [new Cartesian3(0, 0, 0)] }],
    });
    const times = property.getTimes();
    times.pop();
    expect(property.getTimes()).toHaveLength(1);
    expect(property.equals(property)).toBe(true);
    expect(property.equals(new SampledPlotProperty() as any)).toBe(false);
  });
});
