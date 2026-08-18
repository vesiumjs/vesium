import type { Scene } from 'cesium';
import { HeightReference } from 'cesium';
import { z } from 'zod';

export interface SceneRestoreOptions {
  scene?: Scene;
}

export function primitiveIdToJSON(value?: unknown) {
  if (value === undefined || value === null) {
    return undefined;
  }
  return z.string().parse(value);
}

export function orderedNearFar<T extends { value: { far: number; near: number } }>(schema: z.ZodType<T>) {
  return schema.refine(value => value.value.far > value.value.near, {
    message: 'far must be greater than near.',
  });
}

export function assertSceneForHeightReference(
  heightReference: HeightReference | undefined,
  scene: Scene | undefined,
  owner: string,
): void {
  if (heightReference !== undefined && heightReference !== HeightReference.NONE && !scene) {
    throw new TypeError(`${owner} requires a Scene when heightReference is not HeightReference.NONE.`);
  }
}
