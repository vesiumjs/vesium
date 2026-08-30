/// <reference types="cypress" />

describe('useEntity — entity lifecycle', () => {
  it('adds all created entities to the viewer collection', () => {
    cy.visit('/#/core/useEntity');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 5);
  });

  it('entity labels are rendered with correct text', () => {
    cy.visit('/#/core/useEntity');
    cy.window().should((win) => {
      const viewer = (win as any).__app.viewer!;
      const labels = viewer.entities.values.map((e: any) => e.label?.text?.getValue(viewer.clock.currentTime));
      expect(labels).to.include('entity instance');
      expect(labels).to.include('array item 1');
    });
  });
});
