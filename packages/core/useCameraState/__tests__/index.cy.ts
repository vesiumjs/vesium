/// <reference types="cypress" />
import * as Cesium from 'cesium';

function parseVec3(text: string): [number, number, number] | null {
  const m = text.match(/([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)/);
  if (!m)
    return null;
  return [Number.parseFloat(m[1]!), Number.parseFloat(m[2]!), Number.parseFloat(m[3]!)];
}

function isVec3Finite(v: [number, number, number]): boolean {
  return v.every(n => Number.isFinite(n));
}

describe('useCameraState — reactive camera telemetry', () => {
  it('exposes heading/pitch/roll/level, position, and all direction vectors and reacts to camera move', () => {
    cy.visit('/#/core/useCameraState');

    cy.get('[data-testid="heading"]').should('exist').and(($el) => {
      const v = Number.parseFloat($el.text().replace(/^.*heading:\s*/, ''));
      expect(Number.isFinite(v)).to.equal(true);
    });
    cy.get('[data-testid="pitch"]').should('exist').and(($el) => {
      const v = Number.parseFloat($el.text().replace(/^.*pitch:\s*/, ''));
      expect(Number.isFinite(v)).to.equal(true);
    });
    cy.get('[data-testid="roll"]').should('exist').and(($el) => {
      expect(Number.isFinite(Number.parseFloat($el.text().replace(/^.*roll:\s*/, '')))).to.equal(true);
    });
    cy.get('[data-testid="level"]').should('exist').and(($el) => {
      const v = Number.parseInt($el.text().replace(/\D/g, ''), 10);
      expect(Number.isFinite(v)).to.equal(true);
    });
    cy.get('[data-testid="pos-lon"]').should('exist').and(($el) => {
      expect(Number.isFinite(Number.parseFloat($el.text().replace(/^.*lon:\s*/, '')))).to.equal(true);
    });
    cy.get('[data-testid="pos-lat"]').should('exist').and(($el) => {
      expect(Number.isFinite(Number.parseFloat($el.text().replace(/^.*lat:\s*/, '')))).to.equal(true);
    });
    cy.get('[data-testid="pos-height"]').should('exist').and(($el) => {
      expect(Number.isFinite(Number.parseFloat($el.text().replace(/^.*height:\s*/, '')))).to.equal(true);
    });

    for (const testId of ['position', 'position-wc', 'direction', 'direction-wc', 'up', 'up-wc', 'right', 'right-wc']) {
      cy.get(`[data-testid="${testId}"]`).should('exist').and(($el) => {
        const vec = parseVec3($el.text());
        expect(vec).to.not.equal(null);
        expect(isVec3Finite(vec!)).to.equal(true);
      });
    }

    cy.get('[data-testid="cartographic-json"]').should('exist').and(($el) => {
      expect($el.text()).to.include('"position"');
      expect($el.text()).to.include('"viewRectangle"');
    });

    cy.window().its('__app.viewer').should('exist');

    let initialHeading: number | undefined;
    cy.window().then((win) => {
      initialHeading = (win as any).__app.viewer!.camera.heading;
      (win as any).__app.viewer!.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(110, 30, 5000),
        orientation: {
          heading: Cesium.Math.toRadians(45),
          pitch: Cesium.Math.toRadians(-30),
          roll: 0,
        },
      });
    });

    cy.get('[data-testid="pitch"]').should(($el) => {
      const pitch = Number.parseFloat($el.text().replace(/^.*pitch:\s*/, ''));
      expect(pitch).to.be.closeTo(Cesium.Math.toRadians(-30), 0.25);
    });
    cy.get('[data-testid="heading"]').should(($el) => {
      const heading = Number.parseFloat($el.text().replace(/^.*heading:\s*/, ''));
      expect(Number.isFinite(heading)).to.equal(true);
      if (initialHeading !== undefined) {
        expect(heading).to.not.equal(initialHeading);
      }
    });
    cy.get('[data-testid="pos-lon"]').should(($el) => {
      const lon = Number.parseFloat($el.text().replace(/^.*lon:\s*/, ''));
      expect(lon).to.be.closeTo(110, 2);
    });
    cy.get('[data-testid="pos-lat"]').should(($el) => {
      const lat = Number.parseFloat($el.text().replace(/^.*lat:\s*/, ''));
      expect(lat).to.be.closeTo(30, 2);
    });

    for (const testId of ['direction', 'direction-wc', 'up', 'up-wc', 'right', 'right-wc']) {
      cy.get(`[data-testid="${testId}"]`).should(($el) => {
        const vec = parseVec3($el.text());
        expect(vec).to.not.equal(null);
        expect(isVec3Finite(vec!)).to.equal(true);
        expect($el.text()).to.not.include('--');
      });
    }
    cy.get('[data-testid="position"]').should(($el) => {
      const vec = parseVec3($el.text());
      expect(vec).to.not.equal(null);
      const mag = Math.hypot(vec![0], vec![1], vec![2]);
      expect(mag).to.be.greaterThan(1e6);
    });
  });
});
