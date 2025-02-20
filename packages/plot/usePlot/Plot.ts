import type { Entity, JulianDate } from 'cesium';
import type { PlotSchemeConstructorOptions } from './PlotScheme';
import type { PlotSkeletonEntity } from './PlotSkeleton';
import type { SampledPlotPropertyConstructorOptions } from './SampledPlotProperty';
import { assertError, createCesiumAttribute, createCesiumProperty } from '@vesium/shared';
import { notNullish } from '@vueuse/core';
import { createGuid, Event } from 'cesium';
import { PlotScheme } from './PlotScheme';
import { SampledPlotProperty } from './SampledPlotProperty';

/**
 * Options for constructing a Plot instance.
 */
export interface PlotConstructorOptions {
  /**
   * A unique identifier for the plot.
   */
  id?: string;

  /**
   * Whether the plot is disabled.
   */
  disabled?: boolean;

  /**
   * The scheme for the plot.
   * If it is a string, it will attempt to retrieve the corresponding `PlotScheme.type` object from the cache internally.
   */
  scheme: string | PlotScheme | PlotSchemeConstructorOptions;

  /**
   * Sampled plot property.
   */
  sampled?: SampledPlotProperty | SampledPlotPropertyConstructorOptions;
}

export class Plot {
  constructor(options: PlotConstructorOptions) {
    assertError(!notNullish(options.scheme), 'options.scheme is required');

    this.id = options.id || createGuid();
    createCesiumAttribute(this, 'disabled', !!options.disabled);
    createCesiumAttribute(this, 'defining', true);
    createCesiumAttribute(this, 'scheme', PlotScheme.resolve(options.scheme), { readonly: true });
    const sampled = options.sampled instanceof SampledPlotProperty ? options.sampled : new SampledPlotProperty(options.sampled);
    createCesiumProperty(this, 'sampled', sampled);
    createCesiumAttribute(this, 'entities', []);
    createCesiumAttribute(this, 'primitives', []);
    createCesiumAttribute(this, 'groundPrimitives', []);
    createCesiumAttribute(this, 'skeletonEntities', []);
  }

  /**
   * @internal
   */
  private _definitionChanged = new Event();

  /**
   * An event that is raised when a property is changed.
   */
  get definitionChanged(): Event<(scope: Plot, key: keyof Plot, newValue: Plot[typeof key], oldValue: Plot[typeof key]) => void> {
    return this._definitionChanged;
  }

  time?: JulianDate;

  /**
   * A unique identifier for the plot.
   */
  declare id: string;

  /**
   * Whether the plot is disabled.
   */
  declare disabled: boolean;

  /**
   * The scheme for the plot.
   */
  declare readonly scheme: PlotScheme;

  /**
   * Sampled plot property.
   */
  declare sampled: SampledPlotProperty;

  /**
   * @internal
   */
  declare defining: boolean;

  /**
   * 当前标绘是否处于定义态
   */
  isDefining(): boolean {
    return this.defining;
  }

  /**
   * @internal
   */
  declare entities: Entity[];

  /**
   * 获取当前标绘的entity数组
   */
  getEntities(): Entity[] {
    return [...this.entities];
  }

  /**
   * @internal
   */
  declare primitives: any[];

  /**
   * 获取当前标绘的primitive数组
   */
  getPrimitives(): any[] {
    return [...this.primitives];
  }

  /**
   * @internal
   */
  declare groundPrimitives: any[];

  /**
   * 获取当前标绘的贴地primitive数组
   */
  getGroundPrimitives(): any[] {
    return [...this.groundPrimitives];
  }

  /**
   * @internal
   */
  declare skeletonEntities: PlotSkeletonEntity[];

  /**
   * 获取当前标绘标绘的骨架点entity数组
   */
  getSkeletonEntities(): PlotSkeletonEntity[] {
    return [...this.skeletonEntities];
  }
}
