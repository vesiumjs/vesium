import { BillboardCollection, BoundingRectangle, Cartesian3, Color, PointPrimitiveCollection, PolylineCollection, Resource } from 'cesium';
import { describe, expect, it } from 'vitest';
import { BillboardToJSON, BillboardZodSchema } from '../Billboard';
import { BillboardCollectionFromJSON, BillboardCollectionToJSON } from '../BillboardCollection';
import { BillboardAdd } from '../BillboardSerialization';
import { Cesium3DTilesetFromJSON, Cesium3DTilesetZodSchema } from '../Cesium3DTileset';
import { imageToURL } from '../image';
import { LabelZodSchema } from '../Label';
import { LabelCollectionFromJSON } from '../LabelCollection';
import { PointPrimitiveCollectionFromJSON, PointPrimitiveCollectionToJSON } from '../PointPrimitiveCollection';
import { PolylineCollectionFromJSON, PolylineCollectionToJSON } from '../PolylineCollection';

if (!('ImageBitmap' in globalThis)) {
  Object.defineProperty(globalThis, 'ImageBitmap', {
    configurable: true,
    value: class ImageBitmap {},
  });
}

if (!('OffscreenCanvas' in globalThis)) {
  Object.defineProperty(globalThis, 'OffscreenCanvas', {
    configurable: true,
    value: class OffscreenCanvas {},
  });
}

Object.defineProperty(globalThis, 'HTMLCanvasElement', {
  configurable: true,
  value: class TestCanvas {
    height = 1;
    width = 1;

    toDataURL() {
      return 'data:image/png;base64,serialized';
    }
  },
});

describe('scene primitive serializers', () => {
  it('normalizes a Resource image as its URL', () => {
    const resource = new Resource('https://example.test/icon.png?version=1');
    expect(imageToURL(resource)).toBe('https://example.test/icon.png?version=1');
  });

  it('round-trips billboards through their collection', () => {
    const collection = new BillboardCollection({ show: false });
    BillboardAdd(collection, {
      color: Color.RED,
      id: 'pin-1',
      image: 'https://example.test/icon.png',
      position: new Cartesian3(1, 2, 3),
      scale: 2,
    });
    const json = BillboardCollectionToJSON(collection)!;
    expect(json.value.billboards[0].value.image).toBe('https://example.test/icon.png');
    const back = BillboardCollectionFromJSON(json);
    expect(back.length).toBe(1);
    expect(back.get(0).id).toBe('pin-1');
    expect(back.get(0).position).toEqual(new Cartesian3(1, 2, 3));
  });

  it('captures non-URL billboard media and subregions at creation time', () => {
    const collection = new BillboardCollection();
    const canvas = new globalThis.HTMLCanvasElement();
    const billboard = BillboardAdd(collection, {
      image: canvas,
      imageSubRegion: new BoundingRectangle(1, 2, 3, 4),
      position: Cartesian3.ZERO,
    });
    const json = BillboardToJSON(billboard)!;
    expect(json.value.image).toBe('data:image/png;base64,serialized');
    expect(json.value.imageSubRegion?.value).toEqual({ x: 1, y: 2, width: 3, height: 4 });
  });

  it('rejects billboards whose original image source was not registered', () => {
    const collection = new BillboardCollection();
    const billboard = collection.add({ image: 'texture-id', position: Cartesian3.ZERO });
    expect(() => BillboardToJSON(billboard)).toThrow('image source is unavailable');
  });

  it('rejects primitive ids that cannot be represented as strings', () => {
    const collection = new BillboardCollection();
    const billboard = collection.add({ id: { value: 'not portable' }, position: Cartesian3.ZERO });
    expect(() => BillboardToJSON(billboard)).toThrow();
  });

  it('validates primitive constructor restrictions', () => {
    expect(() => BillboardZodSchema().parse({
      parser: 'Billboard',
      value: {
        disableDepthTestDistance: -1,
        position: { parser: 'Cartesian3', value: { x: 0, y: 0, z: 0 } },
      },
    })).toThrow();
    expect(() => BillboardZodSchema().parse({
      parser: 'Billboard',
      value: {
        position: { parser: 'Cartesian3', value: { x: 0, y: 0, z: 0 } },
        scaleByDistance: {
          parser: 'NearFarScalar',
          value: { near: 10, nearValue: 1, far: 5, farValue: 0 },
        },
      },
    })).toThrow();
  });

  it('requires a Scene when restoring height-referenced billboards and labels', () => {
    const position = { parser: 'Cartesian3' as const, value: { x: 0, y: 0, z: 0 } };
    const heightReference = { parser: 'HeightReference' as const, value: 'CLAMP_TO_GROUND' as const };
    expect(() => BillboardCollectionFromJSON({
      parser: 'BillboardCollection',
      value: {
        billboards: [{ parser: 'Billboard', value: { heightReference, position } }],
      },
    })).toThrow('requires a Scene');
    expect(() => LabelCollectionFromJSON({
      parser: 'LabelCollection',
      value: {
        labels: [{ parser: 'Label', value: { heightReference, position } }],
      },
    })).toThrow('requires a Scene');
  });

  it('requires a Scene before loading a clamped tileset', async () => {
    await expect(Cesium3DTilesetFromJSON({
      parser: 'Cesium3DTileset',
      value: {
        heightReference: { parser: 'HeightReference', value: 'CLAMP_TO_GROUND' },
        url: 'https://example.test/tileset.json',
      },
    })).rejects.toThrow('requires a Scene');
  });

  it('round-trips point primitive collections', () => {
    const collection = new PointPrimitiveCollection();
    collection.add({ id: 'point-1', pixelSize: 14, position: new Cartesian3(4, 5, 6) });
    const back = PointPrimitiveCollectionFromJSON(PointPrimitiveCollectionToJSON(collection)!);
    expect(back.length).toBe(1);
    expect(back.get(0).id).toBe('point-1');
    expect(back.get(0).pixelSize).toBe(14);
  });

  it('round-trips polylines with direct Material serialization', () => {
    const collection = new PolylineCollection();
    collection.add({
      id: 'line-1',
      positions: [new Cartesian3(0, 0, 0), new Cartesian3(1, 1, 1)],
      width: 3,
    });
    const json = PolylineCollectionToJSON(collection)!;
    expect(json.value.polylines[0].value.material?.value.type).toBe('Color');
    const back = PolylineCollectionFromJSON(json);
    expect(back.length).toBe(1);
    expect(back.get(0).id).toBe('line-1');
  });

  it('exposes Label and tileset constructor values through schemas', () => {
    expect(LabelZodSchema().parse({
      parser: 'Label',
      value: {
        position: { parser: 'Cartesian3', value: { x: 0, y: 0, z: 0 } },
        text: 'A',
      },
    }).value.text).toBe('A');
    expect(() => Cesium3DTilesetZodSchema().parse({
      parser: 'Cesium3DTileset',
      value: { cacheBytes: -1, url: 'https://example.test/tileset.json' },
    })).toThrow();
  });
});
