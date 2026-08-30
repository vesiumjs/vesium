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

function waitUntilPickable(entityIndex: number) {
  cy.window().should((win) => {
    const viewer = (win as any).__app.viewer!;
    const entity = viewer.entities.values[entityIndex]!;
    const position = entity.position!.getValue(viewer.clock.currentTime)!;
    const canvasPos = viewer.scene.cartesianToCanvasCoordinates(position)!;
    const picked = viewer.scene.pick(canvasPos, 3, 3);
    expect(picked === undefined).to.eq(false);
  });
}

function flyTo(lon: number, lat: number, altitude: number) {
  cy.window().then((win) => {
    (win as any).__app.viewer!.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, altitude),
    });
  });
}

describe('useSceneDrillPick — stacked picking', () => {
  it('hovers the stack center and drills all three layers', () => {
    cy.visit('/#/core/useSceneDrillPick');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 3);
    flyTo(120, 30, 60000);
    waitUntilPickable(0);
    hoverEntity(0);
    cy.contains('Layer 1 - Red', { timeout: 10000 }).should('exist');
    cy.contains('Layer 2 - Green').should('exist');
    cy.contains('Layer 3 - Blue').should('exist');
  });

  it('verifies drillPick returns multiple entities (array, not a single object)', () => {
    cy.visit('/#/core/useSceneDrillPick');
    flyTo(120, 30, 60000);
    waitUntilPickable(0);
    hoverEntity(0);
    // The demo numbers the drill results "1. Entity: ...", "2. Entity: ...";
    // a single-object result would only ever render entry 1.
    cy.contains('div', /2\. Entity:/, { timeout: 10000 }).should('exist');
    cy.contains('div', /3\. Entity:/).should('exist');
  });
});
