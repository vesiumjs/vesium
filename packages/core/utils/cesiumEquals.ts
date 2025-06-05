import { isFunction } from './is';

/**
 * Determines if two Cesium objects are equal.
 *
 * This function not only judges whether the instances are equal,
 * but also judges the equals method in the example.
 *
 * @param left The first Cesium object
 * @param right The second Cesium object
 * @returns Returns true if the two Cesium objects are equal, otherwise false
 */
export function cesiumEquals(left: any, right: any): boolean {
  return left === right || (isFunction(left?.equals) && left.equals(right)) || (isFunction(right?.equals) && right.equals(left));
}
