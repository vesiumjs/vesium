import { Resource } from 'cesium';

interface CanvasLike {
  height: number;
  toDataURL: () => string;
  width: number;
}

function isInstanceOf(value: unknown, constructorName: string) {
  const constructor = Reflect.get(globalThis, constructorName);
  return typeof constructor === 'function' && value instanceof constructor;
}

function createCanvas(width: number, height: number): CanvasLike {
  if (typeof document === 'undefined') {
    throw new TypeError('Image data can only be serialized in a DOM environment.');
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Converts Cesium image inputs into portable URL values.
 */
export function imageToURL(value?: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (value instanceof Resource) {
    return value.url;
  }
  if (isInstanceOf(value, 'HTMLImageElement')) {
    const image = value as HTMLImageElement;
    if (image.currentSrc || image.src) {
      return image.currentSrc || image.src;
    }
    throw new TypeError('HTMLImageElement must have a source URL.');
  }
  if (isInstanceOf(value, 'HTMLVideoElement')) {
    throw new TypeError('HTMLVideoElement cannot be serialized as an image.');
  }
  if (isInstanceOf(value, 'HTMLCanvasElement')) {
    const canvas = value as CanvasLike;
    return canvas.toDataURL();
  }
  if (isInstanceOf(value, 'OffscreenCanvas')) {
    throw new TypeError('OffscreenCanvas cannot be serialized synchronously.');
  }
  if (isInstanceOf(value, 'ImageData')) {
    const imageData = value as ImageData;
    const canvas = createCanvas(imageData.width, imageData.height);
    const context = (canvas as HTMLCanvasElement).getContext('2d');
    if (!context) {
      throw new TypeError('Unable to create a 2D canvas context.');
    }
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }
  if (isInstanceOf(value, 'ImageBitmap')) {
    const bitmap = value as ImageBitmap;
    const canvas = createCanvas(bitmap.width, bitmap.height);
    const context = (canvas as HTMLCanvasElement).getContext('2d');
    if (!context) {
      throw new TypeError('Unable to create a 2D canvas context.');
    }
    context.drawImage(bitmap, 0, 0);
    return canvas.toDataURL();
  }
  throw new TypeError('Unsupported image value. Use a URL, Resource, canvas, ImageData, ImageBitmap, or HTMLImageElement.');
}
