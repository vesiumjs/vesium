/// <reference types="cypress" />
import * as Cesium from 'cesium';

describe('useCesiumEventListener — camera events', () => {
  it('reacts to camera movement through moveStart and moveEnd', () => {
    cy.visit('/#/core/useCesiumEventListener');
    cy.contains('div', 'no change').should('exist');
    cy.window().then((win) => {
      const viewer = (win as any).__app.viewer!;
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 2000000),
      });
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(10, 10, 2000000),
        duration: 0.8,
      });
    });
    cy.contains('div', 'moveStart', { timeout: 10000 }).should('exist');
    cy.contains('div', 'moveEnd', { timeout: 10000 }).should('exist');
  });

  it('clicking the demo Fly button also fires the listener', () => {
    cy.visit('/#/core/useCesiumEventListener');
    cy.contains('button', 'Fly').click();
    cy.contains('div', 'moveEnd', { timeout: 10000 }).should('exist');
  });
});
