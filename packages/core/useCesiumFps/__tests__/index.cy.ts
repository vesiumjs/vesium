/// <reference types="cypress" />

describe('useCesiumFps — frame telemetry', () => {
  it('renders numeric FPS/interval and FPS updates across frames', () => {
    cy.visit('/#/core/useCesiumFps');

    cy.get('[data-testid="fps"]').should(($el) => {
      const text = $el.text();
      expect(text).to.match(/FPS:\s*[-\d.]+/);
      const n = Number.parseFloat(text.replace(/^.*FPS:\s*/, ''));
      expect(Number.isFinite(n)).to.equal(true);
    });
    cy.get('[data-testid="interval"]').should(($el) => {
      const text = $el.text();
      expect(text).to.match(/Interval:\s*[-\d.]+/);
      const n = Number.parseFloat(text.replace(/^.*Interval:\s*/, '').replace(/ms.*$/, ''));
      expect(Number.isFinite(n)).to.equal(true);
    });

    cy.get('[data-testid="fps"]').invoke('text').then((before) => {
      const beforeFps = Number.parseFloat(before.replace(/^.*FPS:\s*/, ''));
      cy.wait(600);
      cy.get('[data-testid="fps"]').should(($el) => {
        const after = Number.parseFloat($el.text().replace(/^.*FPS:\s*/, ''));
        expect(Number.isFinite(after)).to.equal(true);
        expect(after).to.not.equal(beforeFps);
      });
    });
  });
});
