/**
 * Read an internal (underscore-prefixed) field of a Cesium instance.
 *
 * Cesium keeps several fields private without exposing them in the public type
 * definitions, so a safe runtime access is needed for serialization.
 */
export function readPrivate<T>(instance: object, key: string): T | undefined {
  return (instance as Record<string, unknown>)[key] as T | undefined;
}
