import { Color, GridImageryProvider } from 'cesium';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { GridImageryProviderFromJSON, GridImageryProviderToJSON, GridImageryProviderZodSchema } from '../GridImageryProvider';

// GridImageryProvider draws its grid onto a canvas, which jsdom does not support
beforeAll(() => {
  const context = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
  };
  vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
    if (tag === 'canvas') {
      return {
        getContext: () => context,
        toDataURL: () => 'data:image/png;base64,',
        width: 256,
        height: 256,
      } as any;
    }
    return document.createElement(tag);
  }) as any);
});

describe('gridImageryProvider', () => {
  it('parses valid JSON and rejects invalid input', () => {
    expect(GridImageryProviderZodSchema().parse({ parser: 'GridImageryProvider', value: { cells: 4 } }).value.cells).toBe(4);
    expect(() => GridImageryProviderZodSchema().parse({ parser: 'GridImageryProvider' } as any)).toThrow();
  });

  it('round-trips an instance with custom colors', () => {
    const instance = new GridImageryProvider({
      cells: 4,
      color: Color.RED,
      glowColor: Color.BLUE,
      glowWidth: 2,
    });
    const json = GridImageryProviderToJSON(instance);
    expect(json?.value.cells).toBe(4);

    const back = GridImageryProviderFromJSON(json);
    expect(back).toBeInstanceOf(GridImageryProvider);
    expect(back!.tileWidth).toBe(instance.tileWidth);
  });

  it('returns undefined for nullish input', () => {
    expect(GridImageryProviderToJSON(undefined)).toBeUndefined();
    expect(GridImageryProviderFromJSON(undefined)).toBeUndefined();
  });
});
