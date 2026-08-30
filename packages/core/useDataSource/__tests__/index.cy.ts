/// <reference types="cypress" />

describe('useDataSource — GeoJSON loading', () => {
  it('loads the GeoJSON into a viewer data source and shows loaded state', () => {
    cy.visit('/#/core/useDataSource');
    cy.window().its('__app.viewer.dataSources.length').should('eq', 1);
    cy.contains('dataSource loaded', { timeout: 10000 }).should('exist');
    cy.window().should((win) => {
      const viewer = (win as any).__app.viewer!;
      let count = 0;
      for (let i = 0; i < viewer.dataSources.length; i++) {
        count += viewer.dataSources.get(i)!.entities.values.length;
      }
      expect(count).to.be.gte(1);
    });
  });
});
