import type { Entity } from 'cesium';
import type { PlotScheme, PlotSchemeConstructorOptions } from './PlotScheme';
import type { SampledPlotPropertyConstructorOptions } from './SampledPlotProperty';
import { createGuid, Event } from 'cesium';
import { SampledPlotProperty } from './SampledPlotProperty';

export type PlotDefinitionChangedCallback = (
  scope: PlotFeature,
  key: keyof PlotFeature,
  newValue: PlotFeature[typeof key],
  oldValue: PlotFeature[typeof key],
) => void;

export interface PlotConstructorOptions {
  id?: string;
  disabled?: boolean;
  scheme: string | PlotScheme | PlotSchemeConstructorOptions;
  sampled?: SampledPlotProperty | SampledPlotPropertyConstructorOptions;
}

export class PlotFeature {
  constructor(options: PlotConstructorOptions) {
    const { id, disabled = false, sampled } = options;

    this._id = id || createGuid();
    this._definitionChanged = new Event();
    this._defining = true;
    this._disabled = disabled;
    this._sampled = sampled instanceof SampledPlotProperty ? sampled : new SampledPlotProperty(sampled);
    this._entities = [];
    this._primitives = [];
    this._groundPrimitives = [];
    this._skeletons = [];
  }

  /**
   * @internal
   */
  private _id: string;

  public get id(): string {
    return this.id;
  }

  /**
   * @internal
   */
  private _definitionChanged: Event<PlotDefinitionChangedCallback>;

  get definitionChanged(): Event<PlotDefinitionChangedCallback> {
    return this.definitionChanged;
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
    this._definitionChanged.raiseEvent(this, 'entities', this._entities, value);
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
    this._definitionChanged.raiseEvent(this, 'primitives', this._primitives, value);
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
    this._definitionChanged.raiseEvent(this, 'groundPrimitives', this._groundPrimitives, value);
    this._groundPrimitives = value;
  }

  /**
   * @internal
   */
  private _skeletons: Entity[];

  get skeletons(): Entity[] {
    return this._skeletons;
  }

  /**
   * @internal
   */
  set skeletons(value: Entity[]) {
    this._definitionChanged.raiseEvent(this, 'skeletons', this._skeletons, value);
    this._skeletons = value;
  }
}
