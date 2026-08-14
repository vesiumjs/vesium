import { Cartesian3, JulianDate } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { PlotFeature } from '../PlotFeature';
import { PlotScheme } from '../PlotScheme';
import { SampledPlotProperty } from '../SampledPlotProperty';

describe('plotFeature', () => {
  function createScheme(type = `feature-scheme-${Date.now()}-${Math.random()}`) {
    return new PlotScheme({
      type,
      initRender: () => ({
        entities: [{ id: 'entity' } as any],
        primitives: [{ id: 'primitive' }],
        groundPrimitives: [{ id: 'ground' }],
      }),
    });
  }

  it('creates defaults and copies initRender collections', () => {
    const scheme = createScheme();
    const feature = new PlotFeature({ scheme });

    expect(feature.id).toBeTruthy();
    expect(feature.scheme).toBe(scheme);
    expect(feature.disabled).toBe(false);
    expect(feature.defining).toBe(true);
    expect(feature.entities).toEqual([{ id: 'entity' }]);
    expect(feature.primitives).toEqual([{ id: 'primitive' }]);
    expect(feature.groundPrimitives).toEqual([{ id: 'ground' }]);
    expect(feature.skeletons).toEqual([]);
  });

  it('uses explicit id and existing sampled property', () => {
    const sampled = new SampledPlotProperty({
      packables: [{
        time: JulianDate.now(),
        positions: [new Cartesian3(1, 2, 3)],
      }],
    });
    const feature = new PlotFeature({
      id: 'custom-id',
      scheme: createScheme(),
      sampled,
    });

    expect(feature.id).toBe('custom-id');
    expect(feature.sampled).toBe(sampled);
    expect(feature.defining).toBe(false);
  });

  it('resolves scheme from cache string', () => {
    const type = `cached-feature-scheme-${Date.now()}`;
    const scheme = createScheme(type);
    PlotScheme.setCache(scheme);
    const feature = new PlotFeature({ scheme: type });
    expect(feature.scheme).toBe(scheme);
  });

  it('raises definitionChanged when disabled changes', () => {
    const feature = new PlotFeature({ scheme: createScheme() });
    const listener = vi.fn();
    feature.definitionChanged.addEventListener(listener);

    feature.disabled = true;
    feature.disabled = true;
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(feature, 'disabled', true, false);
  });

  it('raises definitionChanged when defining changes via static setter', () => {
    const feature = new PlotFeature({ scheme: createScheme() });
    const listener = vi.fn();
    feature.definitionChanged.addEventListener(listener);

    PlotFeature.setDefining(feature, false);
    PlotFeature.setDefining(feature, false);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(feature, 'defining', false, true);
    expect(feature.defining).toBe(false);
  });

  it('propagates sampled definitionChanged as sampled key', () => {
    const feature = new PlotFeature({ scheme: createScheme() });
    const listener = vi.fn();
    feature.definitionChanged.addEventListener(listener);

    feature.sampled.setSample({
      time: JulianDate.now(),
      positions: [new Cartesian3(0, 0, 0)],
    });
    expect(listener).toHaveBeenCalledWith(feature, 'sampled', feature.sampled, feature.sampled);
  });
});
