import type { MaybeProperty } from './property';
import { defined } from 'cesium';

/**
 * Determines if the Cesium property is a constant.
 *
 * @param value Cesium property
 */
export function isCesiumConstant(value: MaybeProperty): boolean {
  return !defined(value) || !!value.isConstant;
}
