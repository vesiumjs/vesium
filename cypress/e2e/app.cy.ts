/**
 * E2E smoke suite for the docs-mirrored host app (e2e/app).
 *
 * Detailed business behavior is covered by colocated specs under
 * packages/**\/__tests__/index.cy.ts — each demo is verified there with
 * real viewer assertions. This file only smoke-tests host mounting and
 * routing, plus the integration scenes whose e2e coverage intentionally
 * lives here (geometry/plot, which have no core hook spec).
 */

function assertEntityCountInDataSources(expected: number, minimum = false) {
  cy.window().should((win) => {
    const viewer = win.__app.viewer!;
    let count = 0;
    for (let i = 0; i < viewer.dataSources.length; i++) {
      count += viewer.dataSources.get(i)!.entities.values.length;
    }
    if (minimum) {
      expect(count).to.be.gte(expected);
    }
    else {
      expect(count).to.eq(expected);
    }
  });
}

function completePlot(clicks: number) {
  cy.get('canvas').click(300, 200);
  cy.get('canvas').click(500, 200);
  for (let i = 2; i < clicks; i++) {
    cy.get('canvas').click(400, 350);
  }
  cy.get('canvas').dblclick(400, 350);
}

describe('Vesium E2E smoke (host)', () => {
  it('host mounts a demo route with canvas and viewer', () => {
    // createViewer mounts its own Viewer without the host wrapper, so
    // window.__app.viewer is not set there — use a hosted demo as baseline.
    cy.visit('/#/core/useEntity');
    cy.get('canvas').should('exist');
    cy.window().its('__app.viewer').should('exist');
  });

  it('geometry: renders circle, ellipse and arrow geometries', () => {
    cy.visit('/#/geometry');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 3);
  });

  it('plot usePlot: draws and completes a polygon by clicking the canvas', () => {
    cy.visit('/#/plot/usePlot');
    cy.contains('button', 'Polygon').click();
    completePlot(3);
    assertEntityCountInDataSources(1, true);
  });

  it('plot measure: measures a distance by clicking two points', () => {
    cy.visit('/#/plot/measure');
    cy.contains('button', 'distance').click();
    completePlot(2);
    assertEntityCountInDataSources(1, true);
  });

  it('plot scheme: completes a Point scheme with a single click', () => {
    cy.visit('/#/plot/scheme');
    cy.contains('button', 'Point').click();
    cy.get('canvas').click(400, 300);
    assertEntityCountInDataSources(1, true);
  });

  it('plot skeleton: draws a polygon through the skeleton interaction', () => {
    cy.visit('/#/plot/skeleton');
    cy.contains('button', /Skeleton/).click();
    completePlot(3);
    assertEntityCountInDataSources(1, true);
  });

  it('navigates between demo pages with the app router', () => {
    cy.visit('/#/core/useEntity');
    cy.contains('a', 'useDataSource').click();
    cy.url().should('include', '/#/core/useDataSource');
    cy.window().its('__app.viewer.dataSources.length').should('eq', 1);
  });
});
