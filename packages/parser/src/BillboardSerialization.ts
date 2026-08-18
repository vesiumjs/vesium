import type { Billboard, BillboardCollection, BoundingRectangle } from 'cesium';
import { BoundingRectangleToJSON } from './BoundingRectangle';
import { imageToURL } from './image';

export interface BillboardSerializationSource {
  image?: unknown;
  imageSubRegion?: BoundingRectangle;
}

export interface BillboardSerializationSourceJSON {
  image?: string;
  imageSubRegion?: ReturnType<typeof BoundingRectangleToJSON>;
}

type BillboardConstructorOptions = Parameters<BillboardCollection['add']>[0];

const sources = new WeakMap<Billboard, BillboardSerializationSourceJSON>();

export function BillboardSetSerializationSource(
  instance: Billboard,
  source: BillboardSerializationSource,
): void {
  sources.set(instance, {
    image: imageToURL(source.image),
    imageSubRegion: BoundingRectangleToJSON(source.imageSubRegion),
  });
}

export function BillboardAdd(
  collection: BillboardCollection,
  options?: BillboardConstructorOptions,
): Billboard {
  const instance = collection.add(options);
  BillboardSetSerializationSource(instance, {
    image: options?.image,
    imageSubRegion: options?.imageSubRegion,
  });
  return instance;
}

export function BillboardGetSerializationSource(
  instance: Billboard,
): BillboardSerializationSourceJSON | undefined {
  const source = sources.get(instance);
  if (source) {
    return source;
  }
  if (instance.image !== undefined) {
    throw new TypeError(
      'Billboard image source is unavailable. Create it with BillboardAdd or register it with BillboardSetSerializationSource.',
    );
  }
  return undefined;
}
