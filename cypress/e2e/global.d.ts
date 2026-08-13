import type { AppState } from '../../e2e/app/src/state';

declare global {
  namespace Cypress {
    interface AUTWindow {
      __app: AppState;
    }
  }
}

export {};
