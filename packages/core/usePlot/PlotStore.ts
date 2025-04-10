import type { Viewer } from 'cesium';
import type { PlotFeatureCollection } from './PlotFeatureCollection';
import { Event } from 'cesium';
import { assertError } from 'vesium';

export interface PlotStoreConstructorOptions {
  viewer: Viewer;
}

const storeCollection = new WeakMap<Viewer, PlotStore>();

export class PlotStore {
  static getInstance(viewer: Viewer): PlotStore {
    if (viewer.isDestroyed()) {
      storeCollection.get(viewer)?.destroy();
      throw new Error('viewer has been destroyed');
    }
    let instance = storeCollection.get(viewer);
    if (!instance) {
      instance = new PlotStore(viewer);
      storeCollection.set(viewer, instance);
    }
    return instance;
  }

  private constructor(viewer: Viewer) {
    if (viewer.isDestroyed()) {
      throw new Error('viewer has been destroyed');
    }
    this._viewer = viewer;
    this._values = new Set<PlotFeatureCollection>();
    this._isDestroyed = false;
    this._storeChanged = new Event();
  }

  /**
   * @internal
   */
  private _viewer: Viewer;

  /**
   * @internal
   */
  private _values: Set<PlotFeatureCollection>;

  get values(): PlotFeatureCollection[] {
    return Array.from(this._values);
  }

  /**
   * @internal
   */
  private _storeChanged: Event<(scope: PlotStore, added?: PlotFeatureCollection, removed?: PlotFeatureCollection) => void>;

  get storeChanged(): Event<(scope: PlotStore, added?: PlotFeatureCollection, removed?: PlotFeatureCollection) => void> {
    return this._storeChanged;
  }

  add(value: PlotFeatureCollection): boolean {
    assertError(!this.isDestroyed(), 'PlotStore has been destroyed');
    if (value && !this._values.has(value)) {
      this._values.add(value);
      this._storeChanged.raiseEvent(this, value);
      return true;
    }
    else {
      return false;
    }
  }

  remove(value: PlotFeatureCollection): boolean {
    if (this._values.delete(value)) {
      this._storeChanged.raiseEvent(this, undefined, value);
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * @internal
   */
  private _isDestroyed: boolean;

  isDestroyed(): boolean {
    if (this._viewer.isDestroyed()) {
      this.destroy();
    }
    return !!this._isDestroyed;
  }

  destroy() {
    if (this._isDestroyed) {
      return;
    }
    this._values.forEach(item => item.destroy());
    this._values.clear();
    storeCollection.delete(this._viewer);
    this._isDestroyed = true;
  }
}
