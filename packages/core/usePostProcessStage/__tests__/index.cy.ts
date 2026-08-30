/// <reference types="cypress" />

function watchRenderTicks(win: any) {
  win.__renderTicks = 0;
  win.__app.viewer!.scene.postRender.addEventListener(() => {
    win.__renderTicks += 1;
  });
}

function assertRenderLoopAlive() {
  // The render loop dies (RAF chain stops) when scene.render throws, e.g.
  // after re-adding a destroyed post process stage.
  cy.wait(500);
  cy.window().should((win) => {
    expect((win as any).__renderTicks).to.be.greaterThan(3);
  });
}

describe('usePostProcessStage — bloom effect', () => {
  it('adds a post process stage to the scene and toggles it without killing the render loop', () => {
    cy.visit('/#/core/usePostProcessStage');
    cy.contains('button', 'PostProcessStage').should('exist');
    // One stage is always-on, the other is bound to isActive.
    cy.window().its('__app.viewer.postProcessStages.length').should('be.gte', 1);
    cy.window().then(win => watchRenderTicks(win as any));
    assertRenderLoopAlive();

    cy.contains('button', 'PostProcessStage').click();
    cy.contains('OFF').should('exist');
    cy.window().its('__app.viewer.postProcessStages.length').should('eq', 1);

    cy.contains('button', 'PostProcessStage').click();
    cy.contains('ON').should('exist');
    cy.window().its('__app.viewer.postProcessStages.length').should('eq', 2);

    // The stage instance must still be usable after a full toggle cycle.
    cy.window().then((win) => {
      (win as any).__renderTicks = 0;
    });
    assertRenderLoopAlive();
  });
});
