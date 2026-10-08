/// <reference types="cypress" />
import * as Cesium from 'cesium';

function hoverEntity(entityIndex: number) {
  cy.window().then((win) => {
    const viewer = (win as any).__app.viewer!;
    const entity = viewer.entities.values[entityIndex]!;
    const position = entity.position!.getValue(viewer.clock.currentTime)!;
    const canvasPos = viewer.scene.cartesianToCanvasCoordinates(position)!;
    cy.get('canvas').trigger('pointermove', canvasPos.x, canvasPos.y);
    cy.wait(100);
    cy.get('canvas').trigger('pointermove', canvasPos.x + 2, canvasPos.y);
  });
}

function waitUntilStackPickable() {
  cy.window().should((win) => {
    const viewer = (win as any).__app.viewer!;
    const entity = viewer.entities.values[0]!;
    const position = entity.position!.getValue(viewer.clock.currentTime)!;
    const canvasPos = viewer.scene.cartesianToCanvasCoordinates(position)!;
    // Wait until all three stacked boxes are drilled at the hover point,
    // so the assertions below do not race async box geometry creation.
    const picked = viewer.scene.drillPick(canvasPos, 10, 5, 5);
    expect(picked.length).to.eq(3);
  });
}

function flyTo(lon: number, lat: number, altitude: number) {
  cy.window().then((win) => {
    const viewer = (win as any).__app.viewer!;
    // The demo starts an intro camera flight on mount; cancel it so the view
    // stays straight above the stack and the boxes remain on the pick ray.
    viewer.camera.cancelFlight();
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, altitude),
    });
  });
}

describe('useSceneDrillPick — stacked picking', () => {
  it('hovers the stack center and drills all three layers', () => {
    cy.visit('/#/core/useSceneDrillPick');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 3);
    flyTo(120, 30, 60000);
    waitUntilStackPickable();
    hoverEntity(0);
    cy.contains('Layer 1 - Red', { timeout: 10000 }).should('exist');
    cy.contains('Layer 2 - Green').should('exist');
    cy.contains('Layer 3 - Blue').should('exist');
  });

  it('verifies drillPick returns multiple entities (array, not a single object)', () => {
    cy.visit('/#/core/useSceneDrillPick');
    flyTo(120, 30, 60000);
    waitUntilStackPickable();
    hoverEntity(0);
    // The demo numbers the drill results "1. Entity: ...", "2. Entity: ...";
    // a single-object result would only ever render entry 1.
    cy.contains('div', /2\. Entity:/, { timeout: 10000 }).should('exist');
    cy.contains('div', /3\. Entity:/).should('exist');
  });
});
