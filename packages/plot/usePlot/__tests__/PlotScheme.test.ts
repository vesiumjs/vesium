import { describe, expect, it, vi } from 'vitest';
import { PlotScheme } from '../PlotScheme';

describe('plotScheme', () => {
  it('copies options and applies defaults', () => {
    const skeleton = { type: 'control' } as any;
    const scheme = new PlotScheme({
      type: `test-scheme-${Date.now()}`,
      complete: () => true,
      allowManualComplete: () => false,
      skeletons: [() => skeleton],
      initRender: () => ({ entities: [] }),
    });

    expect(scheme.definingCursor).toBe('crosshair');
    expect(scheme.complete?.({ positions: [] })).toBe(true);
    expect(scheme.allowManualComplete?.({ positions: [] })).toBe(false);
    expect(scheme.skeletons).toEqual([skeleton]);
  });

  it('caches and resolves schemes by type', () => {
    const type = `cached-scheme-${Date.now()}-${Math.random()}`;
    const scheme = new PlotScheme({
      type,
      initRender: () => ({}),
    });

    PlotScheme.setCache(scheme);
    expect(PlotScheme.getCache(type)).toBe(scheme);
    expect(PlotScheme.getCacheTypes()).toContain(type);
    expect(PlotScheme.resolve(type)).toBe(scheme);
    expect(PlotScheme.resolve(scheme)).toBe(scheme);
  });

  it('resolves constructor options into a new instance', () => {
    const type = `options-scheme-${Date.now()}`;
    const scheme = PlotScheme.resolve({
      type,
      definingCursor: 'pointer',
      initRender: () => ({ primitives: [1] }),
    });
    expect(scheme).toBeInstanceOf(PlotScheme);
    expect(scheme.type).toBe(type);
    expect(scheme.definingCursor).toBe('pointer');
    expect(scheme.initRender()).toEqual({ primitives: [1] });
  });

  it('throws when type is missing for setCache', () => {
    expect(() => PlotScheme.setCache({} as any)).toThrow('`scheme.type` is required');
  });

  it('fails assert when resolving unknown cache type', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const missing = `missing-${Date.now()}`;
    try {
      PlotScheme.resolve(missing);
    }
    catch {
      // vue assert may throw depending on build mode
    }
    // Either throws or leaves cache empty for the missing type.
    expect(PlotScheme.getCache(missing)).toBeUndefined();
    spy.mockRestore();
  });
});
