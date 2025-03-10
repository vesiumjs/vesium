import type { EntityCollection, Viewer } from 'cesium';
import type { PlotFeature } from './PlotFeature';
import { createGuid, CustomDataSource, Event, PrimitiveCollection } from 'cesium';

export type PlotCollectionChanged = (scope: PlotFeatureCollection, added: PlotFeature[], removed: PlotFeature[]) => void;

export interface PlotCollectionConstructorOptions {
  id?: string;
}

export class PlotFeatureCollection {
  constructor(options: PlotCollectionConstructorOptions) {
    const { id } = options;
    this._id = id || createGuid();
    this._isDestroyed = false;
  }

  /**
   * @internal
   */
  private _init(viewer: Viewer) {
    this._viewer = viewer;
    this._collectionChanged = new Event<PlotCollectionChanged>();
    this._values = new Set<PlotFeature>();
    this._dataSource = new CustomDataSource();
    this._skeletonDataSource = new CustomDataSource();
    this._primitives = new PrimitiveCollection();
    this._groundPrimitives = new PrimitiveCollection();

    viewer.dataSources.add(this._dataSource);
    viewer.dataSources.add(this._skeletonDataSource);
    viewer.scene.primitives.add(this._primitives);
    viewer.scene.groundPrimitives.add(this._groundPrimitives);
  };

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
  private declare _viewer: Viewer;

  /**
   * @internal
   */
  private declare _collectionChanged: Event<PlotCollectionChanged>;

  get collectionChanged(): Event<PlotCollectionChanged> {
    return this._collectionChanged;
  }

  /**
   * @internal
   */
  private declare _values: Set<PlotFeature>;

  get values(): PlotFeature[] {
    return Array.from(this._values);
  }

  add(value: PlotFeature): boolean {
    if (this._isDestroyed) {
      throw new Error(`PlotFeatureCollection is isDestroyed`);
    }
    return this._values.has(value) ? false : !!this._values.add(value);
  }

  remove(value: PlotFeature): boolean {
    return this._values.delete(value);
  }

  /**
   * @internal
   */
  private declare _dataSource: CustomDataSource;

  get entities(): EntityCollection {
    return this._dataSource.entities;
  }

  /**
   * @internal
   */
  private declare _primitives: PrimitiveCollection;

  get primitives(): PrimitiveCollection {
    return this._primitives;
  }

  /**
   * @internal
   */
  private declare _groundPrimitives: PrimitiveCollection;

  get groundPrimitives(): PrimitiveCollection {
    return this._groundPrimitives;
  }

  /**
   * @internal
   */
  private declare _skeletonDataSource: CustomDataSource;

  get skeletons(): EntityCollection {
    return this._skeletonDataSource.entities;
  }

  /**
   * @internal
   */
  private _isDestroyed: boolean;

  isDestroyed(): boolean {
    return this._isDestroyed;
  }

  destroy(): void {
    if (!this._isDestroyed) {
      this._viewer.dataSources.remove(this._dataSource);
      this._viewer.dataSources.remove(this._skeletonDataSource);
      this._viewer.scene.primitives.remove(this._primitives);
      this._viewer.scene.groundPrimitives.remove(this._groundPrimitives);
      this._viewer.dataSources.remove(this._skeletonDataSource);
      this._isDestroyed = true;
    }
  }

  /**
   * @internal
   */
  private static _plotCollectionsMap = new WeakMap<Viewer, Set<PlotFeatureCollection>>();

  /**
   * @internal
   */
  private static _plotCollectionsChanged: Event<(scope: typeof PlotFeatureCollection, viewer: Viewer, added?: PlotFeatureCollection, removed?: PlotFeatureCollection) => void>;

  static get plotCollectionsChanged(): Event<(scope: typeof PlotFeatureCollection, viewer: Viewer, added?: PlotFeatureCollection, removed?: PlotFeatureCollection) => void> {
    return PlotFeatureCollection._plotCollectionsChanged;
  }

  static getViewerPlotCollections(viewer: Viewer): PlotFeatureCollection[] {
    const set = PlotFeatureCollection._plotCollectionsMap.get(viewer);
    return Array.from(set ?? []);
  }

  static addPlotCollection(viewer: Viewer, plotCollection: PlotFeatureCollection): boolean {
    if (PlotFeatureCollection._plotCollectionsMap.get(viewer)) {
      PlotFeatureCollection._plotCollectionsMap.set(viewer, new Set());
    }
    const set = PlotFeatureCollection._plotCollectionsMap.get(viewer);
    const added = set!.has(plotCollection) ? !!set!.add(plotCollection) : false;
    if (added) {
      PlotFeatureCollection.plotCollectionsChanged.raiseEvent(PlotFeatureCollection, viewer, plotCollection, undefined);
    }
    return added;
  }

  static removePlotCollection(viewer: Viewer, plotCollection: PlotFeatureCollection): boolean {
    const set = PlotFeatureCollection._plotCollectionsMap.get(viewer);
    const removed = !!set?.delete(plotCollection);
    if (removed) {
      plotCollection.destroy();
      PlotFeatureCollection.plotCollectionsChanged.raiseEvent(PlotFeatureCollection, viewer, undefined, plotCollection);
    }
    return removed;
  }
}
