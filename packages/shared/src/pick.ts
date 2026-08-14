import type { Cesium3DTileFeature, Entity, Label, Model, PointPrimitive, Primitive, PrimitiveCollection } from 'cesium';

/**
 * Represents the result of Cesium's scene.pick operation.
 * Can contain various pickable Cesium objects.
 */
export interface ScenePickResult {
  primitive?: Primitive | Model | PointPrimitive | Label | undefined;
  id?: Entity | Cesium3DTileFeature | Entity[] | undefined;
  primitiveCollection?: PrimitiveCollection;
  collection?: PrimitiveCollection;
}

/**
 * Analyze the result of Cesium's `scene.pick` and convert it to an array format
 */
export function resolvePick(pick: ScenePickResult = {}): unknown[] {
  const { primitive, id, primitiveCollection, collection } = pick;
  const entityCollection = (id && typeof id === 'object' && 'entityCollection' in id && id.entityCollection) || null;
  const dataSource = (entityCollection && entityCollection.owner) || null;
  const ids = Array.isArray(id) ? id : [id].filter(Boolean);
  return [
    ...ids,
    primitive,
    primitiveCollection,
    collection,
    entityCollection,
    dataSource,
  ].filter((e): e is NonNullable<typeof e> => !!e);
}

/**
 * Determine if the given array of graphics is hit by Cesium's `scene.pick`
 *
 * @param pick The `scene.pick` object used for matching
 * @param graphic An array of graphics to check for hits
 */
export function pickHitGraphic(pick: ScenePickResult | undefined, graphic: unknown | unknown[]): boolean {
  if (!Array.isArray(graphic) || !graphic.length) {
    return false;
  }
  const elements = resolvePick(pick);
  if (!elements.length) {
    return false;
  }
  return elements.some(element => graphic.includes(element));
}
