import type { Viewer } from 'cesium';

export interface AppState {
  viewer?: Viewer;
}

declare global {
  interface Window {
    __app: AppState;
  }
}

export {};
