describe('Vesium Documentation Site', () => {
  it('should load the home page with Vesium branding', () => {
    cy.visit('/');
    cy.get('h1').contains('Vesium');
  });

  it('should render the documentation site layout', () => {
    cy.visit('/');
    cy.get('.VPHero').should('exist');
    cy.get('.VPFeatures').should('exist');
  });

  it('should navigate to the Get Started page', () => {
    cy.visit('/');
    cy.contains('a', '快速开始').click();
    cy.url().should('include', '/start');
    cy.get('h1').contains('开始使用');
  });

  it('should have Cesium canvas on the core/useViewer demo page', () => {
    cy.visit('/core/useViewer');
    cy.get('canvas').should('exist');
  });

  it('should have Cesium canvas on the core/useEntity demo page', () => {
    cy.visit('/core/useEntity');
    cy.get('canvas').should('exist');
  });
});
