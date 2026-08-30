/// <reference types="cypress" />

function clickEntity(entityIndex: number, opts: { waitForFlight?: number } = {}) {
  cy.wait(opts.waitForFlight ?? 0);
  cy.window().then((win) => {
    const viewer = (win as any).__app.viewer!;
    const entity = viewer.entities.values[entityIndex]!;
    const position = entity.position!.getValue(viewer.clock.currentTime)!;
    const canvasPos = viewer.scene.cartesianToCanvasCoordinates(position)!;
    cy.get('canvas').click(canvasPos.x, canvasPos.y);
  });
}

describe('useGraphicEvent — click/hover/drag dispatch', () => {
  it('clicking the first point fires LEFT_CLICK and updates label to CLICKED', () => {
    cy.visit('/#/core/useGraphicEvent');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 3);
    clickEntity(0, { waitForFlight: 4000 });
    cy.window().should((win) => {
      const viewer = (win as any).__app.viewer!;
      const label = viewer.entities.values[0]!.label!;
      expect(label.text!.getValue(viewer.clock.currentTime)).to.eq('CLICKED');
    });
  });
});
