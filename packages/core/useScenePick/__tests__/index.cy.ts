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

describe('useScenePick — single-object picking', () => {
  it('hovers an entity and picks the topmost hit', () => {
    cy.visit('/#/core/useScenePick');
    cy.contains('No object picked').should('exist');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 2);
    flyTo(120, 30, 40000);
    waitUntilPickable(0);
    hoverEntity(0);
    cy.contains('Picked Entity: Red Box', { timeout: 10000 }).should('exist');
  });

  it('moves between two adjacent boxes and updates the pick', () => {
    cy.visit('/#/core/useScenePick');
    flyTo(120, 30, 40000);
    waitUntilPickable(1);
    hoverEntity(1);
    cy.contains('Picked Entity: Blue Box', { timeout: 10000 }).should('exist');
  });
});
