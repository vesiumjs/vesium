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
    cy.contains('a', 'Get Started').click();
    cy.url().should('include', '/start');
    cy.get('h1').contains('Getting Started');
  });

  it('should have Cesium canvas on the core/useEntity demo page', () => {
    cy.visit('/core/useEntity');
    cy.get('canvas').should('exist');
  });

  it('should have Cesium canvas on the core/useCameraState demo page', () => {
    cy.visit('/core/useCameraState');
    cy.get('canvas').should('exist');
  });

  it('should show the version link to GitHub releases in the nav', () => {
    cy.visit('/');
    cy.contains('.VPNavBarMenuLink', /^v\d+\.\d+\.\d+$/).should('have.attr', 'href').and('include', 'github.com/vesiumjs/vesium/releases');
  });

  it('should serve the Chinese locale and navigate to its start page', () => {
    cy.visit('/zh/');
    cy.contains('a', '开始使用').click();
    cy.url().should('include', '/zh/start');
    cy.get('h1').contains('开始使用');
  });
});
