import * as Cesium from 'cesium';

/**
 * Behavior tests against the docs demo components (the demo.vue files under
 * the packages directory), mounted in the e2e host app through demo-host.vue.
 *
 * The host reuses packages/.vitepress/theme/components/cesium-container.vue
 * in e2e mode: no Ion network access, no default base layer, default input
 * actions kept. Scene state is asserted through window.__app.viewer.
 */

function clickEntity(entityIndex: number, options: { waitForFlight?: number } = {}) {
  cy.wait(options.waitForFlight ?? 0);
  cy.window().then((win) => {
    const viewer = win.__app.viewer!;
    const entity = viewer.entities.values[entityIndex]!;
    const position = entity.position!.getValue(viewer.clock.currentTime)!;
    const canvasPos = viewer.scene.cartesianToCanvasCoordinates(position)!;
    cy.get('canvas').click(canvasPos.x, canvasPos.y);
  });
}

function hoverEntity(entityIndex: number) {
  cy.window().then((win) => {
    const viewer = win.__app.viewer!;
    const entity = viewer.entities.values[entityIndex]!;
    const position = entity.position!.getValue(viewer.clock.currentTime)!;
    const canvasPos = viewer.scene.cartesianToCanvasCoordinates(position)!;
    // Cesium uses pointer events on browsers that support them.
    // Trigger twice with a slight offset: useScenePick caches picks by
    // position, so the first event (before the scene rendered the new
    // camera) would otherwise pin a cached `undefined` forever.
    cy.get('canvas').trigger('pointermove', canvasPos.x, canvasPos.y);
    cy.wait(100);
    cy.get('canvas').trigger('pointermove', canvasPos.x + 2, canvasPos.y);
  });
}

function waitUntilPickable(entityIndex: number) {
  cy.window().should((win) => {
    const viewer = win.__app.viewer!;
    const entity = viewer.entities.values[entityIndex]!;
    const position = entity.position!.getValue(viewer.clock.currentTime)!;
    const canvasPos = viewer.scene.cartesianToCanvasCoordinates(position)!;
    const picked = viewer.scene.pick(canvasPos, 3, 3);
    expect(picked === undefined).to.eq(false);
  });
}

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

function flyTo(lon: number, lat: number, altitude: number) {
  cy.window().then((win) => {
    win.__app.viewer!.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, altitude),
    });
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

describe('Vesium E2E (docs demos)', () => {
  it('createViewer: creates a standalone viewer with a WebGL canvas', () => {
    cy.visit('/#/core/createViewer');
    cy.get('canvas').should('exist');
  });

  it('useCameraState: exposes camera state to the template', () => {
    cy.visit('/#/core/useCameraState');
    cy.contains('pre', '"heading"').should('exist');
    cy.contains('pre', '"position"').should('exist');
  });

  it('useCesiumEventListener: reacts to camera moveStart/moveEnd', () => {
    cy.visit('/#/core/useCesiumEventListener');
    cy.contains('div', 'no change').should('exist');
    cy.window().then((win) => {
      win.__app.viewer!.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 2000000),
        duration: 1,
      });
    });
    cy.contains('div', 'moveEnd', { timeout: 10000 }).should('exist');
  });

  it('useCesiumFps: renders FPS and interval values', () => {
    cy.visit('/#/core/useCesiumFps');
    cy.contains('span', /FPS:/).should('exist');
    cy.contains('span', /Interval:/).should('exist');
  });

  it('useDataSource: loads the GeoJSON into a viewer data source', () => {
    cy.visit('/#/core/useDataSource');
    cy.window().its('__app.viewer.dataSources.length').should('eq', 1);
    assertEntityCountInDataSources(1, true);
  });

  it('useEntity: adds all created entities to the viewer collection', () => {
    cy.visit('/#/core/useEntity');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 5);
  });

  it('useGraphicEvent: entity click triggers the graphic event handler', () => {
    cy.visit('/#/core/useGraphicEvent');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 3);
    clickEntity(0, { waitForFlight: 4000 });
    cy.window().should((win) => {
      const viewer = win.__app.viewer!;
      const label = viewer.entities.values[0]!.label!;
      expect(label.text!.getValue(viewer.clock.currentTime)).to.eq('CLICKED');
    });
  });

  it('useImageryLayer: toggling isActive adds/removes the imagery layer', () => {
    cy.visit('/#/core/useImageryLayer');
    cy.window().its('__app.viewer.imageryLayers.length').should('eq', 1);
    cy.contains('button', 'visible:').click();
    cy.window().its('__app.viewer.imageryLayers.length').should('eq', 0);
    cy.contains('button', 'visible:').click();
    cy.window().its('__app.viewer.imageryLayers.length').should('eq', 1);
  });

  it('usePostProcessStage: adds a post process stage to the scene', () => {
    cy.visit('/#/core/usePostProcessStage');
    cy.contains('button', 'PostProcessStage').should('exist');
    cy.window().its('__app.viewer.postProcessStages.length').should('be.gte', 1);
  });

  it('usePrimitive: renders billboards through a primitive collection', () => {
    cy.visit('/#/core/usePrimitive');
    cy.window().should((win) => {
      const primitives = win.__app.viewer!.scene.primitives;
      let billboards = 0;
      for (let i = 0; i < primitives.length; i++) {
        const primitive = primitives.get(i) as { length?: number };
        if (typeof primitive.length === 'number')
          billboards += primitive.length;
      }
      expect(billboards).to.be.gte(1);
    });
  });

  it('useScaleBar: renders a scale with a distance text', () => {
    cy.visit('/#/core/useScaleBar');
    cy.contains('main', /distance:\s*\d+(\.\d+)?\s?m/, { timeout: 10000 }).should('exist');
  });

  it('useScenePick: hovers an entity and picks it', () => {
    cy.visit('/#/core/useScenePick');
    cy.contains('No object picked').should('exist');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 2);
    flyTo(120, 30, 40000);
    waitUntilPickable(0);
    hoverEntity(0);
    cy.contains('Picked Entity: Red Box', { timeout: 10000 }).should('exist');
  });

  it('useSceneDrillPick: hovers overlapping entities and drills all layers', () => {
    cy.visit('/#/core/useSceneDrillPick');
    cy.window().its('__app.viewer.entities.values.length').should('eq', 3);
    flyTo(120, 30, 60000);
    waitUntilPickable(0);
    hoverEntity(0);
    cy.contains('Layer 1 - Red', { timeout: 10000 }).should('exist');
    cy.contains('Layer 2 - Green').should('exist');
    cy.contains('Layer 3 - Blue').should('exist');
  });

  it('useScreenSpaceEventHandler: dispatches clicks with canvas coordinates', () => {
    cy.visit('/#/core/useScreenSpaceEventHandler');
    cy.get('canvas').click(400, 300);
    cy.contains('span', '"x":400').should('exist');
    cy.contains('span', '"y":300').should('exist');
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
