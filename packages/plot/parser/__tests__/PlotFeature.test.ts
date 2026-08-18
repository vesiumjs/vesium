import { Cartesian3 } from 'cesium';
import { describe, expect, it } from 'vitest';
import { PlotFeature } from '../../usePlot';
import { PlotFeatureFromJSON, PlotFeatureToJSON, PlotFeatureZodSchema } from '../PlotFeature';
// 导入内置方案模块，触发定义处自注册（scheme/Point.ts 内 PlotScheme.setCache）
import '../../scheme/Point';

describe('plotFeature serialization', () => {
  it('returns undefined for nullish input', () => {
    expect(PlotFeatureToJSON(undefined)).toBeUndefined();
    expect(PlotFeatureFromJSON(undefined)).toBeUndefined();
  });

  it('round-trips a Point plot', () => {
    const instance = new PlotFeature({
      id: 'plot-1',
      scheme: 'Point',
      disabled: true,
      sampled: {
        packables: [{ positions: [new Cartesian3(1, 2, 3)] }],
      },
    });
    expect(instance.defining).toBe(false);

    const json = PlotFeatureToJSON(instance);
    expect(json?.value).toEqual({
      id: 'plot-1',
      scheme: 'Point',
      disabled: true,
      sampled: expect.objectContaining({ parser: 'SampledPlotProperty' }),
    });

    const back = PlotFeatureFromJSON(json);
    expect(back).toBeInstanceOf(PlotFeature);
    expect(back!.id).toBe('plot-1');
    expect(back!.scheme.type).toBe('Point');
    expect(back!.disabled).toBe(true);
    expect(back!.defining).toBe(false);
    const position = back!.sampled.getValue().positions[0]!;
    expect([position.x, position.y, position.z]).toEqual([1, 2, 3]);
  });

  it('throws when the scheme is not registered', () => {
    expect(() => PlotFeatureFromJSON({
      parser: 'PlotFeature',
      value: { scheme: 'NotRegistered', sampled: { parser: 'SampledPlotProperty', value: { strategy: 0, packables: [] } } },
    })).toThrow('scheme NotRegistered not found');
  });

  it('validates the JSON shape before resolving a scheme', () => {
    expect(() => PlotFeatureZodSchema().parse({
      parser: 'PlotFeature',
      value: { scheme: 'Point' },
    })).toThrow();
    expect(() => PlotFeatureFromJSON({ parser: 'Invalid' } as any)).toThrow();
  });
});
