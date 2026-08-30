/// <reference types="cypress" />

describe('createViewer — viewer bootstrap', () => {
  it('creates a standalone viewer with a WebGL canvas', () => {
    cy.visit('/#/core/createViewer');
    cy.get('[data-testid="viewer-ready"]').should('exist');
    cy.get('canvas').should('exist').and(($canvas) => {
      const canvas = $canvas[0] as HTMLCanvasElement;
      expect(canvas.width).to.be.greaterThan(0);
      expect(canvas.height).to.be.greaterThan(0);
      const gl = canvas.getContext('webgl') ?? canvas.getContext('webgl2') ?? canvas.getContext('experimental-webgl' as any);
      expect(gl, 'WebGL context').to.not.equal(null);
    });
  });
});
