/// <reference types="cypress" />

describe('useScreenSpaceEventHandler — screen-space events', () => {
  it('dispatches clicks and mouse-move with canvas coordinates', () => {
    cy.visit('/#/core/useScreenSpaceEventHandler');

    cy.get('[data-testid="hitCount"]').should('exist');
    // The demo overlays a 200px panel on top of the canvas — click/drag on
    // the canvas at a point outside the overlay so actionability checks pass.
    cy.get('canvas').click(600, 400);
    cy.get('[data-testid="hitCount"]').should(($el) => {
      expect(Number.parseInt($el.text().replace(/\D/g, ''), 10)).to.be.gte(1);
    });
    cy.contains('span', '"x":600').should('exist');
    cy.contains('span', '"y":400').should('exist');

    // MOUSE_MOVE should also be captured (demo registers every ScreenSpaceEventType).
    cy.get('canvas').trigger('pointermove', 620, 350);
    cy.contains('span', 'MOUSE_MOVE').should(($el) => {
      expect($el.text()).to.not.include('--');
    });

    // A second click location should update the stored position.
    cy.get('canvas').click(700, 100);
    cy.contains('span', '"x":700').should('exist');
    cy.contains('span', '"y":100').should('exist');
  });
});
