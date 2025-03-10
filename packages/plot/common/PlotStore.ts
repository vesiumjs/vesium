import type { Viewer } from 'cesium';
import type { PlotFeatureCollection } from './PlotFeatureCollection';

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

  add() {}

  remove() {}

  /**
   * @internal
   */
  private _isDestroyed: boolean;

  isDestroyed(): boolean {
    return !!this._isDestroyed;
  }

  destroy() {
    if (this._isDestroyed) {
      return;
    }
    this._isDestroyed = true;
    storeCollection.delete(this._viewer);
  }
}
