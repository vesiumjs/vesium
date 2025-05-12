import type { Entity } from 'cesium';
import type { PlotSchemeConstructorOptions } from './PlotScheme';
import type { PlotSkeletonEntity } from './PlotSkeleton';
import type { SampledPlotPropertyConstructorOptions } from './SampledPlotProperty';
import { createGuid, Event } from 'cesium';
import { PlotScheme } from './PlotScheme';
import { SampledPlotProperty } from './SampledPlotProperty';

export type PlotDefinitionChangedCallback = (
  scope: PlotFeature,
  key: keyof PlotFeature,
  newValue: PlotFeature[typeof key],
  oldValue: PlotFeature[typeof key],
) => void;

export interface PlotFeatureConstructorOptions {
  id?: string;
  scheme: string | PlotScheme | PlotSchemeConstructorOptions;
  sampled?: SampledPlotProperty | SampledPlotPropertyConstructorOptions;
  disabled?: boolean;
}

export class PlotFeature {
  constructor(options: PlotFeatureConstructorOptions) {
    const { id, disabled = false, sampled } = options;
    this._id = id || createGuid();
    this._scheme = PlotScheme.resolve(options.scheme);

    this._definitionChanged = new Event();
    this._defining = true;
    this._disabled = disabled;
    this._sampled = sampled instanceof SampledPlotProperty ? sampled : new SampledPlotProperty(sampled);
    this._sampled.definitionChanged.addEventListener(property => this._definitionChanged.raiseEvent(this, 'sampled', property, property), this);

    this._entities = [...this._scheme.initEntites?.() ?? []];
    this._primitives = [...this._scheme.initPrimitives?.() ?? []];
    this._groundPrimitives = [...this._scheme.initGroundPrimitives?.() ?? []];
    this._skeletons = [];
  }

  /**
   * @internal
   */
  private _id: string;

  get id(): string {
    return this._id;
  }

  /**
   * @internal
   */
  private _scheme: PlotScheme;

  get scheme(): PlotScheme {
    return this._scheme;
  }

  /**
   * @internal
   */
  private _definitionChanged: Event<PlotDefinitionChangedCallback>;

  get definitionChanged(): Event<PlotDefinitionChangedCallback> {
    return this._definitionChanged;
  }

  /**
   * @internal
   */
  private _defining: boolean;

  get defining(): boolean {
    return this._defining;
  }

  /**
   * @internal
   */
  static setDefining(plot: PlotFeature, value: boolean): void {
    if (plot._defining !== value) {
      plot._definitionChanged.raiseEvent(plot, 'defining', value, plot._defining);
      plot._defining = value;
    }
  }

  private _disabled: boolean;

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: string) {
    this.disabled = value;
  }

  /**
   * @internal
   */
  private _sampled: SampledPlotProperty;

  get sampled(): SampledPlotProperty {
    return this._sampled;
  }

  /**
   * @internal
   */
  private _entities: Entity[];

  get entities(): Entity[] {
    return this._entities;
  }

  set entities(value: Entity[]) {
    this._definitionChanged.raiseEvent(this, 'entities', value, this._entities);
    this._entities = value;
  }

  /**
   * @internal
   */
  private _primitives: any[];

  get primitives(): any[] {
    return this._primitives;
  }

  /**
   * @internal
   */
  set primitives(value: any[]) {
    this._definitionChanged.raiseEvent(this, 'primitives', value, this._primitives);
    this._primitives = value;
  }

  /**
   * @internal
   */
  private _groundPrimitives: any[];

  get groundPrimitives(): any[] {
    return this._groundPrimitives;
  }

  /**
   * @internal
   */
  set groundPrimitives(value: any[]) {
    this._definitionChanged.raiseEvent(this, 'groundPrimitives', value, this._groundPrimitives);
    this._groundPrimitives = value;
  }

  /**
   * @internal
   */
  private _skeletons: PlotSkeletonEntity[];

  get skeletons(): PlotSkeletonEntity[] {
    return this._skeletons;
  }

  /**
   * @internal
   */
  set skeletons(value: PlotSkeletonEntity[]) {
    this._definitionChanged.raiseEvent(this, 'skeletons', value, this._skeletons);
    this._skeletons = value;
  }
}
