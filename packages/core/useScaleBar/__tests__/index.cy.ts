/// <reference types="cypress" />
import * as Cesium from 'cesium';

describe('useScaleBar — distance scale', () => {
  it('renders a scale bar with a distance text and reacts to altitude', () => {
    cy.visit('/#/core/useScaleBar');

    cy.get('[data-testid="pixelDistance"]', { timeout: 10000 }).should(($el) => {
      const text = $el.text();
      expect(text).to.match(/pixelDistance:\s*[-\d.]+m/);
      const n = Number.parseFloat(text.replace(/^.*pixelDistance:\s*/, '').replace(/m.*$/, ''));
      expect(Number.isFinite(n)).to.equal(true);
      expect(n).to.be.greaterThan(0);
    });

    cy.get('[data-testid="distance"]').should(($el) => {
      const n = Number.parseFloat($el.text().replace(/^.*distance:\s*/, '').replace(/m.*$/, ''));
      expect(Number.isFinite(n)).to.equal(true);
      expect(n).to.be.greaterThan(0);
    });

    cy.get('[data-testid="scalebar"]').should(($el) => {
      expect(Number.parseFloat($el.css('width'))).to.be.greaterThan(0);
    });

    cy.get('[data-testid="pixelDistance"]').invoke('text').then((before) => {
      const beforePixel = Number.parseFloat(before.replace(/^.*pixelDistance:\s*/, '').replace(/m.*$/, ''));
      cy.window().then((win) => {
        (win as any).__app.viewer!.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(100, 0, 50000),
        });
      });
      cy.get('[data-testid="pixelDistance"]', { timeout: 10000 }).should(($el) => {
        const after = Number.parseFloat($el.text().replace(/^.*pixelDistance:\s*/, '').replace(/m.*$/, ''));
        expect(Number.isFinite(after)).to.equal(true);
        expect(after).to.not.equal(beforePixel);
      });
    });
  });
});
