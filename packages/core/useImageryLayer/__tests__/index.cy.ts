/// <reference types="cypress" />

describe('useImageryLayer — imagery lifecycle', () => {
  it('toggling isActive adds and removes the imagery layer', () => {
    cy.visit('/#/core/useImageryLayer');
    cy.window().its('__app.viewer.imageryLayers.length').should('eq', 1);
    cy.contains('button', 'visible:').click();
    cy.window().its('__app.viewer.imageryLayers.length').should('eq', 0);
    cy.contains('button', 'visible:').click();
    cy.window().its('__app.viewer.imageryLayers.length').should('eq', 1);
  });
});
