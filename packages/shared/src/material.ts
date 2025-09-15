import type { Event, JulianDate, MaterialProperty, TextureMagnificationFilter, TextureMinificationFilter } from 'cesium';
import { Material } from 'cesium';

/**
 * Cesium.Material.fabric parameters
 */
export interface CesiumMaterialFabricOptions<U> {
  /**
   * Used to declare what material the fabric object will ultimately generate. If it's an official built-in one, use the official built-in one directly; otherwise, create a custom material and cache it.
   */
  type: string;
  /**
   * Can nest another level of child fabric to form a composite material
   */
  materials?: Material;
  /**
   * glsl code
   */
  source?: string;
  components?: {
    diffuse?: string;
    alpha?: string;
  };
  /**
   * Pass variables to glsl code
   */
  uniforms?: U & Record<string, any>;
}

/**
 * Cesium.Material parameters
 */
export interface CesiumMaterialConstructorOptions<U> {
  /**
   * Strict mode
   */
  strict?: boolean;
  /**
   * translucent
   */
  translucent?: boolean | ((...params: any[]) => any);
  /**
   * Minification filter
   */
  minificationFilter?: TextureMinificationFilter;
  /**
   * Magnification filter
   */
  magnificationFilter?: TextureMagnificationFilter;
  /**
   * Matrix configuration
   */
  fabric: CesiumMaterialFabricOptions<U>;
}

/**
 * Only as a type fix for `Cesium.Material`
 */
export class CesiumMaterial<U> extends Material {
  constructor(options: CesiumMaterialConstructorOptions<U>) {
    super(options);
  }

  /**
   * Matrix configuration
   */
  declare fabric: CesiumMaterialFabricOptions<U>;
}

/**
 * Only as a type fix for `Cesium.MaterialProperty`
 */
export interface CesiumMaterialProperty<V> extends MaterialProperty {
  get isConstant(): boolean;

  get definitionChanged(): Event<(scope: this, field: string, value: any, previous: any) => void>;

  getType: (time: JulianDate) => string;

  getValue: (time: JulianDate, result?: V) => V;

  equals: (other?: any) => boolean;
}

/**
 * Get material from cache, alias of `Material._materialCache.getMaterial`
 */
export function getMaterialCache<T extends Material = CesiumMaterial<any>>(type: string): T | undefined {
  return (Material as any)._materialCache.getMaterial(type);
}

/**
 * Add material to Cesium's material cache, alias of `Material._materialCache.addMaterial`
 */
export function addMaterialCache(type: string, material: CesiumMaterialConstructorOptions<any>): void {
  return (Material as any)._materialCache.addMaterial(type, material);
}
