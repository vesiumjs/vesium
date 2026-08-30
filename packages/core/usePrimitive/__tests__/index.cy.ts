/// <reference types="cypress" />

describe('usePrimitive — billboard rendering', () => {
  it('renders billboards and exposes count in the demo overlay', () => {
    cy.visit('/#/core/usePrimitive');
    cy.contains('billboards: 1', { timeout: 10000 }).should('exist');
    cy.window().should((win) => {
      const primitives = (win as any).__app.viewer!.scene.primitives;
      let billboards = 0;
      for (let i = 0; i < primitives.length; i++) {
        const primitive = primitives.get(i);
        // Matched by constructor name: the spec bundles its own Cesium copy,
        // so `instanceof` would fail against instances from the app bundle.
        if (primitive?.constructor?.name === 'BillboardCollection')
          billboards += primitive.length;
      }
      expect(billboards).to.eq(1);
      const overlay = Number.parseInt(((win as any).document.body.textContent ?? '').match(/billboards:\s*(\d+)/)?.[1] ?? '0', 10);
      expect(overlay).to.eq(billboards);
    });
  });
});
