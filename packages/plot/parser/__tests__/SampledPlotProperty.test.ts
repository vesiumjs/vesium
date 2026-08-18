import type { SampledPlotPropertySerializationOptions } from '../SampledPlotProperty';
import { Cartesian3, JulianDate } from 'cesium';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { SampledPlotProperty, SampledPlotStrategy } from '../../usePlot';
import { SampledPlotPropertyFromJSON, SampledPlotPropertyToJSON, SampledPlotPropertyZodSchema } from '../SampledPlotProperty';

const TIME_1 = JulianDate.fromIso8601('2020-01-01T00:00:00Z');
const TIME_2 = JulianDate.fromIso8601('2020-01-01T00:00:01Z');

describe('sampledPlotProperty serialization', () => {
  it('returns undefined for nullish input', () => {
    expect(SampledPlotPropertyToJSON(undefined)).toBeUndefined();
    expect(SampledPlotPropertyFromJSON(undefined)).toBeUndefined();
  });

  it('round-trips samples, strategy and derivative', () => {
    const instance = new SampledPlotProperty({
      strategy: SampledPlotStrategy.STRICT,
      packables: [
        { time: TIME_1, positions: [new Cartesian3(1, 2, 3)], derivative: { label: 'a' } },
        { time: TIME_2, positions: [new Cartesian3(4, 5, 6), new Cartesian3(7, 8, 9)] },
      ],
    });

    const json = SampledPlotPropertyToJSON(instance);
    expect(json?.value.strategy).toBe(SampledPlotStrategy.STRICT);
    expect(json?.value.packables).toHaveLength(2);
    expect(json?.value.packables[0]!.derivative).toEqual({ label: 'a' });

    const back = SampledPlotPropertyFromJSON(json);
    expect(back).toBeInstanceOf(SampledPlotProperty);
    expect(back!.strategy).toBe(SampledPlotStrategy.STRICT);
    expect(back!.getTimes()).toHaveLength(2);
    const value = back!.getValue(TIME_2);
    expect(value.positions).toHaveLength(2);
    expect(value.positions[0]!.x).toBe(4);
    expect(back!.getValue(TIME_1).derivative).toEqual({ label: 'a' });
  });

  it('round-trips the zero-valued NEAR strategy', () => {
    const instance = new SampledPlotProperty({
      strategy: SampledPlotStrategy.NEAR,
      packables: [{ time: TIME_1, positions: [new Cartesian3(1, 2, 3)] }],
    });
    const back = SampledPlotPropertyFromJSON(SampledPlotPropertyToJSON(instance)!);
    expect(back!.strategy).toBe(SampledPlotStrategy.NEAR);
  });

  it('filters the seeded empty sample', () => {
    const instance = new SampledPlotProperty();
    const json = SampledPlotPropertyToJSON(instance);
    expect(json?.value.packables).toEqual([]);
  });

  it('validates the JSON schema before reconstruction', () => {
    expect(() => SampledPlotPropertyZodSchema().parse({
      parser: 'SampledPlotProperty',
      value: { strategy: 99, packables: [] },
    })).toThrow();
    expect(() => SampledPlotPropertyFromJSON({
      parser: 'SampledPlotProperty',
      value: { strategy: SampledPlotStrategy.NEAR, packables: [{ positions: [{ parser: 'Cartesian3', value: { x: 'invalid' } }] }] },
    } as any)).toThrow();
    expect(() => SampledPlotPropertyFromJSON({ parser: 'Invalid' } as any)).toThrow();
  });

  it('rejects derivatives that are not JSON values', () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    const instance = new SampledPlotProperty({
      packables: [{ time: TIME_1, positions: [new Cartesian3(1, 2, 3)], derivative: cyclic }],
    });
    expect(() => SampledPlotPropertyToJSON(instance)).toThrow();
  });

  it('supports a derivative codec for extended values', () => {
    const options: SampledPlotPropertySerializationOptions<Cartesian3, { x: number; y: number; z: number }> = {
      derivative: {
        schema: z.object({ x: z.number(), y: z.number(), z: z.number() }),
        toJSON: value => ({ x: value.x, y: value.y, z: value.z }),
        fromJSON: value => new Cartesian3(value.x, value.y, value.z),
      },
    };
    const instance = new SampledPlotProperty({
      packables: [{ time: TIME_1, positions: [new Cartesian3(1, 2, 3)], derivative: new Cartesian3(4, 5, 6) }],
    });
    const json = SampledPlotPropertyToJSON(instance, options);
    expect(json?.value.packables[0]?.derivative).toEqual({ x: 4, y: 5, z: 6 });
    const back = SampledPlotPropertyFromJSON<Cartesian3, { x: number; y: number; z: number }>(json, options)!;
    expect(back.getValue(TIME_1).derivative).toEqual(new Cartesian3(4, 5, 6));
  });
});
